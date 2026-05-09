package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import java.io.File;
import java.nio.file.Files;
import static org.junit.jupiter.api.Assertions.*;

public class VideoYuvLsbTest {

    @Test
    public void testYuvLsbWithResourceFile() throws Exception {
        ClassLoader cl = getClass().getClassLoader();
        java.net.URL resource = cl.getResource("raw_video.yuv");
        assertNotNull(resource, "❌ raw_video.yuv not found in test resources!");

        byte[] coverData = Files.readAllBytes(new File(resource.toURI()).toPath());
        System.out.println("🎬 Loaded raw YUV: " + coverData.length + " bytes");

        String secret = "LSB_Secret_2026";
        VideoYuvLsbStrategy strategy = new VideoYuvLsbStrategy();

        // Embed
        byte[] stegoData = strategy.embed(coverData, secret);
        assertNotNull(stegoData);
        assertTrue(stegoData.length > 0, "❌ embed() returned empty array");
        assertEquals(coverData.length, stegoData.length,
                "Stego size must match cover size (raw YUV, no container)");

        // Extract
        String extracted = strategy.extract(stegoData);
        System.out.println("🔓 Extracted: \"" + extracted + "\"");
        assertEquals(secret, extracted, "❌ Message not recovered correctly!");

        // MSE check — LSB changes should be imperceptible
        double mse = calculateMSE(coverData, stegoData);
        System.out.printf("📊 MSE (Y-plane distortion): %.4f%n", mse);
        assertTrue(mse < 1.0, "MSE too high — too many pixels were changed!");
    }

    private double calculateMSE(byte[] original, byte[] stego) {
        assertEquals(original.length, stego.length);
        long sum = 0;
        for (int i = 0; i < original.length; i++) {
            int diff = (original[i] & 0xFF) - (stego[i] & 0xFF);
            sum += (long) diff * diff;
        }
        return (double) sum / original.length;
    }
}