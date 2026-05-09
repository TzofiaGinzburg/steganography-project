package com.photoServer.steganography.strategies;

import com.photoServer.steganography.service.SteganographyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class VideoSteganoFullCycleTest {

    @Autowired
    private SteganographyService steganographyService;

    @Test
    public void testVideoFullFlow() throws Exception {
        // 1. הגדרות נתיבים - וודאי שיש לך קובץ test_video.mp4 בתיקיית resources
        String inputFileName = "1.mp4";
        String inputPath = "src/main/resources/" + inputFileName;
        String outputFileName = "stego_video1.mp4";
        String outputPath = "src/main/resources/" + outputFileName;

        File inputFile = new File(inputPath);
        if (!inputFile.exists()) {
            throw new RuntimeException("❌ קובץ מקור לא נמצא בנתיב: " + inputFile.getAbsolutePath());
        }

        byte[] originalBytes = Files.readAllBytes(Paths.get(inputPath));
        String secretMessage = "122222222222222222222222222";

        System.out.println("\n🎬 === התחלת טסט וידאו מלא (מעבדה) ===");
        System.out.println("📦 גודל קובץ מקור: " + originalBytes.length / 1024 + " KB");

        // 2. ביצוע הסתרה דרך ה-Service (כולל ה-Router וה-Header)
        long startHide = System.currentTimeMillis();
        Map<String, Object> hideResults = steganographyService.hideWithFullMetrics(inputFileName, originalBytes, secretMessage);
        byte[] stegoBytes = (byte[]) hideResults.get("bytes");
        long endHide = System.currentTimeMillis();

        // 3. שמירה פיזית של התוצאה לבדיקה ידנית
        Files.write(Paths.get(outputPath), stegoBytes);
        System.out.println("💾 קובץ הסטגנו נשמר ב: " + new File(outputPath).getAbsolutePath());

        // 4. הדפסת מדדים מה-Service
        System.out.println("\n--- 📊 מדדי וידאו (Video Metrics) ---");
        System.out.println("🤖 אלגוריתם שנבחר: " + hideResults.get("chosenAlgorithm"));
        System.out.println("⏱️ זמן הטמנה: " + (endHide - startHide) + " ms");
        System.out.println("📈 שינוי בגודל קובץ: " + (stegoBytes.length - originalBytes.length) + " bytes");

        // 5. ניסיון חילוץ לאימות הסנכרון
        System.out.println("\n--- 🔍 מתחיל תהליך חילוץ ואימות סנכרון ---");
        long startExtract = System.currentTimeMillis();

        // כאן אנחנו בודקים אם ה-Service מצליח לזהות את ה-Header ולחלץ
        String extractedMessage = steganographyService.extractMessage(outputFileName, stegoBytes);
        long endExtract = System.currentTimeMillis();

        System.out.println("⏱️ זמן חילוץ: " + (endExtract - startExtract) + " ms");
        System.out.println("\n========================================");
        System.out.println("📤 הודעה מקורית: " + secretMessage);
        System.out.println("📥 הודעה שחולצה: " + extractedMessage);
        System.out.println("========================================\n");

        // 6. Assertions - האם המעבדה הצליחה?
        boolean isMatch = secretMessage.equals(extractedMessage.trim());

        if (isMatch) {
            System.out.println("✅ [SUCCESS] הסנכרון עובד! האלגוריתם הטמיע וחילץ בצורה מושלמת.");
        } else {
            System.err.println("❌ [FAILURE] כישלון בחילוץ! ייתכן והדחיסה של הוידאו הרסה את המידע.");
            if (extractedMessage.contains("ERROR")) {
                System.err.println("🛑 שגיאת מערכת: " + extractedMessage);
            }
        }

        assertTrue(isMatch, "הודעה שחולצה חייבת להיות זהה למקורית!");
    }
}
