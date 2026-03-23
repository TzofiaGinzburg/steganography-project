package com.photoServer.steganography.strategies.image;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class SpreadSpectrumImage extends BaseSteganoStrategy implements SteganoStrategy {

    private static final long SEED = 123456789L;
    private static final double ALPHA = 8.0;  // עוצמה עדינה מאוד ל-PSNR גבוה (מעל 40dB)
    private static final int PPB = 2048;      // הגנה מסיבית לכל ביט
    private static final int HEADER_BITS = 16; // מספיק להודעות עד 65,535 תווים

    @Override
    public String getName() { return "SpreadSpectrumImage"; }

    @Override
    public MediaType getSupportedType() { return MediaType.IMAGE; }

    @Override
    public int calculateSuitability(FileMetrics metrics) {
        // 1. שימוש בפונקציית העזר getMetric שבנינו ב-Record
        double entropy = metrics.getMetric("entropy");

        // 2. גישה לשדות ה-Record (בלי get!)
        long totalPixels = metrics.totalPixels();
        int msgLen = metrics.messageLength();

        // 3. חישוב: האם יש לי מספיק מקום? (PPB = 2048)
        // הערה: שימוש ב-long למניעת Overflow בחישוב
        if ((long) msgLen * 8 * 2048 > totalPixels) {
            return 0; // אין מספיק מקום פיזי בתמונה
        }

        // 4. החלטה לפי אנטרופיה
        if (entropy > 0.7) return 100;
        return 50;
    }
    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            BufferedImage src = ImageIO.read(new ByteArrayInputStream(coverData));
            // חשוב: שימוש ב-TYPE_3BYTE_BGR כדי למנוע שינויי צבע של Java
            BufferedImage img = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
            img.getGraphics().drawImage(src, 0, 0, null);

            byte[] pixels = ((DataBufferByte) img.getRaster().getDataBuffer()).getData();
            boolean[] bits = convertToBits(secretMessage.getBytes(StandardCharsets.UTF_8));
            int[] indices = getShuffledIndices(pixels.length);
            Random noiseGen = new Random(SEED);

            System.out.println("--- Starting Embedding Debug ---");
            System.out.println("Total bits to embed: " + bits.length);

            for (int i = 0; i < bits.length; i++) {
                if ((i + 1) * PPB > pixels.length) break;
                double m = bits[i] ? 1.0 : -1.0;

                for (int j = 0; j < PPB; j++) {
                    int idx = indices[i * PPB + j];
                    double w = noiseGen.nextGaussian();
                    int x = pixels[idx] & 0xFF;

                    int y = (int) Math.round(x + (ALPHA * m * w));
                    pixels[idx] = (byte) Math.max(0, Math.min(255, y));

                    // הדפסה מדגמית של השינוי בפיקסל הראשון של כל ביט
                    if (j == 0 && i < 5) {
                        System.out.printf("Bit %d | Original: %d | Modified: %d | Noise (w): %.2f%n", i, x, pixels[idx] & 0xFF, w);
                    }
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return coverData;
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(stegoData));
            byte[] pixels = ((DataBufferByte) img.getRaster().getDataBuffer()).getData();
            int[] indices = getShuffledIndices(pixels.length);

            System.out.println("--- Starting Extraction Debug ---");

            // חילוץ אורך ההודעה
            int msgLength = 0;
            for (int i = 0; i < HEADER_BITS; i++) {
                double correlation = calculateCorrelation(pixels, indices, i);
                boolean bit = correlation > 0;
                if (bit) msgLength |= (1 << (HEADER_BITS - 1 - i));

                System.out.printf("Header Bit %d | Correlation: %.4f | Result: %b%n", i, correlation, bit);
            }

            System.out.println("Extracted Message Length: " + msgLength);
            if (msgLength <= 0 || msgLength > 5000) return "Error: Invalid Length";

            byte[] result = new byte[msgLength];
            for (int i = 0; i < msgLength; i++) {
                int b = 0;
                for (int j = 0; j < 8; j++) {
                    int bitPos = HEADER_BITS + (i * 8) + j;
                    if (calculateCorrelation(pixels, indices, bitPos) > 0) {
                        b |= (1 << (7 - j));
                    }
                }
                result[i] = (byte) b;
            }
            return new String(result, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "Extraction Failed: " + e.getMessage();
        }
    }

    private double calculateCorrelation(byte[] pixels, int[] indices, int bitPos) {
        double correlation = 0;
        double sum = 0;
        for (int j = 0; j < PPB; j++) sum += (pixels[indices[bitPos * PPB + j]] & 0xFF);
        double mean = sum / PPB;

        // חשוב: איפוס ה-Seed ודילוג למקום הנכון כדי לסנכרן רעש גאוסיאני
        Random syncGen = new Random(SEED);
        for (int k = 0; k < bitPos * PPB; k++) syncGen.nextGaussian();

        for (int j = 0; j < PPB; j++) {
            double w = syncGen.nextGaussian();
            double y = (pixels[indices[bitPos * PPB + j]] & 0xFF) - mean;
            correlation += y * w;
        }
        return correlation;
    }

    private boolean extractBit(byte[] pixels, int[] indices, int bitPos, Random noiseGen) {
        double correlation = 0;
        double sum = 0;

        // חישוב ממוצע מקומי לשיפור החילוץ (Mean-Removed Correlation)
        for (int j = 0; j < PPB; j++) {
            sum += (pixels[indices[bitPos * PPB + j]] & 0xFF);
        }
        double mean = sum / PPB;

        noiseGen.setSeed(SEED); // Reset seed logically per bit or use the sequence
        // למעשה, ה-noiseGen כבר מסונכרן כי הוא רץ ברצף. פשוט נמשיך לקרוא ממנו.
        // אבל חשוב לקרוא ל-Gaussian בדיוק באותו מספר פעמים.

        Random syncGen = new Random(SEED);
        for(int k=0; k < bitPos * PPB; k++) syncGen.nextGaussian(); // Fast forward to current bit

        for (int j = 0; j < PPB; j++) {
            double w = syncGen.nextGaussian();
            double y = (pixels[indices[bitPos * PPB + j]] & 0xFF) - mean;
            correlation += y * w;
        }
        return correlation > 0;
    }

    private boolean[] convertToBits(byte[] msg) {
        boolean[] bits = new boolean[HEADER_BITS + msg.length * 8];
        for (int i = 0; i < HEADER_BITS; i++) bits[i] = ((msg.length >> (HEADER_BITS - 1 - i)) & 1) == 1;
        for (int i = 0; i < msg.length; i++) {
            for (int j = 0; j < 8; j++) {
                bits[HEADER_BITS + i * 8 + j] = ((msg[i] >> (7 - j)) & 1) == 1;
            }
        }
        return bits;
    }

    private int[] getShuffledIndices(int size) {
        int[] idx = new int[size];
        for (int i = 0; i < size; i++) idx[i] = i;
        Random r = new Random(SEED);
        for (int i = size - 1; i > 0; i--) {
            int j = r.nextInt(i + 1);
            int a = idx[j]; idx[j] = idx[i]; idx[i] = a;
        }
        return idx;
    }

    private void calculateAndPrintMetrics(byte[] original, byte[] stego) {
        double mse = 0;
        for (int i = 0; i < original.length; i++) {
            mse += Math.pow((original[i] & 0xFF) - (stego[i] & 0xFF), 2);
        }
        mse /= original.length;
        double psnr = 10 * Math.log10(65025.0 / mse);

        // SSIM Approximation
        double c1 = 6.5025, c2 = 58.5225;
        double muX = 0, muY = 0;
        for (int i = 0; i < original.length; i++) {
            muX += (original[i] & 0xFF);
            muY += (stego[i] & 0xFF);
        }
        muX /= original.length; muY /= original.length;

        double sX2 = 0, sY2 = 0, sXY = 0;
        for (int i = 0; i < original.length; i++) {
            double x = (original[i] & 0xFF) - muX;
            double y = (stego[i] & 0xFF) - muY;
            sX2 += x * x; sY2 += y * y; sXY += x * y;
        }
        sX2 /= (original.length - 1); sY2 /= (original.length - 1); sXY /= (original.length - 1);

        double ssim = ((2 * muX * muY + c1) * (2 * sXY + c2)) / ((muX * muX + muY * muY + c1) * (sX2 + sY2 + c2));

        System.out.printf("--- Metrics | PSNR: %.2f dB | SSIM: %.4f ---\n", psnr, ssim);
    }
}