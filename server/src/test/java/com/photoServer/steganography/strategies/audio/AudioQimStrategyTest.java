package com.photoServer.steganography.strategies.audio;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import static org.junit.jupiter.api.Assertions.*;

public class AudioQimStrategyTest {

    private AudioQimStrategy qimStrategy;

    @BeforeEach
    public void setUp() {
        qimStrategy = new AudioQimStrategy(); // כאן תשתמש ב-AudioQimStrategy
    }

    @Test
    public void testQimFullCycle() throws Exception {
        ClassPathResource resource = new ClassPathResource("1.mp3");
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        String secretMessage = "QIM-Robust-Protocol-2024";

        // 1. הטמעה
        byte[] stegoAudio = qimStrategy.embed(originalAudio, secretMessage);
        assertNotNull(stegoAudio);

        // 2. חילוץ
        String extractedMessage = qimStrategy.extract(stegoAudio);

        System.out.println("QIM Extracted: [" + extractedMessage + "]");

        assertEquals(secretMessage, extractedMessage);
        System.out.println("✅ SUCCESS! QIM הצליח לשחזר את המידע בדיוק מושלם.");
    }
}