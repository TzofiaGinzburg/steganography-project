package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.ffmpeg.global.avutil;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.bytedeco.javacv.Frame;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Component
public class VideoFrameRateModulationStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER        = "##END##";

    // שינוי תזמון של 5ms לכל פריים שמקודד '1'
    // בסרטון 60fps, מרווח בסיסי = 16.67ms → שינוי של 5ms = ~30% סטייה
    // בלתי נראה לצופה, אך ניתן לזיהוי אלגוריתמי
    private static final long TIMING_DELTA_US = 5_000L; // 5ms במיקרו-שניות

    // סף זיהוי: אם הסטייה > מחצית ה-DELTA → ביט '1'
    private static final long DETECTION_THRESHOLD_US = TIMING_DELTA_US / 2;

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        File tempIn  = null;
        File tempOut = null;
        try {
            tempIn  = createTempFile(coverData, ".mkv");
            tempOut = File.createTempFile("stego_out_", ".mkv");

            String fullMessage = secretMessage + MARKER;
            byte[] msgBytes    = fullMessage.getBytes("UTF-8");
            int    totalBits   = msgBytes.length * 8;

            List<Frame> frames = new ArrayList<>();
            double      frameRate;
            int         width, height;

            // --- שלב 1: קרא את כל הפריימים ---
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(tempIn)) {
                grabber.start();

                frameRate = grabber.getFrameRate() > 0 ? grabber.getFrameRate() : 60;
                width     = grabber.getImageWidth();
                height    = grabber.getImageHeight();
                if (width  % 2 != 0) width--;
                if (height % 2 != 0) height--;

                Frame f;
                while ((f = grabber.grabImage()) != null) {
                    if (f.image != null) frames.add(f.clone());
                }
                grabber.stop();
            }

            System.out.println("📊 Total frames   : " + frames.size());
            System.out.println("📊 Bits to embed  : " + totalBits);
            System.out.println("📊 Frame rate     : " + frameRate + " fps");

            if (frames.size() < totalBits) {
                System.err.println("❌ Not enough frames!");
                return new byte[0];
            }

            // מרווח בסיסי בין פריימים במיקרו-שניות
            long baseIntervalUs = (long) (1_000_000.0 / frameRate);
            System.out.println("📊 Base interval  : " + baseIntervalUs + " µs");

            // --- שלב 2: כתוב לקובץ MKV עם MJPEG (lossless timestamps) ---
            try (FFmpegFrameRecorder recorder =
                         new FFmpegFrameRecorder(tempOut, width, height, 0)) {

                // MKV + MJPEG: שומר timestamps בדיוק ms — ללא נרמול
                recorder.setFormat("matroska");
                recorder.setVideoCodec(avcodec.AV_CODEC_ID_MJPEG);
                recorder.setPixelFormat(avutil.AV_PIX_FMT_YUVJ420P);
                recorder.setFrameRate(frameRate);
                recorder.setVideoQuality(3); // איכות גבוהה
                recorder.setAudioChannels(0);

                // חשוב: timebase של 1/1000000 (מיקרו-שניות) לדיוק מקסימלי
                recorder.setVideoOption("time_base", "1/1000000");
                recorder.start();

                long currentPts = 0;

                for (int i = 0; i < frames.size(); i++) {
                    long interval = baseIntervalUs;

                    // קידוד ביט: האם לסטות מהתזמון הרגיל?
                    if (i < totalBits) {
                        int byteIdx = i / 8;
                        int bitPos  = 7 - (i % 8);
                        int bit     = (msgBytes[byteIdx] >> bitPos) & 1;

                        if (bit == 1) {
                            interval += TIMING_DELTA_US; // עיכוב של 5ms = ביט '1'
                        }
                        // bit == 0 → מרווח רגיל, ללא עיכוב
                    }

                    recorder.setTimestamp(currentPts);
                    recorder.record(frames.get(i));
                    currentPts += interval;
                }

                recorder.stop();
            }

            byte[] result = Files.readAllBytes(tempOut.toPath());
            System.out.println("📊 Output size    : " + result.length + " bytes");
            return result;

        } catch (Exception e) {
            System.err.println("Encoding failed: " + e.getMessage());
            e.printStackTrace();
            return new byte[0];
        } finally {
            cleanup(tempIn);
            cleanup(tempOut);
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        File tempIn = null;
        try {
            tempIn = createTempFile(stegoData, ".mkv");

            List<Long> timestamps = new ArrayList<>();

            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(tempIn)) {
                grabber.start();

                double fps = grabber.getFrameRate() > 0 ? grabber.getFrameRate() : 60;
                System.out.println("📊 Extract FPS    : " + fps);

                Frame frame;
                while ((frame = grabber.grabImage()) != null) {
                    if (frame.image != null) {
                        timestamps.add(grabber.getTimestamp());
                    }
                }
                grabber.stop();
            }

            System.out.println("📊 Frames found   : " + timestamps.size());
            if (timestamps.size() < 2) return "MARKER_NOT_FOUND";

            // --- שליפה: מחשב את המרווח בין פריימים רצופים ---
            // המרווח הבסיסי = החציון של כל המרווחים
            long[] deltas = new long[timestamps.size() - 1];
            for (int i = 0; i < deltas.length; i++) {
                deltas[i] = timestamps.get(i + 1) - timestamps.get(i);
            }

            long[] sorted = deltas.clone();
            java.util.Arrays.sort(sorted);
            long medianDelta = sorted[sorted.length / 2];
            System.out.println("📊 Median delta   : " + medianDelta + " µs");

            // DEBUG: הדפס 16 מרווחים ראשונים
            System.out.println("--- First 16 deltas ---");
            for (int i = 0; i < Math.min(16, deltas.length); i++) {
                long diff = deltas[i] - medianDelta;
                System.out.printf("  delta[%2d] = %6d µs  (diff from median: %+d)  → bit=%d%n",
                        i, deltas[i], diff,
                        (diff > DETECTION_THRESHOLD_US) ? 1 : 0);
            }

            // --- פענוח ביטים ---
            StringBuilder bitStream = new StringBuilder();
            for (int i = 0; i < deltas.length; i++) {
                long diff = deltas[i] - medianDelta;
                int  bit  = (diff > DETECTION_THRESHOLD_US) ? 1 : 0;
                bitStream.append(bit);

                if (bitStream.length() % 8 == 0) {
                    String text = bitsToText(bitStream.toString());
                    if (text.contains(MARKER)) {
                        return text.split(java.util.regex.Pattern.quote(MARKER))[0];
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        } finally {
            cleanup(tempIn);
        }
        return "MARKER_NOT_FOUND";
    }

    private String bitsToText(String bits) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= bits.length() - 8; i += 8) {
            try {
                sb.append((char) Integer.parseInt(bits.substring(i, i + 8), 2));
            } catch (Exception e) { break; }
        }
        return sb.toString();
    }

    private File createTempFile(byte[] data, String ext) throws IOException {
        File temp = File.createTempFile("stego_tmp_", ext);
        Files.write(temp.toPath(), data);
        return temp;
    }

    private void cleanup(File f) {
        if (f != null && f.exists()) f.delete();
    }

    @Override public String getName()                              { return "Video-FrameTiming-Steganography"; }
    @Override public MediaType getSupportedType()                  { return MediaType.VIDEO;                   }
    @Override public int calculateSuitability(FileMetrics metrics) { return 90;                               }
}