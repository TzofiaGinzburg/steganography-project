package com.photoServer.steganography.strategies.image;

import org.junit.jupiter.api.Test;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.*;

public class SpreadTest {

    @Test
    public void testSpreadSpectrumFullCycle() throws Exception {
        String inputPath = "src/main/resources/2.png";
        String outputPath = "target/sss_result.png";

        SpreadSpectrumImage sss = new SpreadSpectrumImage();
        String secretMessage = "SSS Secret: Data is hidden!";

        System.out.println("--- Starting Spread Spectrum Local Test ---");

        File inputFile = new File(inputPath);
        assertTrue(inputFile.exists(), "Image 2.png not found!");

        byte[] originalBytes = Files.readAllBytes(Paths.get(inputPath));

        // הטמנה
        byte[] stegoBytes = sss.embed(originalBytes, secretMessage);
        Files.write(Paths.get(outputPath), stegoBytes);

        // חילוץ
        String extractedMessage = sss.extract(stegoBytes);

        System.out.println("Extracted: " + extractedMessage);
        assertEquals(secretMessage, extractedMessage.trim(), "Spread Spectrum extraction failed!");
        System.out.println("✅ Spread Spectrum Success!");
    }
}
