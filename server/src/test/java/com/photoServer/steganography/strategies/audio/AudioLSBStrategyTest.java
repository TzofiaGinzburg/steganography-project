package com.photoServer.steganography.strategies.audio;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

public class AudioLSBStrategyTest {

    private AudioLSBStrategy audioStrategy;
    private final String OUTPUT_FILE_PATH = "target/stego1.wav";

    @BeforeEach
    public void setUp() {
        audioStrategy = new AudioLSBStrategy();
    }

    @Test
    public void testAudioLSBFullCycle() throws Exception {
        System.out.println("--- Starting Audio LSB Full-Cycle Test ---");

        // 1. טעינת קובץ WAV מה-Resources (וודא שיש לך קובץ בשם sample.wav ב-src/test/resources)
        ClassPathResource resource = new ClassPathResource("1.wav");
        if (!resource.exists()) {
            fail("Missing 'sample.wav' in src/test/resources. Please add a 16-bit WAV file.");
        }
        byte[] originalAudio = resource.getInputStream().readAllBytes();
        System.out.println("Step 1: Original audio loaded (" + originalAudio.length + " bytes)");

        // 2. הגדרת הודעה סודית
        String secretMessage = "its a secret....";
        System.out.println("Step 2: Message to hide: [" + secretMessage + "]");

        // 3. ביצוע הטמעה (Embed)
        byte[] stegoAudio = audioStrategy.embed(originalAudio, secretMessage);
        assertNotNull(stegoAudio, "Embedding failed, returned null.");
        assertNotEquals(originalAudio.length, 0);

        // 4. שמירה לקובץ (כדי לבדוק שה-WAV נשאר תקין וניתן לניגון)
        Path outputPath = Paths.get(OUTPUT_FILE_PATH);
        Files.createDirectories(outputPath.getParent());
        Files.write(outputPath, stegoAudio);
        System.out.println("Step 3: Stego audio saved to: " + outputPath.toAbsolutePath());

        // 5. חילוץ מהקובץ שנשמר (בדיקת עמידות הכתיבה)
        System.out.println("Step 4: Attempting to extract message from disk...");
        byte[] audioFromDisk = Files.readAllBytes(outputPath);
        String extractedMessage = audioStrategy.extract(audioFromDisk);

        System.out.println("-----------------------------------------");
        System.out.println("FINAL RESULT (Extracted): " + extractedMessage);
        System.out.println("-----------------------------------------");

        // 6. בדיקת השוואה
        assertEquals(secretMessage, extractedMessage, "Extraction failed - messages do not match!");
        System.out.println("✅ SUCCESS: Audio LSB works perfectly and survived disk write!");
    }
}