package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

public class VideoIntraPredictionTest {

    @Test
    void testFullProcessAndSave() throws Exception {
        VideoIntraPredictionStrategy strategy = new VideoIntraPredictionStrategy();

        // 1. קריאת קובץ המקור
        byte[] originalVideo = new ClassPathResource("1.mp4").getInputStream().readAllBytes();
        assertNotNull(originalVideo, "❌ קובץ המקור לא נטען! וודא שיש קובץ 1.mp4 בתיקיית resources");

        String secret = "Master_Thesis_2026";

        System.out.println("========================================");
        System.out.println("🚀 מתחיל תהליך סטגנוגרפיה בוידאו");
        System.out.println("📝 הודעה להחבאה: " + secret);
        System.out.println("📦 גודל וידאו מקורי: " + originalVideo.length + " bytes");
        System.out.println("========================================");

        // 2. ביצוע הטמנה
        long startTime = System.currentTimeMillis();
        byte[] stegoVideo = strategy.embed(originalVideo, secret);
        long endTime = System.currentTimeMillis();

        // 3. שמירה פיזית לדיסק
        Path outputPath = Paths.get("target/stego_output_1.mp4");
        Files.createDirectories(outputPath.getParent());
        Files.write(outputPath, stegoVideo);

        System.out.println("✅ הקובץ נשמר בנתיב: " + outputPath.toAbsolutePath());
        System.out.println("⏱ זמן עיבוד (Embedding): " + (endTime - startTime) + "ms");

        // 4. שליפה והשוואה
        System.out.println("\n🔍 מתחיל חילוץ הודעה מהקובץ המוטמן...");
        String extracted = strategy.extract(stegoVideo);

        System.out.println("----------------------------------------");
        System.out.println("📥 הודעה שהוטמנה:  [" + secret + "]");
        System.out.println("📤 הודעה שחולצה: [" + extracted + "]");
        System.out.println("----------------------------------------");

        // הדפסת השוואה בינארית אם יש שגיאה (לצורך Debug)
        if (!secret.equals(extracted)) {
            System.out.println("❌ שגיאה: ההודעות אינן תואמות!");
            System.out.println("Binary Origin:  " + toBinary(secret));
            System.out.println("Binary Extract: " + toBinary(extracted));
        } else {
            System.out.println("✨ הצלחה! השחזור עבר ב-100%");
        }

        // 5. מדדי איכות
        double mse = calculateMSE(originalVideo, stegoVideo);
        System.out.println("\n📊 מדדי איכות (Metrics):");
        System.out.println("   ➤ MSE: " + String.format("%.4f", mse));
        System.out.println("   ➤ PSNR: " + (mse == 0 ? "Infinity" : String.format("%.2f", 10 * Math.log10(65025 / mse))) + " dB");
        System.out.println("========================================");

        assertEquals(secret, extracted, "הודעה שחולצה לא תואמת למקור!");
    }

    private String toBinary(String s) {
        if (s == null) return "null";
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            sb.append(String.format("%8s", Integer.toBinaryString(c)).replace(' ', '0')).append(" ");
        }
        return sb.toString();
    }

    private double calculateMSE(byte[] original, byte[] stego) {
        // בוידאו דחוס הגודל עשוי להשתנות מעט, נחשב לפי המינימלי ביניהם
        int length = Math.min(original.length, stego.length);
        double sum = 0;
        for (int i = 0; i < length; i++) {
            sum += Math.pow((original[i] & 0xFF) - (stego[i] & 0xFF), 2);
        }
        return sum / length;
    }
}