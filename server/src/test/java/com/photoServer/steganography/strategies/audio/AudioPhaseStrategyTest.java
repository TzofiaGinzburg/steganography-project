package com.photoServer.steganography.strategies.audio;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AudioPhaseStrategyTest {

    private AudioPhaseStrategy phaseStrategy;

    @BeforeEach
    public void setUp() {
        phaseStrategy = new AudioPhaseStrategy();
    }

    @Test
    public void testPhaseStrategyFullCycle() throws Exception {
        System.out.println("--- Starting Audio Phase REAL Full-Cycle Test ---");

        ClassPathResource resource = new ClassPathResource("1.wav");
        if (!resource.exists()) {
            fail("Missing 1.wav in src/test/resources!");
        }
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        String secretMessage = "Phase1sssssssssssssssassss";

        // הטמעה
        byte[] stegoAudio = phaseStrategy.embed(originalAudio, secretMessage);

        // חילוץ
        String extractedMessage = phaseStrategy.extract(stegoAudio);

        System.out.println("Original Message: " + secretMessage);
        System.out.println("Extracted Message: [" + extractedMessage + "]");

        assertEquals(secretMessage, extractedMessage.trim(), "The extracted message must match!");
        System.out.println("✅ SUCCESS: Phase Coding is fully functional!");
    }
}