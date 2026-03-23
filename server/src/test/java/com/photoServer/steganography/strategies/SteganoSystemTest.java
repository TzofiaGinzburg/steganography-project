package com.photoServer.steganography.strategies;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.analyzer.*;
import com.photoServer.steganography.factory.*;
import com.photoServer.steganography.model.*;
import com.photoServer.steganography.strategies.image.*;
import org.springframework.test.util.ReflectionTestUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.*;
import java.util.Arrays;

public class SteganoSystemTest {

    public static void main(String[] args) throws Exception {
        // --- 1. הגדרות נתיבים והודעה ---
        String inputPath = "src/main/resources/2.png"; // וודא שהקובץ קיים שם
        String outputPath = "target/stego_result_final.png";
        String secretMessage = "סנכרון מערכת סטגנוגרפיה - בדיקה סופית";

        System.out.println("=== תחילת בדיקת מערכת מקצה לקצה ===");

        // --- 2. אתחול והרכבת המערכת (Manual Dependency Injection) ---
        FileAnalyzer fileAnalyzer = new FileAnalyzer();
        ImageFileAnalyzer imageAnalyzer = new ImageFileAnalyzer();
        SteganoRouter router = new SteganoRouter();
        SteganoFactory factory = new SteganoFactory();

        // חיבור הרכיבים (דימוי של מה ש-Spring עושה)
        ReflectionTestUtils.setField(fileAnalyzer, "analyzers", Arrays.asList(imageAnalyzer));
        ReflectionTestUtils.setField(factory, "router", router);
        ReflectionTestUtils.setField(factory, "allStrategies", Arrays.asList(
                new PvdImage(),
                new LsbImage(),
                new SpreadSpectrumImage(),
                new MatrixEmbeddingStrategy(),
                new PatchworkStrategy(),
                new JUniwardStrategy(),
                new OutGuessStrategy()
        ));
        factory.afterPropertiesSet();

        // --- 3. שלב האנליזה (Analysis Phase) ---
        System.out.println("[שלב 1] קריאת קובץ וניתוח מדדים...");
        Path path = Paths.get(inputPath);
        if (!Files.exists(path)) {
            System.err.println("שגיאה: קובץ המקור לא נמצא בנתיב: " + path.toAbsolutePath());
            return;
        }
        byte[] data = Files.readAllBytes(path);

        // שליחה לאנלייזר
        FileMetrics metrics = fileAnalyzer.analyze(path.getFileName().toString(), data, secretMessage);

        // --- 4. שלב קבלת ההחלטה (Decision Phase) ---
        System.out.println("\n[שלב 2] הצלבת נתונים מול טבלת קריטריונים:");
        System.out.println("--------------------------------------------------");
        System.out.printf(" > פורמט מזוהה:  %s\n", metrics.type());
        System.out.printf(" > אנטרופיה:     %.4f (סף גבוה: 0.72)\n", metrics.getMetric("entropy"));
        System.out.printf(" > צפיפות קצוות: %.4f (סף גבוה: 0.12)\n", metrics.getMetric("edgeDensity"));
        System.out.printf(" > קובץ דחוס:    %s\n", metrics.getMetric("isCompressed") > 0 ? "כן (JPEG)" : "לא (PNG/BMP)");
        System.out.println("--------------------------------------------------");

        // קבלת האסטרטגיה מה-Factory (שמשתמש ב-Router)
        SteganoStrategy strategy = factory.getOptimalStrategy(metrics);
        System.out.println(">> בחירת המערכת: " + strategy.getName());

        // --- 5. שלב הביצוע והצפנה (Execution Phase) ---
        System.out.println("\n[שלב 3] ביצוע הטמנה (Embedding)...");
        long start = System.currentTimeMillis();
        byte[] stegoData = strategy.embed(data, secretMessage);
        long end = System.currentTimeMillis();

        // שמירה לנתיב הפלט
        Files.write(Paths.get(outputPath), stegoData);
        System.out.println(">> הקובץ נשמר בהצלחה בנתיב: " + outputPath);
        System.out.println(">> זמן ביצוע: " + (end - start) + "ms");

        // --- 6. שלב הוולידציה (Validation Phase) ---
        System.out.println("\n[שלב 4] בדיקת איכות ושחזור:");

        BufferedImage originalBuf = ImageIO.read(new ByteArrayInputStream(data));
        BufferedImage stegoBuf = ImageIO.read(new ByteArrayInputStream(stegoData));

        double psnr = QualityGuard.calculatePSNR(originalBuf, stegoBuf);
        double ssim = QualityGuard.calculateSSIM(originalBuf, stegoBuf);
        String extracted = strategy.extract(stegoData);

        System.out.println("--------------------------------------------------");
        System.out.printf(" > מדד PSNR: %.2f dB (יעד: >35dB)\n", psnr);
        System.out.printf(" > מדד SSIM: %.4f (יעד: >0.95)\n", ssim);
        System.out.println(" > הודעה שחולצה: " + extracted.trim());
        System.out.println("--------------------------------------------------");

        if (secretMessage.equals(extracted.trim())) {
            System.out.println("✅ הצלחה מלאה: ההודעה חולצה ללא שגיאות!");
        } else {
            System.out.println("⚠️ שגיאה: ההודעה שחולצה אינה תואמת למקור.");
        }
    }
}