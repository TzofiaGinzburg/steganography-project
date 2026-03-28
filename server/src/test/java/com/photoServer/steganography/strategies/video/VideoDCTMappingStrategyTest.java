package com.photoServer.steganography.strategies.video;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.*;

public class VideoDCTMappingStrategyTest {

    @Test
    void testDCTEmbedAndExtract() throws Exception {
        VideoDCTMappingStrategy strategy = new VideoDCTMappingStrategy();

        // 1. טעינת הקובץ - וודא שהקובץ נמצא ב: src/test/resources/1.mp4
        String fileName = "1.mp4";
        ClassPathResource resource = new ClassPathResource(fileName);

        if (!resource.exists()) {
            fail("❌ קובץ הבדיקה '1.mp4' לא נמצא ב-src/test/resources!");
        }

        byte[] originalVideo = Files.readAllBytes(Paths.get(resource.getURI()));
        String secret = "DCT_Stego_2026";

        System.out.println("====================================================");
        System.out.println("📊 DCT ROBUSTNESS TEST");
        System.out.println("====================================================");
        System.out.println("🔹 Original Size: " + originalVideo.length + " bytes");

        // 2. EMBED
        System.out.println("⏳ Embedding secret...");
        byte[] stegoVideo = strategy.embed(originalVideo, secret);

        assertNotNull(stegoVideo, "Stego video should not be null");

        // שמירה לדיסק לצורך ניתוח במקרה של כישלון
        Path outDir = Paths.get("target/test-output1");
        Files.createDirectories(outDir);
        Path outPath = outDir.resolve("stego_dct_result.mp4");
        Files.write(outPath, stegoVideo);
        System.out.println("💾 Saved result to: " + outPath.toAbsolutePath());

        // 3. EXTRACT
        System.out.println("⏳ Extracting secret (this may take a few seconds)...");
        long startTime = System.currentTimeMillis();
        String extracted = strategy.extract(stegoVideo);
        long duration = System.currentTimeMillis() - startTime;

        System.out.println("⏱ Extraction took: " + duration + " ms");
        System.out.println("\n📥 Original : [" + secret + "]");
        System.out.println("📤 Extracted: [" + extracted + "]");

        // 4. VERIFICATION
        // אם הסטרטגיה מוסיפה Prefix, אנחנו בודקים שה-Secret מוכל בתוצאה
        assertEquals(secret, extracted, "❌ המידע שחולץ לא תואם למקור!");

        System.out.println("✅ RESULT: SUCCESS!");
        System.out.println("====================================================");
    }
}