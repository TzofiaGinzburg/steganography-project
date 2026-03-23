package com.photoServer.steganography.strategies.audio;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;

public class AudioParityStrategyTest {

    private AudioParityStrategy parityStrategy;

    @BeforeEach
    public void setUp() {
        parityStrategy = new AudioParityStrategy();
    }

    @Test
    public void testParityStrategyFullCycle() throws Exception {
        System.out.println("--- Starting Audio Parity REAL Full-Cycle Test ---");

        // טעינת הקובץ מתוך ה-ClassPath (src/test/resources/1.wav)
        ClassPathResource resource = new ClassPathResource("1.wav");
        if (!resource.exists()) {
            fail("Missing 1.wav in src/test/resources!");
        }

        byte[] originalAudio;
        try (InputStream is = resource.getInputStream()) {
            originalAudio = is.readAllBytes();
        }

        String secretMessage = "ParityTest123ssssssssssssssssssssssss";

        System.out.println("שלב 1: מטמיע הודעה...");
        // הטמעה
        byte[] stegoAudio = parityStrategy.embed(originalAudio, secretMessage);

        assertNotNull(stegoAudio, "הקובץ המוטמע לא יכול להיות null");

        System.out.println("שלב 2: מחלץ הודעה...");
        // חילוץ
        String extractedMessage = parityStrategy.extract(stegoAudio);

        System.out.println("Original Message: " + secretMessage);
        System.out.println("Extracted Message: [" + extractedMessage + "]");

        // אימות - השתמשתי ב-trim() למקרה של רווחים מיותרים בגלל הבלוקים
        assertEquals(secretMessage, extractedMessage != null ? extractedMessage.trim() : null,
                "The extracted message must match!");

        System.out.println("✅ SUCCESS: Parity Coding is fully functional!");
    }

    @Test
    public void testParityCapacityProtection() throws Exception {
        System.out.println("--- Testing Parity Capacity Protection ---");

        ClassPathResource resource = new ClassPathResource("1.wav");
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        // יצירת עותק נקי לפני הכל
        byte[] backup = originalAudio.clone();

        String veryLongMessage = "A".repeat(100000); // הודעה ענקית באמת

        // הרצה
        byte[] result = parityStrategy.embed(originalAudio, veryLongMessage);

        // אם ה-IF עובד, result חייב להיות זהה ל-backup
        assertArrayEquals(backup, result, "Should return original audio if message is too long");
        System.out.println("✅ Capacity protection verified.");
    }
}