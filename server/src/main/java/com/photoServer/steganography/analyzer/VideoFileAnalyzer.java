package com.photoServer.steganography.analyzer;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import org.bytedeco.ffmpeg.avutil.AVFrame;
import org.bytedeco.ffmpeg.avutil.AVFrameSideData;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

// Imports סטטיים - שים לב שהם תואמים לגרסה שלך
import static org.bytedeco.ffmpeg.global.avutil.AV_FRAME_DATA_MOTION_VECTORS;
import static org.bytedeco.ffmpeg.global.avutil.av_frame_get_side_data;

@Component
public class VideoFileAnalyzer implements MediaAnalyzer {

    @Override
    public MediaType getSupportedType() {
        return MediaType.VIDEO;
    }

    @Override
    public Map<String, Double> analyze(byte[] data) {
        Map<String, Double> metrics = new HashMap<>();

        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(new ByteArrayInputStream(data))) {
            grabber.setVideoOption("flags2", "+export_mvs");
            grabber.start();

            double fps = grabber.getFrameRate();
            int width = grabber.getImageWidth();
            int height = grabber.getImageHeight();
            long totalFrames = grabber.getLengthInFrames();

            metrics.put("fps", fps);
            metrics.put("bitrateMbps", grabber.getVideoBitrate() / 1_000_000.0);
            metrics.put("width", (double) width);
            metrics.put("height", (double) height);
            // חישוב סך הפיקסלים בוידאו עבור הראוטר (Capacity Ratio)
            metrics.put("totalPixels", (double) width * height * totalFrames);

            // שליפת צפיפות וקטורים והזנה כמדד תנועה
            double mvDensity = calculateMotionVectorDensity(grabber);
            metrics.put("motionVariance", mvDensity / 100.0); // נרמול לערכים שהראוטר מכיר (0-5)

            grabber.stop();
        } catch (Exception e) {
            metrics.put("motionVariance", 0.0);
            metrics.put("fps", 24.0);
        }
        return metrics;
    }
    private double calculateMotionVectorDensity(FFmpegFrameGrabber grabber) throws Exception {
        long totalVectors = 0;
        int framesWithVectors = 0;
        int maxLookAhead = 60; // נבדוק עד 60 פריימים מההתחלה

        // שינוי לוגיקה 3: קריאה רציפה ללא setFrameNumber כדי לשמור על ה-Side Data חי
        for (int i = 0; i < maxLookAhead; i++) {
            Frame frame = grabber.grab();
            if (frame == null) break;

            // דילוג על פריימי אודיו (image == null)
            if (frame.image != null) {
                int count = extractMVCountFromFrame(frame);
                if (count > 0) {
                    totalVectors += count;
                    framesWithVectors++;
                }
            }
        }

        return (framesWithVectors > 0) ? (double) totalVectors / framesWithVectors : 0;
    }

    private int extractMVCountFromFrame(Frame frame) {
        // וידאו סטרים עם אובייקט אטום של FFmpeg
        if (frame == null || frame.opaque == null) return 0;

        try {
            // שימוש ב-Casting המדויק לספריית ה-Native
            org.bytedeco.ffmpeg.avutil.AVFrame avFrame = (org.bytedeco.ffmpeg.avutil.AVFrame) frame.opaque;

            // שליפת ה-Side Data מסוג Motion Vectors
            AVFrameSideData sideData = av_frame_get_side_data(avFrame, AV_FRAME_DATA_MOTION_VECTORS);

            if (sideData != null && !sideData.isNull()) {
                // גודל כל מבנה וקטור הוא 32 בתים בגרסאות FFmpeg מודרניות
                long numVectors = sideData.size() / 32;

                // לוג מהיר לבדיקה בזמן אמת
                if (numVectors > 0) {
                    System.out.println("✅ Frame processed: found " + numVectors + " motion vectors.");
                }

                return (int) numVectors;
            }
        } catch (Exception e) {
            return 0;
        }
        return 0;
    }

    private double decideStrategy(double fps, double mvDensity) {
        // אם יש וקטורי תנועה (מעל סף מסוים), האסטרטגיה היא Temporal (2.0)
        if (mvDensity > 50) return 2.0;
        return 1.0; // אחרת Spatial
    }

}