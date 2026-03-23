package com.photoServer.steganography.factory;

import java.awt.image.BufferedImage;

public class QualityGuard {

    /**
     * חישוב PSNR מדויק על כל ערוצי ה-RGB.
     * ככל שהערך גבוה יותר (מעל 35-40), השינוי פחות נראה לעין.
     */
    public static double calculatePSNR(BufferedImage img1, BufferedImage img2) {
        long mse = 0;
        int width = img1.getWidth();
        int height = img1.getHeight();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int rgb1 = img1.getRGB(x, y);
                int rgb2 = img2.getRGB(x, y);

                // פירוק ל-RGB כדי למדוד את ההפרש האמיתי בכל ערוץ
                int r1 = (rgb1 >> 16) & 0xFF, r2 = (rgb2 >> 16) & 0xFF;
                int g1 = (rgb1 >> 8) & 0xFF,  g2 = (rgb2 >> 8) & 0xFF;
                int b1 = rgb1 & 0xFF,         b2 = rgb2 & 0xFF;

                // חישוב ריבוע ההפרש הממוצע בין שלושת הערוצים
                mse += (Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)) / 3;
            }
        }

        double avgMse = (double) mse / (width * height);
        if (avgMse == 0) return 100.0; // תמונות זהות לחלוטין

        // נוסחת PSNR סטנדרטית
        return 10 * Math.log10(65025.0 / avgMse);
    }

    /**
     * חישוב SSIM - מדד דמיון מבני.
     * ערך קרוב ל-1.0 אומר שהמבנה והטקסטורה נשמרו בצורה מושלמת.
     */
    public static double calculateSSIM(BufferedImage img1, BufferedImage img2) {
        double mu1 = getMean(img1);
        double mu2 = getMean(img2);
        double sigma1sq = getVariance(img1, mu1);
        double sigma2sq = getVariance(img2, mu2);
        double sigma12 = getCovariance(img1, img2, mu1, mu2);

        // קבועים למניעת חלוקה באפס
        double c1 = Math.pow(0.01 * 255, 2);
        double c2 = Math.pow(0.03 * 255, 2);

        return ((2 * mu1 * mu2 + c1) * (2 * sigma12 + c2)) /
                ((mu1 * mu1 + mu2 * mu2 + c1) * (sigma1sq + sigma2sq + c2));
    }

    // מתודות עזר לחישובי ממוצע ושונות (נשמרות כפי שכתבת, הן מצוינות)
    private static double getMean(BufferedImage img) {
        double sum = 0;
        for (int y = 0; y < img.getHeight(); y++)
            for (int x = 0; x < img.getWidth(); x++)
                sum += (img.getRGB(x, y) & 0xFF);
        return sum / (img.getWidth() * img.getHeight());
    }

    private static double getVariance(BufferedImage img, double mean) {
        double var = 0;
        for (int y = 0; y < img.getHeight(); y++)
            for (int x = 0; x < img.getWidth(); x++)
                var += Math.pow((img.getRGB(x, y) & 0xFF) - mean, 2);
        return var / (img.getWidth() * img.getHeight());
    }

    private static double getCovariance(BufferedImage img1, BufferedImage img2, double m1, double m2) {
        double cov = 0;
        for (int y = 0; y < img1.getHeight(); y++)
            for (int x = 0; x < img1.getWidth(); x++)
                cov += ((img1.getRGB(x, y) & 0xFF) - m1) * ((img2.getRGB(x, y) & 0xFF) - m2);
        return cov / (img1.getWidth() * img1.getHeight());
    }
    public static BufferedImage generateHeatmap(BufferedImage img1, BufferedImage img2) {
        int width = img1.getWidth();
        int height = img1.getHeight();
        BufferedImage heatmap = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int rgb1 = img1.getRGB(x, y);
                int rgb2 = img2.getRGB(x, y);

                // חישוב ההפרש המוחלט בין הפיקסלים
                int rDiff = Math.abs(((rgb1 >> 16) & 0xFF) - ((rgb2 >> 16) & 0xFF));
                int gDiff = Math.abs(((rgb1 >> 8) & 0xFF) - ((rgb2 >> 8) & 0xFF));
                int bDiff = Math.abs((rgb1 & 0xFF) - (rgb2 & 0xFF));

                int totalDiff = rDiff + gDiff + bDiff;

                // יצירת צבע למפה: אם יש שינוי, נצבע באדום חזק. אם אין, נשאיר שחור.
                if (totalDiff > 0) {
                    // ככל שהשינוי גדול יותר, האדום יהיה בהיר יותר (מינימום 150 כדי שיראו)
                    int intensity = Math.min(255, 150 + (totalDiff * 10));
                    heatmap.setRGB(x, y, (intensity << 16));
                } else {
                    heatmap.setRGB(x, y, 0x000000); // שחור = אין שינוי
                }
            }
        }
        return heatmap;
    }
}