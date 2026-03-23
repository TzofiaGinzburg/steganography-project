package com.photoServer.steganography.strategies.image;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;

public class PatchworkTest {

    private PatchworkStrategy strategy;
    private byte[] originalImage;
    private BufferedImage bufferedImg;
    private static final String IMAGE_PATH = "6.jpg";
    private static final int BLOCK_SIZE = 32; // חייב להיות תואם לאסטרטגיה

    @BeforeEach
    void setUp() throws Exception {
        strategy = new PatchworkStrategy();
        ClassPathResource resource = new ClassPathResource(IMAGE_PATH);

        try (InputStream is = resource.getInputStream()) {
            bufferedImg = ImageIO.read(is);
            if (bufferedImg == null) fail("Could not decode image");

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImg, "jpg", baos);
            originalImage = baos.toByteArray();
        }

        // חישוב קיבולת מראש
        int w = bufferedImg.getWidth();
        int h = bufferedImg.getHeight();
        int totalBlocks = (w / BLOCK_SIZE) * (h / BLOCK_SIZE);
        int maxChars = (totalBlocks / 8) - 7; // פחות המרקר ##END##

        System.out.println("=========================================");
        System.out.println("IMAGE INFO: " + w + "x" + h);
        System.out.println("TOTAL CAPACITY: " + maxChars + " characters max");
        System.out.println("=========================================");
    }

    @Test
    void testPatchworkFullCycleWithResourceImage() {
        // בחר הודעה שנכנסת בקיבולת שחושבה ב-setUp
        String secretMessage = "HELLOPW-STAY-SAFE";

        System.out.println("Step 1: Message to hide: [" + secretMessage + "] (" + secretMessage.length() + " chars)");

        // 2. הטמעה
        long startTime = System.currentTimeMillis();
        byte[] stegoImage = strategy.embed(originalImage, secretMessage);
        long endTime = System.currentTimeMillis();

        assertNotNull(stegoImage, "Stego image should not be null");
        System.out.println("Step 2: Embedding completed in " + (endTime - startTime) + "ms");

        // 3. חילוץ
        System.out.println("Step 3: Attempting to extract message...");
        String extractedMessage = strategy.extract(stegoImage);

        System.out.println("-----------------------------------------");
        System.out.println("FINAL RESULT (Extracted): [" + extractedMessage + "]");
        System.out.println("-----------------------------------------");

        // בדיקה שהמסר חולץ נכון (בלי ה-Garbage)
        assertEquals(secretMessage, extractedMessage.trim(),
                "The extracted message must match the original exactly!");
    }
}