package com.photoServer.steganography.analyzer;

import com.photoServer.steganography.model.MediaType;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.HashMap;
import java.util.Map;

@Component
public class AudioFileAnalyzer implements MediaAnalyzer {

    @Override
    public MediaType getSupportedType() {
        return MediaType.AUDIO;
    }

    @Override
    public Map<String, Double> analyze(byte[] data) {
        Map<String, Double> metrics = new HashMap<>();

        // ב-WAV, ה-Data מתחיל לרוב אחרי Header של 44 בתים
        int offset = 44;
        if (data.length <= offset) return metrics;

        // 1. חישוב RMS (עוצמת אנרגיה ממוצעת - קובע עומק הטמנה)
        double rms = calculateRMS(data, offset);
        metrics.put("rms", rms);

        // 2. חישוב SNR מוערך (יחס אות לרעש)
        // SNR גבוה = קובץ נקי (דורש LSB עדין), SNR נמוך = קובץ רועש (אפשר להחביא בתוך הרעש)
        double snr = calculateEstimatedSNR(rms);
        metrics.put("snr", snr);

        // 3. ניתוח Spectral Flux (שינויים בתדרים - מדד למיסוך פסיכו-אקוסטי)
        // עוזר להחליט אם לבחור ב-Phase Coding
        double spectralActivity = calculateSpectralActivity(data, offset);
        metrics.put("spectralActivity", spectralActivity);

        // מדד קיבולת (כמה שניות של שמע יש לנו)
        metrics.put("durationSeconds", (double) (data.length - offset) / (44100 * 2));

        return metrics;
    }

    /**
     * חישוב RMS - עוזר לקבוע את ה"דינמיקה" של השמע.
     * ככל שה-RMS גבוה יותר, הצלילים חזקים יותר (ה"בריונים").
     */
    private double calculateRMS(byte[] data, int offset) {
        double sum = 0;
        int sampleCount = 0;

        for (int i = offset; i < data.length - 1; i += 2) {
            short sample = ByteBuffer.wrap(data, i, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
            sum += sample * sample;
            sampleCount++;
        }

        double averageSquare = sum / sampleCount;
        return Math.sqrt(averageSquare) / 32768.0; // נרמול לטווח 0-1 (עבור 16-bit audio)
    }

    /**
     * הערכת SNR פשוטה על בסיס רצפת הרעש
     */
    private double calculateEstimatedSNR(double rms) {
        if (rms == 0) return 0;
        // נוסחה לחישוב דציבלים: 20 * log10(Signal/Noise)
        // כאן אנחנו מעריכים SNR יחסי לאנרגיה
        return 20 * Math.log10(rms / 0.0001);
    }

    /**
     * Spectral Activity - מזהה אזורים עם שינויי תדרים מהירים.
     * במוזיקה מונוטונית הערך יהיה נמוך (מתאים ל-Phase Coding).
     */
    private double calculateSpectralActivity(byte[] data, int offset) {
        int changes = 0;
        int sampleCount = 0;
        short lastSample = 0;

        for (int i = offset; i < data.length - 1; i += 2) {
            short currentSample = ByteBuffer.wrap(data, i, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
            if ((lastSample > 0 && currentSample < 0) || (lastSample < 0 && currentSample > 0)) {
                changes++; // Zero crossing rate - מדד פשוט לתדר
            }
            lastSample = currentSample;
            sampleCount++;
        }
        return (double) changes / sampleCount;
    }
}