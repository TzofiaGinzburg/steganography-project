package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

public class VideoDCTMappingStrategyTest {

    @Test
    void testDCTEmbedAndExtract() throws Exception {
        VideoDCTMappingStrategy strategy = new     VideoDCTMappingStrategy();

        // טעינת קובץ הוידאו
        String fileName = "1.mp4";
        ClassPathResource resource = new ClassPathResource(fileName);
        if (!resource.exists()) {
            System.err.println("❌ File not found: " + fileName);
            return;
        }

        byte[] originalVideo;
        try (InputStream is = resource.getInputStream()) {
            originalVideo = is.readAllBytes();
        }

        String secret = "DCT_Stego_2026";

        System.out.println("====================================================");
        System.out.println("📊 DCT COEFFICIENT TEST");
        System.out.println("====================================================");
        System.out.println("🔹 File size  : " + originalVideo.length + " bytes");
        System.out.println("🔹 Secret     : [" + secret + "]");
        System.out.println("🔹 Bits needed: " + (secret.length() + "###END###".length()) * 8);

        // EMBED
        System.out.println("\n⏳ Starting embed...");
        long t0 = System.currentTimeMillis();
        byte[] stegoVideo = strategy.embed(originalVideo, secret);
        long embedTime = System.currentTimeMillis() - t0;

        System.out.println("⏱  Embed time : " + embedTime + " ms");
        System.out.println("📁 Stego size : " + stegoVideo.length + " bytes");

        assertTrue(stegoVideo.length > 0, "stegoVideo must not be empty");
        assertTrue(stegoVideo.length > originalVideo.length * 0.1,
                "Stego file too small: " + stegoVideo.length + " bytes");

        // שמור לדיסק לבדיקה ידנית
        Path outPath = Paths.get("target/stego_dct_output.mp4");
        Files.write(outPath, stegoVideo);
        System.out.println("💾 Saved to   : " + outPath.toAbsolutePath());

        // EXTRACT
        System.out.println("\n⏳ Starting extract...");
        t0 = System.currentTimeMillis();
        String extracted = strategy.extract(stegoVideo);
        long extractTime = System.currentTimeMillis() - t0;

        System.out.println("⏱  Extract time: " + extractTime + " ms");

        // תוצאות
        System.out.println("\n====================================================");
        System.out.println("📥 Original  : [" + secret + "]");
        System.out.println("📤 Extracted : [" + extracted + "]");

        int matches = 0;
        int minLen = Math.min(secret.length(), extracted.length());
        for (int i = 0; i < minLen; i++) {
            if (secret.charAt(i) == extracted.charAt(i)) matches++;
        }

        if (secret.equals(extracted)) {
            System.out.println("✅ RESULT     : SUCCESS — 100% match");
        } else {
            System.out.println("❌ RESULT     : FAILED");
            System.out.println("   Chars match: " + matches + " / " + secret.length());
        }
        System.out.println("====================================================");

        assertEquals(secret, extracted, "❌ Extracted message does not match original!");
        System.out.println("✅ Test Passed!");
    }
}
