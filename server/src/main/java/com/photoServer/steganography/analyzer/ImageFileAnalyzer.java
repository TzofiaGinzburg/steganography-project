package com.photoServer.steganography.analyzer;

import com.photoServer.steganography.model.MediaType;
import org.springframework.stereotype.Component;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ImageFileAnalyzer implements MediaAnalyzer {

    @Override
    public MediaType getSupportedType() {
        return MediaType.IMAGE;
    }

    @Override
    public Map<String, Double> analyze(byte[] data) {
        Map<String, Double> metrics = new HashMap<>();
        try {
            // זיהוי דחיסה לפי ה-Header של הקובץ (Magic Bytes)
            boolean isJpeg = data.length > 2 && (data[0] == (byte)0xFF && data[1] == (byte)0xD8);
            metrics.put("isCompressed", isJpeg ? 1.0 : 0.0);

            BufferedImage image = ImageIO.read(new ByteArrayInputStream(data));
            if (image != null) {
                double entropy = calculateShannonEntropy(image);
                double edgeDensity = calculateEdgeDensity(image);

                metrics.put("entropy", entropy);
                metrics.put("edgeDensity", edgeDensity);
                metrics.put("totalPixels", (double) (image.getWidth() * image.getHeight()));

                System.out.println("[ANALYZER] ניתוח הסתיים:");
                System.out.println(String.format(" >> אנטרופיה: %.4f, קצוות: %.4f, דחוס: %b", entropy, edgeDensity, isJpeg));
            }
        } catch (IOException e) { e.printStackTrace(); }
        return metrics;
    }

    private double calculateShannonEntropy(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        double totalPixels = width * height;
        int[] histogram = new int[256];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int gray = getGray(image.getRGB(x, y));
                histogram[gray]++;
            }
        }
        double entropy = 0;
        for (int i = 0; i < 256; i++) {
            if (histogram[i] > 0) {
                double p = histogram[i] / totalPixels;
                entropy -= p * (Math.log(p) / Math.log(2));
            }
        }
        return entropy / 8.0;
    }

    private double calculateEdgeDensity(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        double[][] magnitudes = new double[width][height];
        double sumMagnitude = 0;
        int count = 0;

        for (int y = 1; y < height - 1; y++) {
            for (int x = 1; x < width - 1; x++) {
                double gx = (-1 * getGray(image.getRGB(x-1, y-1)) + 1 * getGray(image.getRGB(x+1, y-1)) +
                        -2 * getGray(image.getRGB(x-1, y))   + 2 * getGray(image.getRGB(x+1, y)) +
                        -1 * getGray(image.getRGB(x-1, y+1)) + 1 * getGray(image.getRGB(x+1, y+1)));
                double gy = (-1 * getGray(image.getRGB(x-1, y-1)) - 2 * getGray(image.getRGB(x, y-1)) - 1 * getGray(image.getRGB(x+1, y-1)) +
                        1 * getGray(image.getRGB(x-1, y+1)) + 2 * getGray(image.getRGB(x, y+1)) + 1 * getGray(image.getRGB(x+1, y+1)));
                double mag = Math.sqrt(gx * gx + gy * gy);
                magnitudes[x][y] = mag;
                sumMagnitude += mag;
                count++;
            }
        }
        double dynamicThreshold = Math.max((sumMagnitude / count) * 1.5, 20.0);
        int edgePixels = 0;
        for (int y = 1; y < height - 1; y++) {
            for (int x = 1; x < width - 1; x++) {
                if (magnitudes[x][y] > dynamicThreshold) edgePixels++;
            }
        }
        return (double) edgePixels / (width * height);
    }

    private int getGray(int rgb) {
        int r = (rgb >> 16) & 0xFF;
        int g = (rgb >> 8) & 0xFF;
        int b = rgb & 0xFF;
        // נוסחת Luminosity סטנדרטית
        return (int) (0.299 * r + 0.587 * g + 0.114 * b);
    }
}