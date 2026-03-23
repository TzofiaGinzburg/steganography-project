package com.photoServer.steganography.strategies.audio;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import static org.junit.jupiter.api.Assertions.*;

public class AudioDsssStrategyTest {

    private AudioDsssStrategy dsssStrategy;

    @BeforeEach
    public void setUp() {
        dsssStrategy = new AudioDsssStrategy();
    }

    @Test
    public void testDsssStrategyFullCycle() throws Exception {
        // טעינת קובץ אודיו מה-Resources (וודא שיש לך קובץ wav בתיקייה)
        ClassPathResource resource = new ClassPathResource("1.mp3");
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        String secretMessage = "Hello-DSSS-World-123jklllllllllllllllllll!";

        // 1. הטמעה
        byte[] stegoAudio = dsssStrategy.embed(originalAudio, secretMessage);
        assertNotNull(stegoAudio);
        assertTrue(stegoAudio.length >= originalAudio.length);

        // 2. חילוץ
        String extractedMessage = dsssStrategy.extract(stegoAudio);

        System.out.println("Original Message: [" + secretMessage + "]");
        System.out.println("Extracted Result: [" + extractedMessage + "]");

        assertNotNull(extractedMessage);
        assertEquals(secretMessage, extractedMessage);
        System.out.println("✅ SUCCESS! ה-DSSS עובד בצורה מושלמת.");
    }

    @Test
    public void testMessageTooLongException() throws Exception {
        ClassPathResource resource = new ClassPathResource("test_audio.wav");
        byte[] originalAudio = resource.getInputStream().readAllBytes();

        // יצירת הודעה ארוכה מאוד שתחרוג מהקיבולת
        StringBuilder longMessage = new StringBuilder();
        for(int i=0; i<5000; i++) longMessage.append("A");

        assertThrows(IllegalArgumentException.class, () -> {
            dsssStrategy.embed(originalAudio, longMessage.toString());
        });
        System.out.println("✅ SUCCESS! המערכת זיהתה הודעה ארוכה מדי וזרקה שגיאה.");
    }
}