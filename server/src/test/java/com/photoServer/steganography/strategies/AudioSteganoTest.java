package com.photoServer.steganography.strategies;

import com.photoServer.steganography.service.SteganographyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

@SpringBootTest
class AudioSteganoTest {

    @Autowired
    private SteganographyService stegoService;

    @Test
    void runFullAudioFlow() {
        // --- נתיב קשיח בתוך הקוד (שנה לנתיב קיים אצלך) ---
        String filePath = "src/main/resources/1.wav";
        String secretMessage = "Hello Audio Stegano 2026";

        try {
            // 1. קריאת הקובץ מהכונן
            byte[] fileBytes = Files.readAllBytes(Paths.get(filePath));
            String fileName = Paths.get(filePath).getFileName().toString();

            System.out.println("======= 🚀 מריץ טסט אודיו מלא =======");

            // 2. הרצת הלוגיקה: אנליזה -> ניתוב -> הסתרה -> חישוב מדדים
            Map<String, Object> results = stegoService.hideWithFullMetrics(fileName, fileBytes, secretMessage);

            // 3. הדפסת ה-Post Object (בדיוק לפי המבנה שביקשת)
            System.out.println("\n--- 📊 Audio Result Object ---");
            System.out.println("{");
            System.out.println("  description : \"בדיקת איכות שמע אוטומטית\",");
            System.out.println("  author : \"mm\",");
            System.out.println("  fileName : \"" + fileName + "\",");

            // שליפת מדדים מה-Analyzer
            System.out.println("  snr : " + results.getOrDefault("snr", "0.0") + " dB,");
            System.out.println("  rms : " + results.getOrDefault("rms", "0.0") + ",");
            System.out.println("  spectralActivity : " + results.getOrDefault("spectralActivity", "0.0") + ",");
            System.out.println("  entropy : " + results.getOrDefault("entropy", "0.0") + ",");

            System.out.println("  bpp : " + results.getOrDefault("bpp", "0.0") + ",");
            System.out.println("  processTime : " + results.getOrDefault("time", "0.0") + " sec,");

            // האלגוריתם שנבחר על ידי ה-Router
            System.out.println("  chosenAlgorithm : \"" + results.get("chosenAlgorithm") + "\",");

            System.out.println("  userMessages : { \"mm\": \"" + secretMessage + "\" }");
            System.out.println("}");

            // 4. אימות: האם ניתן לפענח את מה שהצפנו?
            byte[] stegoBytes = (byte[]) results.get("bytes");
            String extracted = stegoService.extractMessage(fileName, stegoBytes);

            System.out.println("\n--- 🔓 בדיקת פענוח ---");
            if (extracted != null && extracted.equals(secretMessage)) {
                System.out.println("✅ הודעה שוחזרה בהצלחה: " + extracted);
            } else {
                System.out.println("❌ כשל בפענוח! התקבל: " + extracted);
            }
            System.out.println("====================================");

        } catch (Exception e) {
            System.err.println("🚨 שגיאה קריטית בטסט: " + e.getMessage());
            e.printStackTrace();
        }
    }
}