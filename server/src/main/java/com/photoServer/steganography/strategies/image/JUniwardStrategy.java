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
public class JUniwardStrategy extends BaseSteganoStrategy implements SteganoStrategy {
    private static final long STEGO_SEED = 12345L;
    private static final String END_MARKER = "##END##";
    private static final int BLOCK_SIZE = 8; // בלוקים של JPEG

    @Override
    public String getName() { return "JUniwardStrategy"; }
    @Override
    public MediaType getSupportedType() { return MediaType.IMAGE; }
    @Override
    public int calculateSuitability(FileMetrics metrics) { return 100; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        System.out.println("🧪 [J-UNIWARD] מתחיל ניתוח עיוות (Distortion Analysis)...");
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(coverData));
            int width = image.getWidth();
            int height = image.getHeight();

            // 1. זיהוי אזורי אנטרופיה גבוהה (Texture Analysis)
            // אנחנו מחפשים בלוקים עם שינויי צבע חדים (Edges)
            List<CoefficientTarget> targets = calculateTextureComplexity(image);

            // 2. הכנת המידע
            byte[] msgBytes = (secretMessage + END_MARKER).getBytes(StandardCharsets.UTF_8);
            int totalBits = msgBytes.length * 8;

            if (totalBits > targets.size()) {
                throw new RuntimeException("התמונה 'חלקה' מדי - אין מספיק אנטרופיה להסתרת המידע בבטחה.");
            }

            System.out.printf("🎯 נמצאו %d צומתי אנטרופיה. נדרשים %d ביטים.%n", targets.size(), totalBits);

            // 3. הטמעה לפי סדר העיוות המינימלי (ככל שהמורכבות גבוהה יותר, העיוות נמוך יותר)
            int bitIdx = 0;
            for (byte b : msgBytes) {
                for (int i = 7; i >= 0; i--) {
                    int bit = (b >> i) & 1;
                    CoefficientTarget target = targets.get(bitIdx);

                    int rgb = image.getRGB(target.x, target.y);
                    int red = (rgb >> 16) & 0xFF;

                    // שינוי ה-LSB של הערוץ האדום באזורים מורכבים
                    int newRed = (red & 0xFE) | bit;
                    int newRgb = (rgb & 0xFF00FFFF) | (newRed << 16);

                    image.setRGB(target.x, target.y, newRgb);
                    bitIdx++;
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            System.out.println("✅ הטמעה בטקסטורה הושלמה.");
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return coverData;
        }
    }

    // פונקציית הליבה: דירוג פיקסלים לפי "קושי הגילוי" (אנטרופיה)
    private List<CoefficientTarget> calculateTextureComplexity(BufferedImage img) {
        List<CoefficientTarget> targets = new ArrayList<>();
        int w = img.getWidth();
        int h = img.getHeight();

        // מעבר על פילטר Sobel פשוט לזיהוי קצוות (Edges)
        for (int y = 1; y < h - 1; y++) {
            for (int x = 1; x < w - 1; x++) {
                double complexity = getLocalComplexity(img, x, y);
                // J-UNIWARD מעדיף אזורים עם קצוות (complexity גבוהה)
                targets.add(new CoefficientTarget(x, y, complexity));
            }
        }

        // מיון: האזורים הכי "רועשים" (Complexity גבוהה) יקבלו עדיפות ראשונה
        targets.sort((a, b) -> Double.compare(b.complexity, a.complexity));
        return targets;
    }

    private double getLocalComplexity(BufferedImage img, int x, int y) {
        // חישוב גרדיאנט פשוט (הפרשי צבע מהשכנים)
        int p = img.getRGB(x, y) & 0xFF;
        int right = img.getRGB(x + 1, y) & 0xFF;
        int down = img.getRGB(x, y + 1) & 0xFF;
        return Math.abs(p - right) + Math.abs(p - down);
    }

    @Override
    public String extract(byte[] stegoData) {
        System.out.println("🔍 [J-UNIWARD] מחלץ מידע מאזורי אנטרופיה...");
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(stegoData));
            List<CoefficientTarget> targets = calculateTextureComplexity(image);

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int currentByte = 0;
            int bitsInByte = 0;

            for (CoefficientTarget target : targets) {
                int red = (image.getRGB(target.x, target.y) >> 16) & 0xFF;
                currentByte = (currentByte << 1) | (red & 1);
                bitsInByte++;

                if (bitsInByte == 8) {
                    buffer.write(currentByte);
                    String text = new String(buffer.toByteArray(), StandardCharsets.UTF_8);
                    if (text.contains(END_MARKER)) {
                        return text.substring(0, text.indexOf(END_MARKER));
                    }
                    currentByte = 0;
                    bitsInByte = 0;
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return "Extraction Failed";
    }

    private static class CoefficientTarget {
        int x, y;
        double complexity;
        CoefficientTarget(int x, int y, double complexity) {
            this.x = x; this.y = y; this.complexity = complexity;
        }
    }
}