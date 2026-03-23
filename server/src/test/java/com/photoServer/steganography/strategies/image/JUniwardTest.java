package com.photoServer.steganography.strategies.image;

import org.junit.jupiter.api.Test;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.*;

public class JUniwardTest {

    @Test
    public void testJUniwardFullCycle() throws Exception {
        // וודא שיש לך קובץ בשם 3.jpg בתוך resources
        String inputPath = "src/main/resources/3.jpg";
        String outputPath = "target/juniward_result3.jpg";

        JUniwardStrategy juniward = new JUniwardStrategy();
        String secretMessage = "DCT Secret Message1212121";

        System.out.println("--- Starting J-UNIWARD (DCT) Local Test ---");

        File inputFile = new File(inputPath);
        assertTrue(inputFile.exists(), "Image 3.jpg not found in resources!");

        byte[] originalBytes = Files.readAllBytes(Paths.get(inputPath));

        // הטמנה במרחב התדר
        byte[] stegoBytes = juniward.embed(originalBytes, secretMessage);
        Files.write(Paths.get(outputPath), stegoBytes);

        // חילוץ ממקדמי ה-DCT
        String extractedMessage = juniward.extract(stegoBytes);

        System.out.println("Extracted: " + extractedMessage);
        assertEquals(secretMessage, extractedMessage.trim(), "J-UNIWARD extraction failed!");
        System.out.println("✅ J-UNIWARD Success!");
    }
}
