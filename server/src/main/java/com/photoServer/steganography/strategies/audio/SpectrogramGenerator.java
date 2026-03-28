package com.photoServer.steganography.strategies.audio;

import org.jtransforms.fft.DoubleFFT_1D;

import javax.imageio.ImageIO;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;

public class SpectrogramGenerator {

    // פרמטרים טכניים ל-FFT (משפיעים על רזולוציית התדר/זמן)
    private static final int FFT_SIZE = 1024; // גודל החלון ל-FFT (חייב להיות חזקה של 2)
    private static final int OVERLAP  = 512;  // חפיפה בין חלונות (לשם החלקה)

    /**
     * יוצר ספקטרוגרמה מקובץ אודיו ושומר אותה כתמונה.
     *
     * @param audioData  מערך הבייטים של קובץ ה-WAV המלא.
     * @param outputPath הנתיב לשמירת תמונת ה-PNG הסופית.
     */
    public static void generateSpectrogram(byte[] audioData, String outputPath) throws IOException {
        try {
            // 1. קריאת נתוני האודיו הגולמיים (Raw Samples)
            double[] samples = readRawSamples(audioData);
            if (samples == null || samples.length < FFT_SIZE) {
                throw new IOException("Audio data too short or invalid format.");
            }

            // 2. חישוב ה-FFT (הפיכה לנתוני תדרים)
            double[][] spectrogramData = calculateFFT(samples);

            // 3. יצירת מפת החום (Heatmap) הוויזואלית
            BufferedImage image = createSpectrogramImage(spectrogramData);

            // 4. שמירת התמונה בדיסק
            ImageIO.write(image, "png", new File(outputPath));
            System.out.println("✅ Spectrogram generated successfully: " + outputPath);

        } catch (Exception e) {
            System.err.println("❌ Failed to generate spectrogram: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // --- שלב 1: הפיכת בייטים לדגימות קול (Samples) ---
    private static double[] readRawSamples(byte[] audioData) throws Exception {
        AudioInputStream ais = AudioSystem.getAudioInputStream(new ByteArrayInputStream(audioData));

        // וידאו שהפורמט נתמך (16-bit PCM, Little Endian)
        if (ais.getFormat().getSampleSizeInBits() != 16) {
            throw new Exception("Only 16-bit audio is supported for spectrogram generation.");
        }

        byte[] bytes = ais.readAllBytes();
        ais.close();

        double[] samples = new double[bytes.length / 2];
        for (int i = 0; i < samples.length; i++) {
            // הפיכת 2 בייטים ל-Short אחד (Little Endian)
            short s = (short) ((bytes[i * 2] & 0xFF) | (bytes[i * 2 + 1] << 8));
            samples[i] = s / 32768.0; // נרמול לטווח [-1.0, 1.0]
        }
        return samples;
    }

    // --- שלב 2: חישוב FFT (הפיכה לתדרים) ---
    private static double[][] calculateFFT(double[] samples) {
        int numFrames = (samples.length - FFT_SIZE) / OVERLAP + 1;
        double[][] spectrogramData = new double[numFrames][FFT_SIZE / 2]; // חצי מה-FFT מכיל את המידע האמיתי
        DoubleFFT_1D fft = new DoubleFFT_1D(FFT_SIZE);

        for (int frame = 0; frame < numFrames; frame++) {
            double[] window = new double[FFT_SIZE * 2]; // JTransforms דורש מערך כפול עבור Real/Imaginary

            // העתקת חלון הדגימות
            for (int i = 0; i < FFT_SIZE; i++) {
                window[i] = samples[frame * OVERLAP + i];
            }

            // הפעלת FFT
            fft.realForwardFull(window);

            // חישוב ה-Magnitude (עוצמה) לכל תדר
            for (int freq = 0; freq < FFT_SIZE / 2; freq++) {
                double real = window[freq * 2];
                double imag = window[freq * 2 + 1];
                double magnitude = Math.sqrt(real * real + imag * imag);

                // המרה לסקלה לוגריתמית (Decibels) - חשוב לוויזואליזציה
                spectrogramData[frame][freq] = 20 * Math.log10(Math.max(magnitude, 1e-6));
            }
        }
        return spectrogramData;
    }

    // --- שלב 3: ויזואליזציה (יצירת תמונת מפת חום) ---
    private static BufferedImage createSpectrogramImage(double[][] data) {
        int width = data.length;
        int height = data[0].length;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        // מציאת ערכי המינימום והמקסימום לנרמול הצבעים
        double max = -Double.MAX_VALUE;
        double min = Double.MAX_VALUE;
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                if (data[x][y] > max) max = data[x][y];
                if (data[x][y] < min) min = data[x][y];
            }
        }

        // ציור הפיקסלים (תדר נמוך למטה, תדר גבוה למעלה)
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                double val = data[x][y];
                float normalized = (float) ((val - min) / (max - min));

                // שימוש ב-Color Space 'Jet' (כחול -> ירוק -> אדום)
                int color = getColorForMagnitude(normalized);
                image.setRGB(x, height - 1 - y, color); // היפוך ציר Y כדי שתדר נמוך יהיה למטה
            }
        }
        return image;
    }

    // מפת צבעים (Heatmap Color Map) - הופכת עוצמה לצבע
    private static int getColorForMagnitude(float value) {
        // המרה ל-HSL: כחול (240) לעוצמה נמוכה, אדום (0) לעוצמה גבוהה
        float hue = 240 * (1.0f - value);
        return Color.HSBtoRGB(hue / 360f, 1.0f, value > 0.1f ? value : 0.0f);
    }
    /**
     * יוצר תמונת הפרש בין שני קבצי אודיו - מראה רק מה השתנה.
     */
    public static void generateDifferenceMap(byte[] originalData, byte[] stegoData, String outputPath) throws Exception {
        double[] originalSamples = readRawSamples(originalData);
        double[] stegoSamples = readRawSamples(stegoData);

        double[][] originalSpec = calculateFFT(originalSamples);
        double[][] stegoSpec = calculateFFT(stegoSamples);

        int width = Math.min(originalSpec.length, stegoSpec.length);
        int height = originalSpec[0].length;

        BufferedImage diffImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                // חישוב ההפרש המוחלט בין העוצמות
                double diff = Math.abs(stegoSpec[x][y] - originalSpec[x][y]);

                // נרמול: אם ההפרש קטן מאוד, נצבע בשחור. אם הוא משמעותי, נצבע בלבן/אדום.
                int intensity = (int) Math.min(255, diff * 50); // הכפלה ב-50 כדי להבליט הבדלים קטנים

                // צבע אדום זוהר לשינויים, שחור לזהים
                int rgb = (intensity << 16);
                diffImage.setRGB(x, height - 1 - y, rgb);
            }
        }

        ImageIO.write(diffImage, "png", new File(outputPath));
        System.out.println("✅ Difference Map generated: " + outputPath);
    }
}