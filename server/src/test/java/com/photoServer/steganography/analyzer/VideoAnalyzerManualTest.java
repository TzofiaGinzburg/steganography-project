package com.photoServer.steganography.analyzer;

import com.photoServer.steganography.model.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class VideoAnalyzerManualTest {

    private VideoFileAnalyzer analyzer;

    @BeforeEach
    public void setUp() {
        analyzer = new VideoFileAnalyzer();
    }

    @Test
    public void analyzeSpecificVideoFile() throws Exception {
        // --- שם הקובץ שצריך להיות ב-src/test/resources ---
        String fileName = "1.mp4";
        // ------------------------------------------------

        URL resource = getClass().getClassLoader().getResource(fileName);
        if (resource == null) {
            System.err.println("❌ הקובץ " + fileName + " לא נמצא!");
            return;
        }

        File file = new File(resource.toURI());
        byte[] videoData = Files.readAllBytes(file.toPath());

        System.out.println("🎬 מתחיל ניתוח עומק לוידאו: " + file.getName());
        System.out.println("==========================================");

        long startTime = System.currentTimeMillis();
        Map<String, Double> metrics = analyzer.analyze(videoData);
        long endTime = System.currentTimeMillis();

        if (metrics.isEmpty() || !metrics.containsKey("fps")) {
            System.out.println("⚠️ לא הופקו מדדים. וודא ש-FFmpeg תומך בפורמט.");
        } else {
            // הדפסת המדדים הטכניים
            printMetric("קצב פריימים (FPS)", metrics.get("fps"), " fps");
            printMetric("צפיפות וקטורי תנועה (MV)", metrics.get("motionVectorDensity"), " וקטורים/פריים");
            printMetric("אורך הסרטון", metrics.get("durationSec"), " שניות");
            printMetric("רזולוציה", metrics.get("width"), "x" + metrics.get("height").intValue() + " px");

            System.out.println("------------------------------------------");

            // ניתוח המלצת האסטרטגיה על בסיס הוקטורים
            double strategyVal = metrics.get("recommendedStrategy");
            double mvDensity = metrics.getOrDefault("motionVectorDensity", 0.0);

            if (strategyVal == 2.0) {
                System.out.println("🎯 אסטרטגיה מומלצת: Temporal (Motion Vector/Intra)");
                System.out.printf("📝 הסבר: נמצאו %.2f וקטורים. זהו 'שטח נדל\"ן' מעולה להטמנה זמנית.\n", mvDensity);
            } else {
                System.out.println("🎯 אסטרטגיה מומלצת: Spatial (LSB/DCT)");
                System.out.println("📝 הסבר: הוידאו סטטי או בעל FPS גבוה מאוד. עדיף לשנות פיקסלים בודדים.");
            }
        }

        System.out.println("==========================================");
        System.out.println("⏱️ זמן עיבוד כולל: " + (endTime - startTime) + " ms");

        assertNotNull(metrics.get("motionVectorDensity"), "חייב להיות מדד וקטורי תנועה");
    }

    private void printMetric(String label, Double value, String unit) {
        if (value != null) {
            System.out.printf("%-30s: %.2f%s%n", label, value, unit);
        }
    }
}