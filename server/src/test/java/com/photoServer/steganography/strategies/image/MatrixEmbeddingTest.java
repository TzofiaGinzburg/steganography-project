package com.photoServer.steganography.strategies.image;

import org.junit.jupiter.api.Test;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;

public class MatrixEmbeddingTest {

    @Test
    void testMatrixCycle() throws Exception {
        MatrixEmbeddingStrategy strategy = new MatrixEmbeddingStrategy();

        // 1. יצירת תמונת דמי (PNG) - חייב PNG לשיטה זו!
        BufferedImage img = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", baos);
        byte[] original = baos.toByteArray();

        // 2. הודעה ארוכה כדי לבדוק קיבולת
        String secret = "Matrix Embedding is 3x more efficient than LSB!";

        // 3. הטמעה
        byte[] stego = strategy.embed(original, secret);
        assertNotNull(stego);
        System.out.println("Stego created. Size: " + stego.length);

        // 4. חילוץ
        String extracted = strategy.extract(stego);
        System.out.println("Extracted: [" + extracted + "]");

        assertEquals(secret, extracted.trim());
    }
}