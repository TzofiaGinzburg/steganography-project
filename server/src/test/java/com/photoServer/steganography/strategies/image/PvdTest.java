package com.photoServer.steganography.strategies.image;

import org.junit.jupiter.api.Test;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.*;

public class PvdTest {

    @Test
    public void testPvdFullCycle() throws Exception {
        String inputPath = "src/main/resources/1.png";
        String outputPath = "target/pvd_result.png";

        PvdImage pvd = new PvdImage();
        String secretMessage = "Hello, PVD secret!";

        System.out.println("--- Starting PVD Local Test ---");

        File inputFile = new File(inputPath);
        assertTrue(inputFile.exists(), "Image 1.png not found!");

        byte[] originalBytes = Files.readAllBytes(Paths.get(inputPath));

        // הטמנה
        byte[] stegoBytes = pvd.embed(originalBytes, secretMessage);
        Files.write(Paths.get(outputPath), stegoBytes);

        // חילוץ
        String extractedMessage = pvd.extract(stegoBytes);

        System.out.println("Extracted: " + extractedMessage);
        assertEquals(secretMessage, extractedMessage.trim(), "PVD extraction failed!");
        System.out.println("✅ PVD Success!");
    }
}