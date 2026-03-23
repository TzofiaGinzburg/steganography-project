package com.photoServer.steganography.strategies;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.analyzer.FileAnalyzer;
import com.photoServer.steganography.analyzer.ImageFileAnalyzer;
import com.photoServer.steganography.analyzer.MediaAnalyzer;
import com.photoServer.steganography.factory.QualityGuard;
import com.photoServer.steganography.factory.SteganoFactory;
import com.photoServer.steganography.factory.SteganoRouter;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.strategies.image.*;
import org.springframework.test.util.ReflectionTestUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SteganoIntegrationTest {

    public static void main(String[] args) throws Exception {
        // 1. הגדרות
        String inputPath = "src/main/resources/2.png";
        String secretMessage = "בדיקת וולידציה למדדי אנלייזר";

        // 2. אתחול רכיבים קיימים
        FileAnalyzer fileAnalyzer = new FileAnalyzer();
        ImageFileAnalyzer imageAnalyzer = new ImageFileAnalyzer();
        SteganoRouter router = new SteganoRouter();
        SteganoFactory factory = new SteganoFactory();

        // 3. חיבור רכיבים (Dependency Injection ידני)
        ReflectionTestUtils.setField(fileAnalyzer, "analyzers", Arrays.asList(imageAnalyzer));
        ReflectionTestUtils.setField(factory, "router", router);
        ReflectionTestUtils.setField(factory, "allStrategies", Arrays.asList(
                new PvdImage(), new LsbImage(), new SpreadSpectrumImage(),
                new MatrixEmbeddingStrategy(), new PatchworkStrategy()
        ));
        factory.afterPropertiesSet();

        // 4. הרצת הניתוח
        byte[] data = Files.readAllBytes(Paths.get(inputPath));
        FileMetrics metrics = fileAnalyzer.analyze("image_b39229.png", data, secretMessage);

        // 5. פלט המדדים לבדיקת התאמה לטבלה
        double entropy = metrics.getMetric("entropy");
        double edgeDensity = metrics.getMetric("edgeDensity");
        double payloadRatio = (metrics.totalPixels() > 0) ? (double) metrics.messageLength() / metrics.totalPixels() : 0;

        System.out.println("\n========== פלט מדדים גולמיים (Raw Metrics) ==========");
        System.out.println("אנטרופיה (Entropy):        " + String.format("%.4f", entropy));
        System.out.println("צפיפות קצוות (Edge Density): " + String.format("%.4f", edgeDensity));
        System.out.println("יחס מטען (Payload Ratio):    " + String.format("%.4f", payloadRatio));
        System.out.println("====================================================\n");

        // 6. קבלת החלטה ובדיקת התאמה
        SteganoStrategy strategy = factory.getOptimalStrategy(metrics);
        System.out.println(">> החלטת הנתב המבוססת על המדדים: " + strategy.getName());

        // 7. ביצוע ואימות איכות
        byte[] stegoData = strategy.embed(data, secretMessage);
        BufferedImage originalBuf = ImageIO.read(new ByteArrayInputStream(data));
        BufferedImage stegoBuf = ImageIO.read(new ByteArrayInputStream(stegoData));

        System.out.println("\n--- בדיקת QualityGuard ---");
        System.out.println("PSNR: " + String.format("%.2f", QualityGuard.calculatePSNR(originalBuf, stegoBuf)) + " dB");
        System.out.println("SSIM: " + String.format("%.4f", QualityGuard.calculateSSIM(originalBuf, stegoBuf)));
        System.out.println("הודעה שחולצה: " + strategy.extract(stegoData).trim());
    }
}