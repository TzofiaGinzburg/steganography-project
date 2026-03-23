package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class YuvGenerator {

    /**
     * פונקציה ליצירת קובץ YUV 4:2:0 Raw תקני עבור טסטים.
     * הקובץ ייצר תבנית צבע חלקה (Smooth Gradient) כדי לדמות וידאו אמיתי.
     */
    @Test
    void generateTestYuvFile() throws IOException {
        // הגדרת מאפייני הוידאו: Full HD (1080p)
        int width = 1920;
        int height = 1080;
        String fileName = "src/main/resources/raw_video.yuv"; // נתיב יצירת הקובץ

        System.out.println("🎬 Generating RAW YUV File (Full HD 1080p)...");
        System.out.println("📊 Target File: " + fileName);

        // חישוב גודל הפריים ב-YUV 4:2:0: width * height * 1.5
        // Y - רכיב הבהירות (Full resolution)
        int yPlaneSize = width * height;
        // U ו-V - רכיבי הצבע (Chroma subsampled 2x2)
        int uvPlaneSize = (width / 2) * (height / 2);
        int frameSize = yPlaneSize + (2 * uvPlaneSize);

        byte[] frameData = new byte[frameSize];

        // 1. מילוי רכיב הבהירות (Y Plane) - גרדיאנט אופקי חלש
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int index = y * width + x;
                frameData[index] = (byte) ((x % 256)); // בהירות משתנה חלש
            }
        }

        // 2. מילוי רכיבי הצבע (U & V Planes) - גרדיאנט אנכי ואופקי
        // U Plane
        for (int y = 0; y < height / 2; y++) {
            for (int x = 0; x < width / 2; x++) {
                int index = yPlaneSize + (y * (width / 2) + x);
                frameData[index] = (byte) ((y % 256)); // U משתנה אנכי
            }
        }

        // V Plane
        for (int y = 0; y < height / 2; y++) {
            for (int x = 0; x < width / 2; x++) {
                int index = yPlaneSize + uvPlaneSize + (y * (width / 2) + x);
                frameData[index] = (byte) ((x % 256)); // V משתנה אופקי
            }
        }

        // כתיבת הנתונים לקובץ
        File outputFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(outputFile)) {
            fos.write(frameData);
        }

        System.out.println("✅ [SUCCESS] Created RAW YUV File: " + outputFile.getAbsolutePath());
        System.out.println("📊 Size: " + outputFile.length() + " bytes");
    }
}