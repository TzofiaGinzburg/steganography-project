package com.photoServer.steganography.service;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.analyzer.MediaAnalyzer;
import com.photoServer.steganography.factory.QualityGuard;
import com.photoServer.steganography.factory.SteganoFactory;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.factory.SteganoRouter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

@Service
public class SteganographyService {

    @Autowired
    private List<MediaAnalyzer> allAnalyzers;

    @Autowired
    private SteganoFactory factory;

    @Autowired
    private SteganoRouter router;

    @Autowired
    private List<SteganoStrategy> allStrategies;

    private static final double QUALITY_THRESHOLD = 35.0;

    public byte[] hide(String fileName, byte[] fileBytes, String message) {
        FileMetrics metrics = createMetrics(fileName, fileBytes, message);
        String chosenAlgorithm = router.decideAlgorithm(metrics);

        SteganoStrategy strategy = factory.getStrategy(chosenAlgorithm);

        // 1. ניסיון הטמנה ראשון
        byte[] stegoBytes = strategy.embed(fileBytes, strategy.getName() + "::" + message);

        // 2. בדיקת איכות ו-Fallback
        double psnr = getPSNR(fileBytes, stegoBytes);
        if (psnr < QUALITY_THRESHOLD && metrics.type() == MediaType.IMAGE) {
            boolean isCompressed = fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg");
            String fallbackAlg = isCompressed ? "OutGuessStrategy" : "MatrixEmbeddingStrategy";

            if (!chosenAlgorithm.equals(fallbackAlg)) {
                System.out.println("🔄 [FALLBACK] עובר לאלגוריתם: " + fallbackAlg);
                strategy = factory.getStrategy(fallbackAlg);
                // תיקון: עדכון ההדר לאלגוריתם החדש!
                stegoBytes = strategy.embed(fileBytes, strategy.getName() + "::" + message);
            }
        }

        System.out.println("✅ [SERVICE] הסתרה הושלמה עם: " + strategy.getName());
        return stegoBytes;
    }

    public String extractMessage(String fileName, byte[] stegoBytes) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        MediaType currentType = MediaType.fromExtension(extension);

        for (SteganoStrategy strategy : allStrategies) {
            // סינון שקט לפי סוג הקובץ (תמונה/אודיו)
            if (strategy.getSupportedType() != currentType) continue;

            try {
                String result = strategy.extract(stegoBytes);
                String header = strategy.getName() + "::";

                // בדיקה אם האלגוריתם הנוכחי הוא זה שביצע את ההצפנה
                if (result != null && result.startsWith(header)) {
                    String cleanMessage = result.substring(header.length());

                    // הדפסה יחידה ומפורטת של התוצאה כפי שביקשת
                    System.out.println("\n===============================================");
                    System.out.println("✅ אלגוריתם תואם נמצא: " + strategy.getName());
                    System.out.println("📩 הודעה שפוענחה: " + cleanMessage);
                    System.out.println("===============================================\n");

                    return cleanMessage;
                }
            } catch (Exception e) {
                // שגיאות פנימיות נבלעות כדי לא ללכלך את הלוג
            }
        }

        System.out.println("❌ לא נמצא אלגוריתם תואם עבור הקובץ שסופק.");
        return null;
    }
    private boolean isStrategyCompatibleWithType(SteganoStrategy strategy, MediaType type) {
        String name = strategy.getClass().getSimpleName().toLowerCase();
        if (type == MediaType.IMAGE) {
            return name.contains("image") || name.contains("outguess") || name.contains("juniward") || name.contains("matrix");
        }
        if (type == MediaType.AUDIO) {
            return name.contains("audio");
        }
        return false;
    }

    private boolean isValidResponse(String res, String strategyName) {
        return res != null && res.contains(strategyName + "::");
    }

    private String cleanResponse(String res, String strategyName) {
        return res.substring(res.indexOf("::") + 2).trim();
    }
    // מתודת עזר לסריקה כללית (הלוגיקה הישנה שלך)
    private String searchAllStrategies(byte[] stegoBytes) {
        for (SteganoStrategy strategy : allStrategies) {
            try {
                String res = strategy.extract(stegoBytes);
                if (res != null && res.contains(strategy.getName() + "::")) {
                    return res.substring(res.indexOf("::") + 2).trim();
                }
            } catch (Exception ignore) {}
        }
        return "❌ לא נמצאה הודעה מוצפנת";
    }

    private boolean isMismatched(String fileName, String strategyName) {
        String name = strategyName.toLowerCase();
        String file = fileName.toLowerCase();
        if (name.contains("audio") && (file.endsWith(".jpg") || file.endsWith(".png"))) return true;
        if (name.contains("lsbimage") && file.endsWith(".jpg")) return true; // LSB לא עובד על JPG
        return false;
    }

    private FileMetrics createMetrics(String fileName, byte[] fileBytes, String message) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        MediaType type = MediaType.fromExtension(extension);
        MediaAnalyzer analyzer = allAnalyzers.stream()
                .filter(a -> a.getSupportedType() == type)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("סוג קובץ לא נתמך: " + extension));

        Map<String, Double> metricsMap = analyzer.analyze(fileBytes);

        // שליפת נתונים בסיסיים לאנליזה
        long totalPixels = metricsMap.getOrDefault("totalPixels", 0.0).longValue();

        return new FileMetrics(type, (long) fileBytes.length, totalPixels, message.length(), metricsMap);
    }

    private double getPSNR(byte[] original, byte[] stego) {
        try {
            BufferedImage img1 = ImageIO.read(new ByteArrayInputStream(original));
            BufferedImage img2 = ImageIO.read(new ByteArrayInputStream(stego));
            if (img1 == null || img2 == null) return 100.0;
            return QualityGuard.calculatePSNR(img1, img2);
        } catch (Exception e) {
            return 0.0;
        }
    }
}