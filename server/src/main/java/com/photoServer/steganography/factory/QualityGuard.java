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

        // ... (PSNR ו-SSIM הקיימים שלך)

        // חישוב אנטרופיה (רמת הפירוט/מידע בתמונה)
        public static double calculateEntropy(BufferedImage img) {
            int[] histogram = new int[256];
            int width = img.getWidth();
            int height = img.getHeight();

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    int gray = (new java.awt.Color(img.getRGB(x, y)).getRed()); // הנחה: תמונה בגווני אפור או ערוץ אדום
                    histogram[gray]++;
                }
            }

            double entropy = 0;
            double totalPixels = width * height;
            for (int count : histogram) {
                if (count > 0) {
                    double p = count / totalPixels;
                    entropy -= p * (Math.log(p) / Math.log(2));
                }
            }
            return entropy;
        }

        // חישוב צפיפות קצוות (זיהוי אזורי "רעש" ויזואלי)
        public static double calculateEdgeDensity(BufferedImage img) {
            int width = img.getWidth();
            int height = img.getHeight();
            int edgeCount = 0;
            int threshold = 30; // סף לזיהוי קצה

            for (int y = 1; y < height - 1; y++) {
                for (int x = 1; x < width - 1; x++) {
                    // Sobel Filter פשוט למציאת גרדיאנט
                    int p1 = new java.awt.Color(img.getRGB(x+1, y)).getRed();
                    int p2 = new java.awt.Color(img.getRGB(x-1, y)).getRed();
                    int p3 = new java.awt.Color(img.getRGB(x, y+1)).getRed();
                    int p4 = new java.awt.Color(img.getRGB(x, y-1)).getRed();

                    double gradient = Math.sqrt(Math.pow(p1 - p2, 2) + Math.pow(p3 - p4, 2));
                    if (gradient > threshold) edgeCount++;
                }
            }
            return (double) edgeCount / (width * height) * 100;
        }



    /**
     * חישוב SNR עבור קבצי אודיו (WAV 16-bit).
     * ככל שהערך גבוה יותר (מעל 30-40dB), השינוי פחות נשמע לאוזן.
     */
    public static double calculateAudioSNR(byte[] original, byte[] stego) {
        if (original.length != stego.length) return 0.0;

        double signalPower = 0;
        double noisePower = 0;
        int offset = 44; // דילוג על ה-WAV Header

        for (int i = offset; i < original.length - 1; i += 2) {
            // הפיכת בייטים ל-Short (16-bit PCM)
            short s1 = (short) ((original[i] & 0xFF) | (original[i + 1] << 8));
            short s2 = (short) ((stego[i] & 0xFF) | (stego[i + 1] << 8));

            signalPower += Math.pow(s1, 2);
            noisePower += Math.pow(s1 - s2, 2);
        }

        if (noisePower == 0) return 100.0; // קבצים זהים

        // נוסחת SNR בדציבלים
        return 10 * Math.log10(signalPower / noisePower);
    }
    public static double calculateZCR(byte[] audioData) {
        if (audioData == null || audioData.length <= 46) return 0.0;

        int crossings = 0;
        int offset = 44; // דילוג על WAV Header
        int sampleCount = 0;
        short lastSample = 0;

        for (int i = offset; i < audioData.length - 1; i += 2) {
            // המרה מ-Bytes ל-Short (16-bit PCM)
            short currentSample = (short) ((audioData[i] & 0xFF) | (audioData[i + 1] << 8));

            if (sampleCount > 0) {
                // בדיקה אם הסימן השתנה (חציית האפס)
                // מכפלה של מספר חיובי ושלילי תמיד תהיה קטנה מאפס
                if ((currentSample > 0 && lastSample < 0) || (currentSample < 0 && lastSample > 0)) {
                    crossings++;
                }
            }
            lastSample = currentSample;
            sampleCount++;
        }

        if (sampleCount == 0) return 0.0;

        // מחזיר את היחס (בין 0 ל-1)
        return (double) crossings / sampleCount;
    }
    // בתוך package com.photoServer.steganography.factory.QualityGuard
    public static double calculateMotionVariance(java.util.List<BufferedImage> frames) {
        if (frames.size() < 2) return 0.0;

        double totalDiff = 0;
        for (int i = 0; i < frames.size() - 1; i++) {
            // משתמשים ב-MSE הקיים שלנו כבסיס למדידת שינוי בין פריימים עוקבים
            totalDiff += calculatePSNR(frames.get(i), frames.get(i+1));
        }

        // PSNR נמוך בין פריימים = שינוי גדול (תנועה רבה)
        // ננרמל לערך שמתאים לטבלה שלך (0.0 עד 5.0)
        double avgPsnr = totalDiff / (frames.size() - 1);
        return Math.max(0, 5.0 - (avgPsnr / 10.0));
    }
}