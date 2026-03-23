package com.photoServer.steganography.strategies.image;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource; // חובה לייבא!

import static org.junit.jupiter.api.Assertions.*;

public class OutGuessTest {

    private final OutGuessStrategy outGuess = new OutGuessStrategy();

    // OUTPUT_IMAGE_PATH נשאר כרגיל כי זה קובץ שייוצר
    private final String OUTPUT_IMAGE_PATH = "target/outguess_output_result7.jpg";

    @Test
    public void testOutGuessFullCycle() throws Exception {
        System.out.println("--- Starting OutGuess Full-Cycle Test ---");
        ClassPathResource resource = new ClassPathResource("9.jpg");
        byte[] coverData = resource.getInputStream().readAllBytes();

        String secretMessage = "xxxjbkkkkkkkkkkk";
        byte[] stegoData = outGuess.embed(coverData, secretMessage);

        // שמירה לדיסק
        java.nio.file.Path outputPath = java.nio.file.Paths.get("target/outguess_final.jpg");
        java.nio.file.Files.createDirectories(outputPath.getParent());
        java.nio.file.Files.write(outputPath, stegoData);

        // קריאה חוזרת מהדיסק (כאן קורה הקסם)
        byte[] dataFromDisk = java.nio.file.Files.readAllBytes(outputPath);
        String extractedMessage = outGuess.extract(dataFromDisk);

        System.out.println("FINAL RESULT (Extracted): " + extractedMessage);
        assertEquals(secretMessage, extractedMessage.trim());
        System.out.println("✅ SUCCESS: Data survived JPEG compression!");
    }
}