package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

public class VideoMotionVectorTest {

    @Test
    void testMVSEmbedAndExtract() throws Exception {

        VideoMotionVectorStrategy strategy = new VideoMotionVectorStrategy();

        // טען קובץ וידאו עם הרבה תנועה
        ClassPathResource resource = new ClassPathResource("2.mp4");
        if (!resource.exists()) {
            System.err.println("❌ קובץ 2.mp4 לא נמצא ב-resources!");
            return;
        }

        byte[] originalVideo;
        try (InputStream is = resource.getInputStream()) {
            originalVideo = is.readAllBytes();
        }

        String secret = "MVS_Protocol_Secure_Transmission_2026";

        System.out.println("====================================================");
        System.out.println("📊 MVS TEST — Motion Vector Steganography");
        System.out.println("====================================================");
        System.out.println("🔹 File size     : " + originalVideo.length + " bytes");
        System.out.println("🔹 Secret        : [" + secret + "]");
        System.out.println("🔹 Bits needed   : " + (secret.length() + "###END###".length()) * 8);

        // --- EMBED ---
        System.out.println("\n⏳ Starting embed...");
        long t0 = System.currentTimeMillis();
        byte[] stegoVideo = strategy.embed(originalVideo, secret);
        long embedTime = System.currentTimeMillis() - t0;

        System.out.println("⏱  Embed time    : " + embedTime + " ms");

        assertNotNull(stegoVideo,          "stegoVideo must not be null");
        assertTrue(stegoVideo.length > 0,  "stegoVideo must not be empty");
        System.out.println("📁 Stego size    : " + stegoVideo.length + " bytes");

        // שמור קובץ לבדיקה ידנית
        Path out = Paths.get("target/stego_mvs_output.mp4");
        Files.createDirectories(out.getParent());
        Files.write(out, stegoVideo);
        System.out.println("💾 Saved to      : " + out.toAbsolutePath());

        // --- EXTRACT ---
        System.out.println("\n⏳ Starting extract...");
        long t1 = System.currentTimeMillis();
        String extracted = strategy.extract(stegoVideo);
        long extractTime = System.currentTimeMillis() - t1;

        System.out.println("⏱  Extract time  : " + extractTime + " ms");

        // --- RESULTS ---
        System.out.println("\n====================================================");
        System.out.println("📥 Original      : [" + secret    + "]");
        System.out.println("📤 Extracted     : [" + extracted + "]");

        if (secret.equals(extracted)) {
            System.out.println("✅ RESULT        : SUCCESS — 100% match");
        } else {
            System.out.println("❌ RESULT        : FAILED");
            System.out.println("   Chars match   : " + countMatchingChars(secret, extracted) +
                    " / " + secret.length());
        }

        // MSE / PSNR על ה-bytes הגולמיים
        double mse  = calculateMSE(originalVideo, stegoVideo);
        double psnr = (mse == 0) ? 100.0 : 10.0 * Math.log10(65025.0 / mse);
        System.out.println("\n🎥 MSE           : " + String.format("%.4f", mse));
        System.out.println("🎥 PSNR          : " + String.format("%.2f", psnr) + " dB");
        System.out.println("   (>35 dB = high quality stego)");
        System.out.println("====================================================");

        assertEquals(secret, extracted,
                "❌ Extracted message does not match original!\n" +
                        "Expected : [" + secret    + "]\n" +
                        "Actual   : [" + extracted + "]");
    }

    // ----------------------------------------------------------------
    private double calculateMSE(byte[] a, byte[] b) {
        int len = Math.min(a.length, b.length);
        double sum = 0;
        for (int i = 0; i < len; i++) {
            int d = (a[i] & 0xFF) - (b[i] & 0xFF);
            sum += d * d;
        }
        return sum / len;
    }

    private int countMatchingChars(String a, String b) {
        int count = 0;
        int len   = Math.min(a.length(), b.length());
        for (int i = 0; i < len; i++)
            if (a.charAt(i) == b.charAt(i)) count++;
        return count;
    }
}