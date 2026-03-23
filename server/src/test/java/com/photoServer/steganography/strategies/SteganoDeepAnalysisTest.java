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
import java.util.*;

public class SteganoDeepAnalysisTest {

    public static void main(String[] args) throws Exception {
        // 1. הגדרות בסיסיות
        String inputPath = "src/main/resources/input_image.png";
        String secretMessage = "בדיקת השוואה רב-אלגוריתמית";

        byte[] data = Files.readAllBytes(Paths.get(inputPath));
        BufferedImage originalBuf = ImageIO.read(new ByteArrayInputStream(data));

        // 2. אתחול רכיבים
        SteganoRouter router = new SteganoRouter();
        ImageFileAnalyzer imageAnalyzer = new ImageFileAnalyzer();
        FileMetrics metrics = new FileAnalyzer().analyze("test.png", data, secretMessage);

        // רשימת כל האסטרטגיות לבדיקה השוואתית
        List<SteganoStrategy> strategies = Arrays.asList(
                new LsbImage(),
                new PvdImage(),
                new SpreadSpectrumImage(),
                new MatrixEmbeddingStrategy(),
                new PatchworkStrategy()
        );

        System.out.println("====================================================");
        System.out.println("📊 ניתוח השוואתי: ביצועי אלגוריתמים על התמונה");
        System.out.println("====================================================");
        System.out.printf("%-25s | %-8s | %-8s | %-8s\n", "Algorithm", "PSNR", "SSIM", "Time(ms)");
        System.out.println("----------------------------------------------------");

        SteganoStrategy recommended = null;
        String recommendedName = router.decideAlgorithm(metrics);

        for (SteganoStrategy strategy : strategies) {
            try {
                long start = System.currentTimeMillis();
                byte[] stegoData = strategy.embed(data, secretMessage);
                long end = System.currentTimeMillis();

                BufferedImage stegoBuf = ImageIO.read(new ByteArrayInputStream(stegoData));
                double psnr = QualityGuard.calculatePSNR(originalBuf, stegoBuf);
                double ssim = QualityGuard.calculateSSIM(originalBuf, stegoBuf);

                String name = strategy.getClass().getSimpleName();
                boolean isWinner = name.toLowerCase().contains(recommendedName.toLowerCase().replace("strategy", ""));

                String row = String.format("%-25s | %-8.2f | %-8.4f | %-8d",
                        name + (isWinner ? " ⭐" : ""), psnr, ssim, (end - start));
                System.out.println(row);

                // שמירת תוצאות להשוואה ויזואלית
                Files.write(Paths.get("target/compare_" + name + ".png"), stegoData);

            } catch (Exception e) {
                System.out.printf("%-25s | FAILED   | N/A      | N/A\n", strategy.getClass().getSimpleName());
            }
        }

        System.out.println("----------------------------------------------------");
        System.out.println("⭐ = האלגוריתם שנבחר ע\"י ה-Router");
        System.out.println("\n[תובנות ויזואליות]:");
        printInsights(metrics, recommendedName);
    }

    private static void printInsights(FileMetrics m, String winner) {
        double ed = m.getMetric("edgeDensity");
        double en = m.getMetric("entropy");

        if (ed > 0.12) {
            System.out.println("- בגלל צפיפות קצוות גבוהה (" + String.format("%.2f", ed) + "), PVD אמור להציג PSNR עדיף על LSB.");
        } else {
            System.out.println("- התמונה חלקה מאוד. Spread Spectrum עשוי להיות יציב יותר, אך PSNR עלול לרדת.");
        }

        System.out.println("- בדוק את הקבצים בתיקיית target/compare_*.png כדי לראות אם יש ארטיפקטים (עיוותים) בעין.");
    }
}