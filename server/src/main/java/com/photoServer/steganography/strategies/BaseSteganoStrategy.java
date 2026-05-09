package com.photoServer.steganography.strategies;

import com.photoServer.steganography.SteganoStrategy;
import java.awt.image.BufferedImage;
import java.nio.charset.StandardCharsets;

public abstract class BaseSteganoStrategy implements SteganoStrategy {
    // עוזר לחלץ את ההודעה הנקייה בתוך כל אסטרטגיה אם תרצי
    protected String cleanHeader(String rawData, String algoName) {
        String prefix = algoName + "::";
        if (rawData != null && rawData.contains(prefix)) {
            return rawData.substring(rawData.indexOf(prefix) + prefix.length());
        }
        return rawData;
    }
    // המתודה הזו כתובה פעם אחת ומשמשת את כל 20 האלגוריתמים
    protected double calculatePSNR(BufferedImage original, BufferedImage stego) {
        long mse = 0;
        int width = original.getWidth();
        int height = original.getHeight();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                // חישוב ממוצע ההפרשים בכל הערוצים (RGB) לדיוק מירבי
                int rDiff = ((original.getRGB(x, y) >> 16) & 0xFF) - ((stego.getRGB(x, y) >> 16) & 0xFF);
                int gDiff = ((original.getRGB(x, y) >> 8) & 0xFF) - ((stego.getRGB(x, y) >> 8) & 0xFF);
                int bDiff = (original.getRGB(x, y) & 0xFF) - (stego.getRGB(x, y) & 0xFF);

                mse += (Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2)) / 3;
            }
        }

        double avgMse = (double) mse / (width * height);
        if (avgMse == 0) return 100.0;

        return 10 * Math.log10(65025.0 / avgMse);
    }

    // כאן אפשר להוסיף עוד כלי עזר משותפים כמו לוגים או ולידציות
    protected void logQuality(String algoName, double psnr) {
        System.out.printf("📊 [%s] Quality Check: PSNR = %.2f dB%n", algoName, psnr);
        if (psnr < 40.0) {
            System.err.println("⚠️ WARNING: High distortion detected!");
        }
    }
    protected boolean[] toBits(String text) {
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        boolean[] bits = new boolean[bytes.length * 8];
        for (int i = 0; i < bytes.length; i++) {
            for (int j = 0; j < 8; j++) {
                bits[i * 8 + j] = (bytes[i] >> (7 - j) & 1) == 1;
            }
        }
        return bits;
    }

    // בתוך BaseSteganoStrategy.java
    protected String bitsToText(String bitString) {
        if (bitString == null || bitString.length() < 8) return "";

        int byteCount = bitString.length() / 8;
        byte[] bytes = new byte[byteCount];

        for (int i = 0; i < byteCount; i++) {
            // לוקחים כל פעם 8 תווים ("0" ו-"1") והופכים לבייט
            String byteStr = bitString.substring(i * 8, i * 8 + 8);
            try {
                bytes[i] = (byte) Integer.parseInt(byteStr, 2);
            } catch (NumberFormatException e) {
                bytes[i] = 0; // טיפול במקרה של תו לא חוקי
            }
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
