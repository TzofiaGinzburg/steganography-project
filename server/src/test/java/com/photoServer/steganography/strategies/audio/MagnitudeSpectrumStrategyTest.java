package com.photoServer.steganography.strategies.audio;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import static org.junit.jupiter.api.Assertions.*;

public class MagnitudeSpectrumStrategyTest {

    private MagnitudeSpectrumStrategy strategy;

    @BeforeEach
    public void setUp() {
        strategy = new MagnitudeSpectrumStrategy();
    }

    @Test
    public void testSpectrumFullCycle() throws Exception {
        // מומלץ להשתמש בקובץ עם עושר תדרים (WAV)
        ClassPathResource resource = new ClassPathResource("1.wav");
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        String secretMessage = "Simphony_Secret_1011414";

        // 1. הטמעה במישור התדר
        byte[] stegoAudio = strategy.embed(originalAudio, secretMessage);
        assertNotNull(stegoAudio);

        // 2. חילוץ
        String extractedMessage = strategy.extract(stegoAudio);

        System.out.println("Spectrum Extracted: [" + extractedMessage + "]");

        assertNotNull(extractedMessage);
        assertEquals(secretMessage, extractedMessage.trim());
        System.out.println("✅ SUCCESS! המידע הוחבא בתדרים הגבוהים ללא הפרעה שמיעתית.");
    }
}
