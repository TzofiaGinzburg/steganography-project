package com.photoServer.steganography.strategies.image;

import com.photoServer.steganography.analyzer.ImageFileAnalyzer;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Map;

public class ImageDiagnosticTest {

    private final ImageFileAnalyzer analyzer = new ImageFileAnalyzer();

    @Test
    void runFullDiagnostic() throws Exception {
        // 1. טעינת התמונה לבדיקה (שנה ל-7.jpg או מה שיש לך)
        String fileName = "7.jpg";
        ClassPathResource resource = new ClassPathResource(fileName);

        if (!resource.exists()) {
            System.err.println("קובץ לא נמצא! וודא שהוא ב-src/test/resources");
            return;
        }

        byte[] imageData = resource.getInputStream().readAllBytes();

        // 2. הרצת האנליזה שכתבת
        Map<String, Double> metrics = analyzer.analyze(imageData);

        // 3. הדפסת הדוח
        System.out.println("\n===== דוח אבחון תמונה: " + fileName + " =====");
        System.out.printf("רזולוציה: %.0f x %.0f (סה\"כ פיקסלים: %.0f)\n",
                metrics.get("width"), metrics.get("height"), metrics.get("totalPixels"));
        System.out.printf("אנטרופיה (0-1): %.4f\n", metrics.get("entropy"));
        System.out.printf("צפיפות קצוות (Edges): %.4f\n", metrics.get("edgeDensity"));
        System.out.println("==========================================\n");

        printRecommendations(metrics, fileName);
    }

    private void printRecommendations(Map<String, Double> metrics, String fileName) {
        double entropy = metrics.get("entropy");
        double edges = metrics.get("edgeDensity");
        boolean isJpg = fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg");

        System.out.println("--- המלצות לאלגוריתמים ---");

        // בדיקת Patchwork
        if (isJpg && entropy > 0.3 && entropy < 0.7) {
            System.out.println("[V] Patchwork: מומלץ מאוד. התמונה בעלת אנטרופיה מאוזנת ותשרוד דחיסת JPG.");
        } else if (entropy <= 0.3) {
            System.out.println("[!] Patchwork: אפשרי, אך יראו את השינויים (התמונה חלקה מדי).");
        }

        // בדיקת Matrix Embedding / LSB
        if (!isJpg) {
            System.out.println("[V] Matrix Embedding (Hamming): מושלם. פורמט PNG מאפשר קיבולת אדירה בשינוי מינימלי.");
        } else {
            System.out.println("[X] Matrix Embedding / LSB: לא מומלץ. דחיסת ה-JPG תהרוס את המידע מיד.");
        }

        // בדיקת PVD (Pixel Value Differencing)
        if (edges > 0.05) {
            System.out.println("[V] PVD: מומלץ. יש מספיק קצוות ופרטים כדי להחביא מידע בנפח גבוה.");
        } else {
            System.out.println("[!] PVD: קיבולת נמוכה. התמונה חלקה מדי לשיטה מבוססת קצוות.");
        }

        // חישוב קיבולת מוערכת ל-Patchwork (בלוקים של 32)
        int blocks = (int)((metrics.get("width")/32) * (metrics.get("height")/32));
        System.out.printf("\nקיבולת מקסימלית מוערכת (Patchwork): %d תווים\n", (blocks / 8) - 7);
        System.out.println("-------------------------");
    }
}
