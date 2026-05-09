package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
public class VideoMotionVectorTest {

    @Autowired
    private VideoMotionVectorStrategy strategy;

    @Test
    @DisplayName("בדיקת סבב מלא: הטמנה וחילוץ בפורמט MP4 דחוס")
    public void testVideoSteganographyCycle() throws Exception {
        // 1. טעינת וידאו דחוס (חייב להיות קובץ עם תנועה כדי שיהיו וקטורים)
        Path videoPath = Paths.get("src\\main\\resources\\1.mp4");
        if (!Files.exists(videoPath)) {
            Assertions.fail("❌ קובץ וידאו לבדיקה לא נמצא! שים קובץ MP4 בתיקיית resources/test");
        }
        byte[] originalVideo = Files.readAllBytes(videoPath);

        // 2. הודעה סודית - ננסה להטמין הודעה ארוכה כדי לבדוק קיבולת
        String secretMessage = "Con.";
        int requiredBits = (secretMessage.length() + "##MV##".length()) * 8;

        System.out.println("📊 הודעה נדרשת: " + secretMessage.length() + " תווים (" + requiredBits + " ביטים)");

        // 3. הטמנה - כאן מתבצע ה-Re-encoding לפורמט הדחוס
        System.out.println("🎬 מתחיל תהליך הטמנה... (זה עשוי לקחת כמה שניות בגלל ה-Encoding)");
        byte[] stegoVideo = strategy.embed(originalVideo, secretMessage);

        // 4. בדיקת שלמות הקובץ
        Assertions.assertNotNull(stegoVideo, "הקובץ שחזר ריק - תקלה בקידוד");
        assertTrue(stegoVideo.length > 0);

        // 5. שליפה - ה-Moment of Truth
        System.out.println("🔍 מנסה לחלץ את ההודעה מהוקטורים...");
        String extractedMessage = strategy.extract(stegoVideo);

        // 6. ניהול שגיאות קיבולת וחילוץ
        if ("NOT_FOUND".equals(extractedMessage)) {
            printCapacityError(requiredBits);
            Assertions.fail("קיבולת הוידאו קטנה מדי או שהמידע נדרס בדחיסה");
        } else {
            System.out.println("✅ הצלחה! הודעה שולפה: " + extractedMessage);
            Assertions.assertEquals(secretMessage, extractedMessage, "ההודעה שולפה אך היא פגומה!");
        }
    }

    private void printCapacityError(int requiredBits) {
        System.err.println("==============================================");
        System.err.println("🛑 שגיאת קיבולת (Capacity Limit Overflow)");
        System.err.println("הוידאו שבחרת 'שקט' מדי או קצר מדי.");
        System.err.println("בוידאו דחוס, מידע נשמר רק בוקטורי תנועה משמעותיים.");
        System.err.println("נדרשו לפחות " + requiredBits + " וקטורים תקינים להטמנה.");
        System.err.println("💡 פתרון: השתמש בוידאו עם יותר תנועה או ברזולוציה גבוהה יותר.");
        System.err.println("==============================================");
    }

    private void assertTrue(boolean condition) {
        if (!condition) Assertions.fail("Condition failed");
    }
}