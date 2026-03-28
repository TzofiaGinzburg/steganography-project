package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Files;
import java.util.Map;

@Component
public class VideoDCTMappingStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER = "##END##";
    // מפתח מטא-דאטה סטנדרטי שקיים ב-MP4 ולא מפריע לנגנים
    private static final String META_KEY = "comment";

    @Override
    public String getName() { return "VideoMetadataStrategy"; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        String fullPayload = getName() + "::" + secretMessage + MARKER;
        File in = null, out = null;

        try {
            in = File.createTempFile("video_in", ".mp4");
            out = File.createTempFile("video_out", ".mp4");
            Files.write(in.toPath(), coverData);

            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(in)) {
                grabber.start();

                try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(out, grabber.getImageWidth(), grabber.getImageHeight())) {
                    // הגדרות בסיסיות לוידאו
                    recorder.setVideoCodec(grabber.getVideoCodec());
                    recorder.setFormat(grabber.getFormat());
                    recorder.setFrameRate(grabber.getFrameRate());

                    // פתרון שגיאת האודיו: הגדרת ערוצים רק אם קיימים במקור
                    if (grabber.getAudioChannels() > 0) {
                        recorder.setAudioChannels(grabber.getAudioChannels());
                        recorder.setAudioCodec(grabber.getAudioCodec());
                        recorder.setSampleRate(grabber.getSampleRate());
                    }

                    // שתילת המידע הסודי בתוך המטא-דאטה
                    Map<String, String> metadata = grabber.getMetadata();
                    metadata.put(META_KEY, fullPayload);
                    recorder.setMetadata(metadata);

                    recorder.start();

                    // העתקת פריימים (וידאו ואודיו) ללא שינוי ויזואלי
                    org.bytedeco.javacv.Frame frame;
                    while ((frame = grabber.grab()) != null) {
                        recorder.record(frame);
                    }
                    recorder.stop();
                }
                grabber.stop();
            }
            return Files.readAllBytes(out.toPath());
        } catch (Exception e) {
            e.printStackTrace();
            return coverData;
        } finally {
            if (in != null) { in.delete(); }
            if (out != null) { out.delete(); }
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        File temp = null;
        try {
            temp = File.createTempFile("video_ext", ".mp4");
            Files.write(temp.toPath(), stegoData);

            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(temp)) {
                grabber.start();
                String metadataValue = grabber.getMetadata().get(META_KEY);
                grabber.stop();

                if (metadataValue != null && metadataValue.contains(MARKER)) {
                    return metadataValue.substring(metadataValue.indexOf("::") + 2, metadataValue.indexOf(MARKER));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (temp != null) { temp.delete(); }
        }
        return "ERROR:MARKER_NOT_FOUND";
    }

    @Override public MediaType getSupportedType() { return MediaType.VIDEO; }
    @Override public int calculateSuitability(FileMetrics m) { return 100; }
}