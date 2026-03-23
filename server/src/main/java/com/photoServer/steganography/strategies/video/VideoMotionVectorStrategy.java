package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.ffmpeg.global.avutil;
import org.bytedeco.javacv.*;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Component
public class VideoMotionVectorStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER = "###END###";

    // סף תנועה — רק macroblocks עם תנועה גבוהה ישמשו לקידוד
    private static final int MOTION_THRESHOLD = 8;

    // כמות ביטים לפיקסל אחד (LSB בלבד = שינוי מקסימלי של 1)
    // PSNR = 20*log10(255/1) ≈ 48 dB לפיקסל בודד
    private static final int BITS_PER_MACROBLOCK = 1;

    // גודל macroblock ב-H.264
    private static final int MB_SIZE = 16;

    // ================================================================
    // EMBED
    // ================================================================
    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        File tempIn  = null;
        File tempOut = null;
        try {
            System.out.println("====================================================");
            System.out.println("🎬 MVS EMBED — Motion-Region LSB Steganography");
            System.out.println("====================================================");

            byte[] msgBytes  = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
            int    totalBits = msgBytes.length * 8;
            System.out.println("📝 Message    : " + secretMessage);
            System.out.println("📝 Total bits : " + totalBits);

            long t0 = System.currentTimeMillis();

            tempIn  = File.createTempFile("mvs_in_",  ".mp4");
            tempOut = File.createTempFile("mvs_out_", ".mp4");
            Files.write(tempIn.toPath(), coverData);

            // שלב 1: קרא את כל הפריימים
            List<FrameData> frames = readAllFrames(tempIn.getAbsolutePath());
            System.out.println("📦 Frames loaded: " + frames.size());

            if (frames.isEmpty()) {
                System.err.println("❌ No frames extracted");
                return new byte[0];
            }

            // שלב 2: מצא אזורי תנועה ובנה מפת slots
            List<SlotLocation> slots = buildMotionSlots(frames);
            System.out.println("📦 Motion slots available: " + slots.size());
            System.out.println("📦 Bits needed           : " + totalBits);

            if (slots.size() < totalBits) {
                System.err.println("⚠️  Not enough motion slots! Have " +
                        slots.size() + ", need " + totalBits);
                return new byte[0];
            }

            // שלב 3: פיזור אחיד — חשב stride
            double stride = (double) slots.size() / totalBits;
            System.out.printf("📊 Stride: %.2f slots/bit%n", stride);

            // שלב 4: הטמע ביטים לפי stride אחיד
            for (int bitIdx = 0; bitIdx < totalBits; bitIdx++) {
                int slotIdx = (int) Math.round(bitIdx * stride);
                if (slotIdx >= slots.size()) slotIdx = slots.size() - 1;

                SlotLocation slot = slots.get(slotIdx);
                int bit = (msgBytes[bitIdx / 8] >> (7 - (bitIdx % 8))) & 1;

                // שנה LSB של ערך Y של הפיקסל הנבחר
                setYLsb(frames.get(slot.frameIdx), slot.pixelX, slot.pixelY, bit);
            }

            System.out.println("📊 Embedding complete: " + totalBits + " bits");

            // שלב 5: כתוב חזרה ל-MP4 עם timestamps מקוריים
            writeFramesToMp4(frames, tempIn.getAbsolutePath(), tempOut.getAbsolutePath());

            byte[] result = Files.readAllBytes(tempOut.toPath());
            System.out.printf("✅ Output: %d bytes  ⏱ %dms%n",
                    result.length, System.currentTimeMillis() - t0);
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        } finally {
            cleanup(tempIn);
            cleanup(tempOut);
        }
    }

    // ================================================================
    // EXTRACT
    // ================================================================
    @Override
    public String extract(byte[] stegoData) {
        File tempIn = null;
        try {
            System.out.println("====================================================");
            System.out.println("🔍 MVS EXTRACT");
            System.out.println("====================================================");

            tempIn = File.createTempFile("mvs_in_", ".mp4");
            Files.write(tempIn.toPath(), stegoData);

            List<FrameData> frames = readAllFrames(tempIn.getAbsolutePath());
            System.out.println("📦 Frames loaded: " + frames.size());

            List<SlotLocation> slots = buildMotionSlots(frames);
            System.out.println("📦 Motion slots: " + slots.size());

            // נסה לשלוף לאורכי הודעה שונים עם stride תואם
            for (int msgLen = 1; msgLen <= 1000; msgLen++) {
                int    totalBits = (msgLen + MARKER.length()) * 8;
                if (totalBits > slots.size()) break;

                double stride = (double) slots.size() / totalBits;
                StringBuilder bits = new StringBuilder();

                for (int bitIdx = 0; bitIdx < totalBits; bitIdx++) {
                    int slotIdx = (int) Math.round(bitIdx * stride);
                    if (slotIdx >= slots.size()) slotIdx = slots.size() - 1;

                    SlotLocation slot = slots.get(slotIdx);
                    bits.append(getYLsb(frames.get(slot.frameIdx),
                            slot.pixelX, slot.pixelY));

                    if (bits.length() % 8 == 0) {
                        String text = bitsToText(bits.toString());
                        if (text.contains(MARKER)) {
                            String result = text.split(
                                    java.util.regex.Pattern.quote(MARKER))[0];
                            System.out.println("✅ Extracted: " + result);
                            return result;
                        }
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

    // ================================================================
    // FRAME I/O
    // ================================================================

    private List<FrameData> readAllFrames(String path) throws Exception {
        List<FrameData> frames = new ArrayList<>();

        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(path)) {
            grabber.start();

            Frame f;
            int idx = 0;
            while ((f = grabber.grabImage()) != null) {
                if (f.image == null) continue;

                // שמור clone של הפריים + timestamp מדויק
                FrameData fd = new FrameData();
                fd.frame     = f.clone();
                fd.timestamp = grabber.getTimestamp();
                fd.width     = f.imageWidth;
                fd.height    = f.imageHeight;
                fd.stride    = f.imageStride;
                fd.index     = idx++;
                frames.add(fd);
            }
            grabber.stop();
        }
        return frames;
    }

    private void writeFramesToMp4(List<FrameData> frames,
                                  String originalPath,
                                  String outputPath) throws Exception {
        if (frames.isEmpty()) return;

        // קרא פרמטרים מהמקורי
        double fps;
        int    bitrate;
        int    width  = frames.get(0).width;
        int    height = frames.get(0).height;

        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(originalPath)) {
            grabber.start();
            fps     = grabber.getFrameRate() > 0 ? grabber.getFrameRate() : 30;
            bitrate = grabber.getVideoBitrate() > 0 ? grabber.getVideoBitrate() : 2_000_000;
            grabber.stop();
        }

        // תיקון רזולוציה זוגית
        if (width  % 2 != 0) width--;
        if (height % 2 != 0) height--;

        System.out.printf("📦 Encoding: %dx%d @ %.1ffps  bitrate=%d%n",
                width, height, fps, bitrate);

        try (FFmpegFrameRecorder recorder =
                     new FFmpegFrameRecorder(outputPath, width, height, 0)) {

            recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("mp4");
            recorder.setPixelFormat(avutil.AV_PIX_FMT_YUV420P);
            recorder.setFrameRate(fps);
            recorder.setVideoBitrate(bitrate);

            // הגדרות איכות גבוהה — CRF נמוך = PSNR גבוה
            recorder.setVideoOption("preset",  "slow");
            recorder.setVideoOption("tune",    "psnr");
            recorder.setVideoOption("crf",     "18");   // ~40+ dB PSNR
            recorder.setVideoOption("profile", "high");
            recorder.setAudioChannels(0);
            recorder.start();

            for (FrameData fd : frames) {
                // שחזר timestamp מקורי מדויק
                recorder.setTimestamp(fd.timestamp);
                recorder.record(fd.frame);
            }

            recorder.stop();
        }

        // העתק audio מהמקורי
        copyAudio(originalPath, outputPath);
    }

    /**
     * מעתיק את ה-audio track מהמקורי ל-output.
     */
    private void copyAudio(String originalPath, String outputPath) {
        File tempMerge = null;
        try {
            tempMerge = File.createTempFile("mvs_merge_", ".mp4");

            // קרא audio מהמקורי
            byte[] audioData = extractAudioTrack(originalPath);
            if (audioData == null || audioData.length == 0) {
                System.out.println("📦 No audio track to copy");
                return;
            }

            // מיזוג audio + video
            mergeAudioVideo(outputPath, audioData, tempMerge.getAbsolutePath());

            // החלף את ה-output
            Files.write(new File(outputPath).toPath(),
                    Files.readAllBytes(tempMerge.toPath()));
            System.out.println("📦 Audio merged successfully");

        } catch (Exception e) {
            System.out.println("⚠️  Audio copy skipped: " + e.getMessage());
        } finally {
            cleanup(tempMerge);
        }
    }

    private byte[] extractAudioTrack(String path) {
        // שימוש ב-FFmpegFrameGrabber לחילוץ audio packets
        // מוחזר כ-raw AAC data עבור מיזוג מאוחר
        // אם אין audio — מחזיר null
        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(path)) {
            grabber.start();
            if (grabber.getAudioChannels() == 0) {
                grabber.stop();
                return null;
            }
            grabber.stop();
            // יש audio — נחזיר את הנתיב המקורי לצרכי מיזוג
            return path.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            return null;
        }
    }

    private void mergeAudioVideo(String videoPath, byte[] audioPathBytes,
                                 String outputPath) throws Exception {
        String audioPath = new String(audioPathBytes, StandardCharsets.UTF_8);

        // קרא video frames מה-video-only file
        List<FrameData> videoFrames = readAllFrames(videoPath);

        double fps;
        int    bitrate;
        try (FFmpegFrameGrabber g = new FFmpegFrameGrabber(videoPath)) {
            g.start();
            fps     = g.getFrameRate() > 0 ? g.getFrameRate() : 30;
            bitrate = g.getVideoBitrate() > 0 ? g.getVideoBitrate() : 2_000_000;
            g.stop();
        }

        int width  = videoFrames.isEmpty() ? 0 : videoFrames.get(0).width;
        int height = videoFrames.isEmpty() ? 0 : videoFrames.get(0).height;
        if (width % 2 != 0) width--;
        if (height % 2 != 0) height--;

        // קרא audio frames
        List<Frame> audioFrames = new ArrayList<>();
        int audioChannels = 0;
        int audioSampleRate = 0;
        int audioFormat = 0;

        try (FFmpegFrameGrabber ag = new FFmpegFrameGrabber(audioPath)) {
            ag.start();
            audioChannels   = ag.getAudioChannels();
            audioSampleRate = ag.getSampleRate();
            audioFormat     = ag.getSampleFormat();
            Frame af;
            while ((af = ag.grabSamples()) != null) {
                audioFrames.add(af.clone());
            }
            ag.stop();
        }

        // כתוב merged output
        try (FFmpegFrameRecorder recorder =
                     new FFmpegFrameRecorder(outputPath, width, height, audioChannels)) {

            recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("mp4");
            recorder.setPixelFormat(avutil.AV_PIX_FMT_YUV420P);
            recorder.setFrameRate(fps);
            recorder.setVideoBitrate(bitrate);
            recorder.setVideoOption("preset", "slow");
            recorder.setVideoOption("crf",    "18");
            recorder.setAudioChannels(audioChannels);
            recorder.setSampleRate(audioSampleRate);
            recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);
            recorder.setAudioBitrate(192_000);
            recorder.start();

            // כתוב video
            for (FrameData fd : videoFrames) {
                recorder.setTimestamp(fd.timestamp);
                recorder.record(fd.frame);
            }

            // כתוב audio
            for (Frame af : audioFrames) {
                recorder.record(af);
            }

            recorder.stop();
        }
    }

    // ================================================================
    // MOTION DETECTION — מציאת אזורי תנועה בין פריימים עוקבים
    // ================================================================

    /**
     * בונה רשימת SlotLocations — פיקסלים שנמצאים באזורי תנועה גבוהה.
     * מיוזרת לפיזור אחיד על פני כל הוידאו.
     *
     * אלגוריתם:
     * 1. לכל זוג פריימים עוקבים, חשב הפרש Y ב-macroblocks של 16x16
     * 2. macroblock עם הפרש ממוצע > MOTION_THRESHOLD = אזור תנועה
     * 3. בחר פיקסל מייצג מכל macroblock (המרכז)
     */
    private List<SlotLocation> buildMotionSlots(List<FrameData> frames) {
        List<SlotLocation> slots = new ArrayList<>();

        for (int i = 1; i < frames.size(); i++) {
            FrameData prev = frames.get(i - 1);
            FrameData curr = frames.get(i);

            if (prev.frame.image == null || curr.frame.image == null) continue;

            ByteBuffer prevY = (ByteBuffer) prev.frame.image[0];
            ByteBuffer currY = (ByteBuffer) curr.frame.image[0];

            int width  = curr.width;
            int height = curr.height;
            int stride = curr.stride;

            // סרוק macroblocks
            for (int mbY = 0; mbY + MB_SIZE <= height; mbY += MB_SIZE) {
                for (int mbX = 0; mbX + MB_SIZE <= width; mbX += MB_SIZE) {

                    // חשב תנועה ממוצעת ב-macroblock זה
                    long motionSum = 0;
                    int  count     = 0;

                    for (int dy = 0; dy < MB_SIZE; dy += 2) { // דגימה כל 2 שורות
                        for (int dx = 0; dx < MB_SIZE; dx += 2) {
                            int pos = (mbY + dy) * stride + (mbX + dx);
                            if (pos >= prevY.limit() || pos >= currY.limit()) continue;

                            int diff = Math.abs(
                                    (prevY.get(pos) & 0xFF) - (currY.get(pos) & 0xFF));
                            motionSum += diff;
                            count++;
                        }
                    }

                    if (count == 0) continue;
                    double avgMotion = (double) motionSum / count;

                    // רק macroblocks עם תנועה מעל הסף
                    if (avgMotion > MOTION_THRESHOLD) {
                        // פיקסל מייצג = מרכז ה-macroblock
                        int centerX = mbX + MB_SIZE / 2;
                        int centerY = mbY + MB_SIZE / 2;
                        slots.add(new SlotLocation(i, centerX, centerY));
                    }
                }
            }
        }

        return slots;
    }

    // ================================================================
    // PIXEL LSB ACCESS — YUV420P
    // ================================================================

    private void setYLsb(FrameData fd, int x, int y, int bit) {
        if (fd.frame.image == null) return;
        ByteBuffer yPlane = (ByteBuffer) fd.frame.image[0];
        int pos = y * fd.stride + x;
        if (pos >= yPlane.limit()) return;

        int val = yPlane.get(pos) & 0xFF;
        val = (val & 0xFE) | (bit & 1);
        yPlane.put(pos, (byte) val);
    }

    private int getYLsb(FrameData fd, int x, int y) {
        if (fd.frame.image == null) return 0;
        ByteBuffer yPlane = (ByteBuffer) fd.frame.image[0];
        int pos = y * fd.stride + x;
        if (pos >= yPlane.limit()) return 0;
        return yPlane.get(pos) & 1;
    }

    // ================================================================
    // UTILS
    // ================================================================

    private String bitsToText(String bits) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= bits.length() - 8; i += 8)
            sb.append((char) Integer.parseInt(bits.substring(i, i + 8), 2));
        return sb.toString();
    }

    private void cleanup(File f) {
        if (f != null && f.exists()) f.delete();
    }

    // ================================================================
    // INNER CLASSES
    // ================================================================

    private static class FrameData {
        Frame  frame;
        long   timestamp;
        int    width, height, stride;
        int    index;
    }

    private static class SlotLocation {
        final int frameIdx;
        final int pixelX;
        final int pixelY;

        SlotLocation(int frameIdx, int pixelX, int pixelY) {
            this.frameIdx = frameIdx;
            this.pixelX   = pixelX;
            this.pixelY   = pixelY;
        }
    }

    @Override public String getName()                              { return "MVS-MotionRegion-LSB";  }
    @Override public MediaType getSupportedType()                  { return MediaType.VIDEO;          }
    @Override public int calculateSuitability(FileMetrics metrics) { return 100;                     }
}