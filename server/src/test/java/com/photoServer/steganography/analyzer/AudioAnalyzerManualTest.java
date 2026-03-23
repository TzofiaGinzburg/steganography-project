package com.photoServer.steganography.analyzer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AudioAnalyzerManualTest {

    private AudioFileAnalyzer analyzer;

    @BeforeEach
    public void setUp() {
        analyzer = new AudioFileAnalyzer();
    }

    @Test
    public void analyzeSpecificFile() throws Exception {
        // טעינה מתוך ה-Resources של הפרויקט
        var resource = getClass().getClassLoader().getResource("1.wav");

        if (resource == null) {
            System.err.println("❌ הקובץ 1.wav לא נמצא בתיקיית src/test/resources!");
            return;
        }

        File file = new File(resource.toURI());
        System.out.println("🔍 מנתח קובץ: " + file.getName());

        byte[] audioData = Files.readAllBytes(file.toPath());

        System.out.println("📂 נתיב מלא: " + file.getAbsolutePath());
        System.out.println("------------------------------------------");

        // קריאת הקובץ לבייטים

        // הרצת האנליזה
        Map<String, Double> metrics = analyzer.analyze(audioData);

        // הדפסת תוצאות
        if (metrics.isEmpty()) {
            System.out.println("⚠️ לא הופקו מדדים. וודא שהקובץ הוא פורמט אודיו תקין עם Header.");
        } else {
            printMetric("עוצמת אנרגיה (RMS)", metrics.get("rms"), " (0 = שקט, 1 = מקסימום)");
            printMetric("יחס אות לרעש (SNR)", metrics.get("snr"), " dB");
            printMetric("פעילות ספקטרלית (Zero Crossing)", metrics.get("spectralActivity"), " (גבוה = מוזיקה רועשת/תדרים גבוהים)");
            printMetric("אורך מוערך (Seconds)", metrics.get("durationSeconds"), " שניות");
        }

        System.out.println("------------------------------------------");
        assertFalse(metrics.isEmpty(), "המדדים לא אמורים להיות ריקים");
    }
    private void printMetric(String label, Double value, String unit) {
        if (value != null) {
            System.out.printf("%-30s: %.4f%s%n", label, value, unit);
        }
    }
}