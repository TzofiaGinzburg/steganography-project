package com.photoServer.steganography.strategies;

import com.photoServer.steganography.factory.QualityGuard;
import com.photoServer.steganography.service.SteganographyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootTest
public class SteganoFullCycleTest {

    @Autowired
    private SteganographyService steganographyService;

    @Test
    public void testFullFlow() throws Exception {
        String inputPath = "src/main/resources/7.jpg";
        byte[] originalBytes = Files.readAllBytes(Paths.get(inputPath));
        String secretMessage = "This is a top secret message hidden by the Orchestrator!";

        System.out.println("--- מתחיל תהליך הסתרה מלא ---");
        byte[] resultBytes = steganographyService.hide("7f.jpg", originalBytes, secretMessage);
// --- כאן תוסיפי את השמירה הפיזית ---
        String outputPath = "src/main/resources/7f.jpg"; // נשמור את זה ב-Resources שיהיה קל לראות
        Files.write(Paths.get(outputPath), resultBytes);
        System.out.println("💾 הקובץ נשמר בהצלחה בנתיב: " + new File(outputPath).getAbsolutePath());
//
        // --- הוספת חישוב איכות (זה ה-4 שחיפשת!) ---
        BufferedImage originalImg = ImageIO.read(new ByteArrayInputStream(originalBytes));
        BufferedImage stegoImg = ImageIO.read(new ByteArrayInputStream(resultBytes));

        double psnr = QualityGuard.calculatePSNR(originalImg, stegoImg);
        double ssim = QualityGuard.calculateSSIM(originalImg, stegoImg);

        System.out.println("\n--- 📊 מדדי איכות (Quality Metrics) ---");
        System.out.printf("PSNR: %.2f dB %s\n", psnr, (psnr > 40 ? "✅ (Excellent)" : psnr > 30 ? "⚠️ (Visible noise)" : "❌ (Poor)"));
        System.out.printf("SSIM: %.4f %s\n", ssim, (ssim > 0.95 ? "✅ (High Similarity)" : "❌ (Distorted)"));

        // בדיקת יעילות: כמה ביטים הטמנו לכל פיקסל
        double bpp = (double)(secretMessage.length() * 8) / (originalImg.getWidth() * originalImg.getHeight());
        System.out.printf("Efficiency (BPP): %.4f bits per pixel\n", bpp);

        // --- המשך החילוץ והאימות ---
        System.out.println("\n--- מתחיל תהליך חילוץ לאימות ---");
        String extractedMessage = steganographyService.extractMessage("7f.jpg", resultBytes);

        System.out.println("\n========================================");
        System.out.println("📤 הודעה שהוחבאה: " + secretMessage);
        System.out.println("📥 הודעה שחולצה: " + extractedMessage.trim());

        if (secretMessage.equals(extractedMessage.trim()) && psnr > 35) {
            System.out.println("✅ הצלחה מלאה: גם חילוץ תקין וגם איכות ויזואלית טובה!");
        } else if (!secretMessage.equals(extractedMessage.trim())) {
            System.out.println("❌ כישלון בחילוץ! בדוק סנכרון רעש באלגוריתם.");
        } else {
            System.out.println("⚠️ הצלחה בחילוץ, אך האיכות נמוכה (PSNR < 35). שקול להחליף אלגוריתם.");
        }
        // אחרי שייצרת את resultBytes וקראת ל-stegoImg:
        BufferedImage heatmap = QualityGuard.generateHeatmap(originalImg, stegoImg);
        File heatmapFile = new File("src/main/resources/heatmap.png");
        ImageIO.write(heatmap, "png", heatmapFile);

        System.out.println("🔥 מפת חום נוצרה בנתיב: " + heatmapFile.getAbsolutePath());
    }


}