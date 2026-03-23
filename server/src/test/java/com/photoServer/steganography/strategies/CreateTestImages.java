package com.photoServer.steganography.strategies;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Random;

public class CreateTestImages {

    private static final int W = 800;
    private static final int H = 600;
    private static final String OUTPUT_DIR = "test_images";

    public static void main(String[] args) throws IOException {
        File dir = new File(OUTPUT_DIR);
        if (!dir.exists()) dir.mkdirs();
        System.out.println("📂 יוצר תמונות בתיקייה: " + dir.getAbsolutePath());

        createMatrixEmbeddingImage();
        createPvdImage();
        createTransformDomainImage();
        createSpreadSpectrumImage();
        createPatchworkImage();
        createLsbSyncImage();

        System.out.println("✅ כל 6 התמונות נוצרו בהצלחה!");
    }

    // 1. תמונה מורכבת ל-Matrix Embedding (אנטרופיה גבוהה)
    private static void createMatrixEmbeddingImage() throws IOException {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();
        Random r = new Random();
        for (int y = 0; y < H; y++) {
            for (int x = 0; x < W; x++) {
                int red = r.nextInt(256);
                int green = r.nextInt(256);
                int blue = r.nextInt(256);
                img.setRGB(x, y, new Color(red, green, blue).getRGB());
            }
        }
        g2d.dispose();
        saveImage(img, "5.png");
    }

    // 2. תמונה עם קצוות חדים ל-PVD (קיבולת גבוהה)
    private static void createPvdImage() throws IOException {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, W, H);
        g2d.setColor(Color.BLACK);
        g2d.setStroke(new BasicStroke(1));
        for (int i = 0; i < W; i += 10) {
            g2d.drawLine(i, 0, W - i, H);
            g2d.drawLine(0, i, W, H - i);
        }
        g2d.dispose();
        saveImage(img, "4.png");
    }

    // 3. תמונה משולבת ל-Transform Domain (JPEG Style)
    private static void createTransformDomainImage() throws IOException {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();
        g2d.setPaint(new GradientPaint(0, 0, Color.LIGHT_GRAY, W, H, Color.DARK_GRAY));
        g2d.fillRect(0, 0, W, H);
        g2d.setColor(Color.BLACK);
        g2d.setFont(new Font("Arial", Font.BOLD, 40));
        g2d.drawString("DCT / Transform Domain Test", 50, H / 2);
        g2d.dispose();
        saveImage(img, "6.png");
    }

    // 4. תמונה חלקה ל-Spread Spectrum (קיבולת נמוכה)
    private static void createSpreadSpectrumImage() throws IOException {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();
        g2d.setPaint(new GradientPaint(0, 0, new Color(255, 100, 100), W, H, new Color(100, 100, 255)));
        g2d.fillRect(0, 0, W, H);
        g2d.dispose();
        saveImage(img, "3.png");
    }

    // 5. תמונה עם דפוס חזרתי ל-Patchwork
    private static void createPatchworkImage() throws IOException {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, W, H);
        g2d.setColor(Color.LIGHT_GRAY);
        for (int y = 0; y < H; y += 20) {
            for (int x = 0; x < W; x += 20) {
                if ((x + y) % 40 == 0) g2d.fillRect(x, y, 20, 20);
            }
        }
        g2d.dispose();
        saveImage(img, "7.png");
    }

    // 6. תמונת רעש טהורה ל-LSB Sync Test
    private static void createLsbSyncImage() throws IOException {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
        Random r = new Random();
        for (int y = 0; y < H; y++) {
            for (int x = 0; x < W; x++) {
                img.setRGB(x, y, r.nextInt(0xFFFFFF));
            }
        }
        saveImage(img, "6_lsb_sync_noise.png");
    }

    private static void saveImage(BufferedImage img, String name) throws IOException {
        File outputFile = new File(OUTPUT_DIR, name);
        ImageIO.write(img, "png", outputFile);
        System.out.println("💾 נשמרה: " + outputFile.getName());
    }
}