package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.bytedeco.ffmpeg.avutil.*;
import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.ffmpeg.global.avutil;
import org.bytedeco.javacv.*;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.ByteBuffer;
import java.nio.file.Files;

@Component
public class VideoMotionVectorStrategy extends BaseSteganoStrategy {

    private static final int MV_THRESHOLD = 0;
    private static final String MARKER = "##MV##";

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        boolean[] bits = toBits(secretMessage + MARKER);
        int bitIdx = 0;
        long totalVectorsFound = 0;

        File tempIn = null;
        File tempOut = null;

        try {
            tempIn = createTempFile(coverData);
            tempOut = File.createTempFile("stego_out", ".mp4");

            // 1. הגדרת ה-Grabber - התיקון הקריטי כאן!
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(tempIn)) {
                // חובה להגדיר את ייצוא הוקטורים לפני ה-start()
                grabber.setOption("flags2", "+export_mvs");
                grabber.start();

                // 2. הגדרת ה-Recorder
                try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(tempOut,
                        grabber.getImageWidth(), grabber.getImageHeight())) {

                    recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
                    recorder.setFormat("mp4");
                    recorder.setFrameRate(grabber.getFrameRate());
                    recorder.setVideoBitrate(grabber.getVideoBitrate());

                    // הגדרות להבטחת יצירת וקטורים בתוצאה
                    recorder.setVideoOption("preset", "medium");
                    recorder.setVideoOption("flags2", "+export_mvs");

                    // טיפול באודיו למניעת קריסה
                    if (grabber.getAudioChannels() > 0) {
                        recorder.setAudioChannels(grabber.getAudioChannels());
                        recorder.setAudioCodec(grabber.getAudioCodec());
                        recorder.setSampleRate(grabber.getSampleRate());
                    }

                    recorder.start();

                    Frame frame;
                    while ((frame = grabber.grab()) != null) {
                        if (frame.opaque != null) {
                            AVFrame avFrame = (AVFrame) frame.opaque;

                            // שליפת הוקטורים מה-Side Data של הפריים
                            AVFrameSideData sd = avutil.av_frame_get_side_data(avFrame, avutil.AV_FRAME_DATA_MOTION_VECTORS);

                            if (sd != null) {
                                int mvCount = (int) (sd.size() / new AVMotionVector().sizeof());
                                totalVectorsFound += mvCount;

                                if (bitIdx < bits.length) {
                                    bitIdx = injectLogic(avFrame, bits, bitIdx);
                                }
                            }
                        }
                        recorder.record(frame);
                    }
                    recorder.stop();
                }
                grabber.stop();
            }

            // דיווח למשתמש בטרמינל
            System.out.println("\n======================================");
            System.out.println("📊 דוח קיבולת סופי:");
            System.out.println("📍 סך הכל וקטורים שזוהו: " + totalVectorsFound);
            System.out.println("📥 ביטים שהוטמעו: " + bitIdx + " מתוך " + bits.length);
            System.out.println("======================================\n");

            if (bitIdx < bits.length) {
                throw new RuntimeException("קיבולת נמוכה מדי: נמצאו רק " + totalVectorsFound + " וקטורים.");
            }

            return Files.readAllBytes(tempOut.toPath());

        } catch (Exception e) {
            e.printStackTrace();
            return coverData;
        } finally {
            if (tempIn != null) tempIn.delete();
            if (tempOut != null) tempOut.delete();
        }
    }

    private int injectLogic(AVFrame avFrame, boolean[] bits, int bitIdx) {
        AVFrameSideData sd = avutil.av_frame_get_side_data(avFrame, avutil.AV_FRAME_DATA_MOTION_VECTORS);
        if (sd == null) return bitIdx;

        int mvSize = (int) new AVMotionVector().sizeof();
        int count = (int) (sd.size() / mvSize);
        ByteBuffer buffer = sd.data().asBuffer();

        for (int i = 0; i < count && bitIdx < bits.length; i++) {
            int pos = i * mvSize;

            // שינוי ה-LSB של קואורדינטת ה-X (נמצאת ב-offset 16)
            short dst_x = buffer.getShort(pos + 16);
            int targetBit = bits[bitIdx] ? 1 : 0;
            short newX = (short) ((dst_x & ~1) | targetBit);

            buffer.putShort(pos + 16, newX);
            bitIdx++;
        }
        return bitIdx;
    }

    @Override
    public String extract(byte[] stegoData) {
        StringBuilder bitStream = new StringBuilder();
        try {
            File tempIn = createTempFile(stegoData);
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(tempIn)) {
                // גם בחילוץ חייבים לבקש ייצוא וקטורים
                grabber.setOption("flags2", "+export_mvs");
                grabber.start();

                Frame frame;
                while ((frame = grabber.grab()) != null) {
                    if (frame.opaque != null) {
                        extractLogic((AVFrame) frame.opaque, bitStream);

                        // בדיקת המרקר כל 8 ביטים
                        if (bitStream.length() > 64 && bitStream.length() % 8 == 0) {
                            String current = bitsToText(bitStream.toString());
                            if (current.contains(MARKER)) {
                                return current.split(MARKER)[0];
                            }
                        }
                    }
                }
                grabber.stop();
            }
            tempIn.delete();
        } catch (Exception e) {
            System.err.println("❌ שגיאה בחילוץ: " + e.getMessage());
        }
        return "NOT_FOUND";
    }

    private void extractLogic(AVFrame avFrame, StringBuilder bitStream) {
        AVFrameSideData sd = avutil.av_frame_get_side_data(avFrame, avutil.AV_FRAME_DATA_MOTION_VECTORS);
        if (sd == null) return;

        int mvSize = (int) new AVMotionVector().sizeof();
        int count = (int) (sd.size() / mvSize);
        ByteBuffer buffer = sd.data().asBuffer();

        for (int i = 0; i < count; i++) {
            int pos = i * mvSize;
            short dst_x = buffer.getShort(pos + 16);
            bitStream.append(Math.abs(dst_x % 2));
        }
    }

    @Override public String getName() { return "MotionVectorStrategy"; }
    @Override public MediaType getSupportedType() { return MediaType.VIDEO; }

    @Override
    protected String bitsToText(String bits) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < bits.length() - 7; i += 8) {
            try {
                int charVal = Integer.parseInt(bits.substring(i, i + 8), 2);
                sb.append((char) charVal);
            } catch (Exception e) { break; }
        }
        return sb.toString();
    }

    private File createTempFile(byte[] data) throws Exception {
        File f = File.createTempFile("stego_v", ".mp4");
        Files.write(f.toPath(), data);
        return f;
    }

    @Override
    public int calculateSuitability(FileMetrics m) {
        return m.type() == MediaType.VIDEO ? 90 : 0;
    }
}