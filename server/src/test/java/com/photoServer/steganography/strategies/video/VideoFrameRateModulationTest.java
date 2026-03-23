package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class VideoFrameRateModulationTest {

    @Test
    void testFrameRateModulationWithBootstrap() throws Exception {
        VideoFrameRateModulationStrategy strategy = new VideoFrameRateModulationStrategy();

        String fileName = "1.mp4";
        ClassPathResource resource = new ClassPathResource(fileName);

        if (!resource.exists()) {
            System.err.println("❌ שגיאה: הקובץ " + fileName + " לא נמצא!");
            return;
        }

        // קריאה בטוחה של הקובץ (עובד גם בתוך JAR וגם במערכת קבצים)
        byte[] originalVideoData;
        try (InputStream is = resource.getInputStream()) {
            originalVideoData = is.readAllBytes();
        }

        System.out.println("\n--- [START TEST] Frame Rate Modulation ---");
        System.out.println("🎬 File Loaded: " + fileName);
        System.out.println("📊 Original Size: " + originalVideoData.length + " bytes");

        String secret = "FRM";

        // 1. ביצוע ההטמנה
        byte[] stegoVideo = strategy.embed(originalVideoData, secret);

        // 2. בדיקת תקינות הגודל (שינוי כאן!)
        // אנחנו בודקים שהקובץ לא "ריק" (כמו שקרה לך קודם עם ה-262 בתים)
        assertTrue(stegoVideo.length > originalVideoData.length * 0.1,
                "הקובץ שנוצר קטן מדי (" + stegoVideo.length + " bytes), כנראה שההקלטה נכשלה!");

        System.out.println("📊 Stego Size: " + stegoVideo.length + " bytes");

        // 3. ביצוע השליפה
        String extracted = strategy.extract(stegoVideo);

        System.out.println("\n--- [RESULTS] ---");
        System.out.println("Original Message:  " + secret);
        System.out.println("Extracted Message: " + extracted);

        // 4. בדיקת התאמה למקור
        assertEquals(secret, extracted, "הודעת ה-FRM שחולצה אינה תואמת למקור!");
        System.out.println("✅ Test Passed Successfully!");
    }
}