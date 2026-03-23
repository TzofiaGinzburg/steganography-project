package com.photoServer.steganography.strategies.audio;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import static org.junit.jupiter.api.Assertions.*;

public class AudioEchoStrategyTest {

    private AudioEchoStrategy echoStrategy;

    @BeforeEach
    public void setUp() {
        echoStrategy = new AudioEchoStrategy();
    }

    @Test
    public void testEchoStrategyFullCycle() throws Exception {
        AudioEchoStrategy strategy = new AudioEchoStrategy();
        ClassPathResource resource = new ClassPathResource("1.mp3");
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        String secretMessage = "22222222222222233333333333333";

        // 1. הטמעה
        byte[] stegoAudio = strategy.embed(originalAudio, secretMessage);

        // 2. חילוץ
        String extractedMessage = strategy.extract(stegoAudio);

        System.out.println("Extracted Result: [" + extractedMessage + "]");

        assertNotNull(extractedMessage);
        assertEquals(secretMessage, extractedMessage.trim());
        System.out.println("✅ SUCCESS! האלגוריתם ניצח את השקט.");
    }
}