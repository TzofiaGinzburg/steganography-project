package com.photoServer.steganography.strategies;

import com.photoServer.steganography.service.SteganographyService;
import com.photoServer.steganography.strategies.audio.MagnitudeSpectrumStrategy;
import com.photoServer.steganography.strategies.audio.SpectrogramGenerator; // וודא שהמחלקה קיימת בנתיב הזה
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
        String inputPath = "src/main/resources/complex_magnitude_base.wav";
        String secretMessage = "H12111111לחחחחחחחחחחחחחי111111יח11";

        // נתיבים לשמירת הספקטרוגרמות
        String specOriginalPath = "src/main/resources/spectrogram_original.png";
        String specStegoPath = "src/main/resources/spectrogram_stego.png";

        try {
            // --- שלב א: קריאת מקור והצפנה ---
            byte[] originalBytes = Files.readAllBytes(Paths.get(inputPath));
            String fileName = Paths.get(inputPath).getFileName().toString();

            // יצירת ספקטרוגרמה לקובץ המקור לפני ההצפנה
            System.out.println("📊 מפיק ספקטרוגרמה לקובץ המקור...");
            SpectrogramGenerator.generateSpectrogram(originalBytes, specOriginalPath);

            System.out.println("======= 🚀 שלב 1: הצפנה ושמירה =======");
            Map<String, Object> results = stegoService.hideWithFullMetrics(fileName, originalBytes, secretMessage);

            // --- שלב ב: שמירה פיזית לכונן ---
            byte[] encryptedBytesFromMemory = (byte[]) results.get("bytes");
            String outputFileName = "src/main/resources/complex_magnitude_basef.wav";
            java.nio.file.Path outputPath = Paths.get(outputFileName);
            Files.write(outputPath, encryptedBytesFromMemory);
// בתוך ה-try של runFullAudioFlow, אחרי ששמרת את encryptedBytesFromMemory:

            String specDiffPath = "src/main/resources/spectrogram_diff.png";

            System.out.println("📊 מפיק מפת הפרשים (Difference Map)...");
            SpectrogramGenerator.generateDifferenceMap(originalBytes, encryptedBytesFromMemory, specDiffPath);
            System.out.println("💾 הקובץ המוצפן נשמר בנתיב: " + outputPath.toAbsolutePath());

            // יצירת ספקטרוגרמה לקובץ המוצפן לאחר השמירה
            System.out.println("📊 מפיק ספקטרוגרמה לקובץ המוצפן...");
            SpectrogramGenerator.generateSpectrogram(encryptedBytesFromMemory, specStegoPath);

            // --- שלב ג: קריאה מחדש מהכונן ופענוח ---
            System.out.println("\n======= 📂 שלב 2: קריאה מהכונן ופענוח =======");
            byte[] bytesReadFromFile = Files.readAllBytes(outputPath);

            System.out.print("🔍 בדיקת בייטים ראשונים (Hex): ");
            for (int i = 0; i < Math.min(20, bytesReadFromFile.length); i++) {
                System.out.format("%02X ", bytesReadFromFile[i]);
            }
            System.out.println();

            System.out.println("--- Running Strategy directly ---");
            MagnitudeSpectrumStrategy strategy = new MagnitudeSpectrumStrategy();

            long startExtract = System.currentTimeMillis();
            String extractedResult = strategy.extract(bytesReadFromFile);
            long endExtract = System.currentTimeMillis();

            System.out.println("--- Result: " + extractedResult + " ---");
            System.out.println("⏱️ זמן פענוח נטו: " + (endExtract - startExtract) + "ms");

            // --- שלב ד: הדפסת תוצאות ומדדים ---
            printResults(results, fileName, secretMessage, extractedResult);

        } catch (Exception e) {
            System.err.println("🚨 שגיאה קריטית בטסט: " + e.getMessage());
            e.printStackTrace();
        }
    }
    private void printResults(Map<String, Object> results, String fileName, String originalMsg, String extractedMsg) {
        System.out.println("\n--- 📊 Audio Result Object ---");
        System.out.println("{");
        System.out.println("  fileName : \"" + fileName + "\",");
        System.out.println("  snr : " + results.getOrDefault("snr", "0.0") + " dB,");
        System.out.println("  originalMessage : \"" + originalMsg + "\",");
        System.out.println("  extractedMessage : \"" + (extractedMsg != null ? extractedMsg : "NULL") + "\",");
        System.out.println("  chosenAlgorithm : \"" + results.get("chosenAlgorithm") + "\",");
        System.out.println("  status : " + (originalMsg.equals(extractedMsg) ? "\"SUCCESS\"" : "\"FAILED\""));
        System.out.println("}");

        if (originalMsg.equals(extractedMsg)) {
            System.out.println("\n✅ הפענוח הצליח!");
        } else {
            System.out.println("\n❌ כשל בפענוח!");
        }
    }
}