package com.photoServer.steganography.strategies.image;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class PatchworkStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER = "##END##";
    private static final int BLOCK_SIZE = 32;
    private static final int SHIFT = 12;
    private static final int PAIRS_PER_BLOCK = 150;
    private static final long SEED = 42L;

    @Override
    public String getName() { return "PatchworkStrategy"; }

    @Override
    public MediaType getSupportedType() { return MediaType.IMAGE; }

    @Override
    public int calculateSuitability(FileMetrics metrics) {
        int w = (int) metrics.getMetric("width");
        int h = (int) metrics.getMetric("height");
        double entropy = metrics.getMetric("entropy");

        // 1. בדיקת קיבולת בסיסית - האם התמונה בכלל גדולה מספיק לבלוקים?
        int totalBlocks = (w / BLOCK_SIZE) * (h / BLOCK_SIZE);
        if (totalBlocks < 40) return 0; // קטנה מדי אפילו למסר קצר

        // 2. שקלול אנטרופיה (מחפשים את ה-Sweet Spot)
        int score = 50;
        if (entropy > 0.3 && entropy < 0.65) {
            score = 100; // אידיאלי: מספיק טקסטורה להסתיר, מספיק שקט לחלץ
        } else if (entropy <= 0.3) {
            score = 40;  // חלק מדי - יראו את ה"לכלוך"
        } else {
            score = 60;  // רועש מדי - סכנה לשגיאות ביטים בחילוץ
        }

        return score;
    }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(coverData));
            int w = img.getWidth(), h = img.getHeight();

            // בדיקת קיבולת בזמן אמת
            byte[] msgBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
            int requiredBlocks = msgBytes.length * 8;
            int availableBlocks = (w / BLOCK_SIZE) * (h / BLOCK_SIZE);

            if (requiredBlocks > availableBlocks) {
                throw new RuntimeException("Message too long for this image size. Max chars: " + (availableBlocks/8));
            }

            BufferedImage stego = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            stego.getGraphics().drawImage(img, 0, 0, null);

            boolean[] bits = toBitArray(msgBytes);
            int bitIdx = 0;

            for (int y = 0; y <= h - BLOCK_SIZE && bitIdx < bits.length; y += BLOCK_SIZE) {
                for (int x = 0; x <= w - BLOCK_SIZE && bitIdx < bits.length; x += BLOCK_SIZE) {
                    applyPatch(stego, x, y, bits[bitIdx++]);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(stego, "jpg", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            System.err.println("Embedding failed: " + e.getMessage());
            return coverData;
        }
    }

    private void applyPatch(BufferedImage img, int bx, int by, boolean bit) {
        Random rand = new Random(SEED + (long)bx * 1000 + by);
        int direction = bit ? 1 : -1;

        for (int i = 0; i < PAIRS_PER_BLOCK; i++) {
            int x1 = rand.nextInt(BLOCK_SIZE), y1 = rand.nextInt(BLOCK_SIZE);
            int x2 = rand.nextInt(BLOCK_SIZE), y2 = rand.nextInt(BLOCK_SIZE);

            modifyPixel(img, bx + x1, by + y1, direction * SHIFT);
            modifyPixel(img, bx + x2, by + y2, -direction * SHIFT);
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(stegoData));
            int w = img.getWidth(), h = img.getHeight();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int currentByte = 0, bitCount = 0;

            EXTRACT_LOOP:
            for (int y = 0; y <= h - BLOCK_SIZE; y += BLOCK_SIZE) {
                for (int x = 0; x <= w - BLOCK_SIZE; x += BLOCK_SIZE) {

                    long diff = calculateDiff(img, x, y);
                    int bit = (diff > 0) ? 1 : 0;

                    currentByte = (currentByte << 1) | bit;
                    bitCount++;

                    if (bitCount == 8) {
                        baos.write(currentByte);
                        String current = new String(baos.toByteArray(), StandardCharsets.UTF_8);
                        // עצירה ברגע שמזהים חלק מהמרקר (חוסן לרעש)
                        if (current.contains("##EN")) break EXTRACT_LOOP;
                        currentByte = 0; bitCount = 0;
                    }
                    if (baos.size() > 500) break EXTRACT_LOOP; // הגנה
                }
            }
            String res = new String(baos.toByteArray(), StandardCharsets.UTF_8);
            return res.contains("##") ? res.split("##")[0] : res;
        } catch (Exception e) { return "Error"; }
    }

    private long calculateDiff(BufferedImage img, int bx, int by) {
        Random rand = new Random(SEED + (long)bx * 1000 + by);
        long diff = 0;
        for (int i = 0; i < PAIRS_PER_BLOCK; i++) {
            int x1 = rand.nextInt(BLOCK_SIZE), y1 = rand.nextInt(BLOCK_SIZE);
            int x2 = rand.nextInt(BLOCK_SIZE), y2 = rand.nextInt(BLOCK_SIZE);

            diff += getLuma(img.getRGB(bx + x1, by + y1));
            diff -= getLuma(img.getRGB(bx + x2, by + y2));
        }
        return diff;
    }

    private void modifyPixel(BufferedImage img, int x, int y, int delta) {
        int rgb = img.getRGB(x, y);
        int r = Math.max(0, Math.min(255, ((rgb >> 16) & 0xFF) + delta));
        int g = Math.max(0, Math.min(255, ((rgb >> 8) & 0xFF) + delta));
        int b = Math.max(0, Math.min(255, (rgb & 0xFF) + delta));
        img.setRGB(x, y, (r << 16) | (g << 8) | b);
    }

    private int getLuma(int rgb) {
        return (int) (0.299 * ((rgb >> 16) & 0xFF) + 0.587 * ((rgb >> 8) & 0xFF) + 0.114 * (rgb & 0xFF));
    }

    private boolean[] toBitArray(byte[] data) {
        boolean[] bits = new boolean[data.length * 8];
        for (int i = 0; i < data.length; i++)
            for (int j = 0; j < 8; j++) bits[i * 8 + j] = ((data[i] >> (7 - j)) & 1) == 1;
        return bits;
    }
}