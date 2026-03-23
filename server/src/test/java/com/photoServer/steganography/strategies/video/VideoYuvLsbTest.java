package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.io.File;
import java.nio.file.Files;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class VideoYuvLsbTest {

    @Test
    void testYuvLsbWithResourceFile() throws Exception {
        VideoYuvLsbStrategy strategy = new VideoYuvLsbStrategy();

        // 1. גישה לקובץ ה-Resource באמצעות Spring Bootstrap logic
        // הקובץ חייב להיות ב-src/test/resources/raw_video.yuv
        File videoFile = new ClassPathResource("raw_video.yuv").getFile();
        byte[] originalYuvData = Files.readAllBytes(videoFile.toPath());

        assertNotNull(originalYuvData, "הקובץ לא נטען כראוי");
        System.out.println("🎬 Loaded Uncompressed Video: " + videoFile.getName());
        System.out.println("📊 Data Size: " + originalYuvData.length + " bytes (YUV Domain)");

        // 2. הגדרת המסר הסודי
        String secretMessage = "HighFidelity_4K_LSB_Master";

        // 3. שלב ההטמנה (Embedding)
        byte[] stegoVideo = strategy.embed(originalYuvData, secretMessage);

        // 4. שלב השליפה (Extraction)
        String extracted = strategy.extract(stegoVideo);

        // 5. חישוב מדדי איכות אקדמיים
        double mse = calculateMSE(originalYuvData, stegoVideo);
        double psnr = calculatePSNR(mse);

        System.out.println("\n--- [RESULTS] ---");
        System.out.println("Extracted: " + extracted);
        System.out.println("MSE (Error): " + mse);
        System.out.println("PSNR (Quality): " + psnr + " dB");

        // ולידציה
        assertEquals(secretMessage, extracted, "המסר שחולץ אינו תואם למקור!");
    }

    private double calculateMSE(byte[] original, byte[] stego) {
        double sum = 0;
        for (int i = 0; i < original.length; i++) {
            sum += Math.pow((original[i] & 0xFF) - (stego[i] & 0xFF), 2);
        }
        return sum / original.length;
    }

    private double calculatePSNR(double mse) {
        if (mse == 0) return 100;
        return 10 * Math.log10((255 * 255) / mse);
    }
}
