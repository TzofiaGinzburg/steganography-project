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
import java.util.HashMap;
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

    // השורה שהייתה חסרה וגרמה לאדום:
    private static final double QUALITY_THRESHOLD = 35.0;

    public Map<String, Object> hideWithFullMetrics(String fileName, byte[] fileBytes, String message) {
        long startTime = System.currentTimeMillis();

        // 1. ביצוע ההסתרה
        byte[] stegoBytes = hide(fileName, fileBytes, message);

        long endTime = System.currentTimeMillis();
        double duration = (endTime - startTime) / 1000.0;

        try {
            // 2. קריאת התמונות מחדש מהבייטים (מונע PSNR של 100)
            BufferedImage originalImg = ImageIO.read(new ByteArrayInputStream(fileBytes));
            BufferedImage stegoImg = ImageIO.read(new ByteArrayInputStream(stegoBytes));

            // 3. הרצת האנלייזר על התוצאה הסופית (לסנכרון אנטרופיה וקצוות)
            FileMetrics stegoMetrics = createMetrics(fileName, stegoBytes, message);

            // 4. חישוב מדדים מדעיים
            double psnr = QualityGuard.calculatePSNR(originalImg, stegoImg);
            double ssim = QualityGuard.calculateSSIM(originalImg, stegoImg);

            // חישוב BPP אמיתי
            long totalPixels = (long) originalImg.getWidth() * originalImg.getHeight();
            double realBpp = (message.length() * 8.0) / totalPixels;

            // 5. בניית התשובה - תיקון שמות המפתחות לסנכרון מלא
            Map<String, Object> results = new HashMap<>();
            results.put("bytes", stegoBytes);
            results.put("psnr", psnr);
            results.put("ssim", ssim);

            // שליפה נכונה מהאנלייזר (לפי השמות ב-ImageFileAnalyzer)
            results.put("entropy", stegoMetrics.getMetric("entropy"));
            results.put("edgeDensity", stegoMetrics.getMetric("edgeDensity")); // השם המדויק!

            results.put("bpp", realBpp);
            results.put("time", duration);
            results.put("chosenAlgorithm", getChosenAlgorithmName(fileName, fileBytes, message));

            return results;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating metrics: " + e.getMessage());
        }
    }

    // פונקציית עזר חדשה שמונעת כפל הרצות של ה-Router
    private Object[] hideAndReturnAlg(FileMetrics metrics, byte[] fileBytes, String message, String fileName) {
        String chosenAlgorithm = router.decideAlgorithm(metrics);
        SteganoStrategy strategy = factory.getStrategy(chosenAlgorithm);

        byte[] stegoBytes = strategy.embed(fileBytes, strategy.getName() + "::" + message);
        String finalAlg = strategy.getName();

        // לוגיקת ה-Fallback
        double psnr = getPSNR(fileBytes, stegoBytes);
        if (psnr < QUALITY_THRESHOLD && metrics.type() == MediaType.IMAGE) {
            boolean isCompressed = fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg");
            String fallbackAlg = isCompressed ? "OutGuessStrategy" : "MatrixEmbeddingStrategy";

            if (!chosenAlgorithm.equals(fallbackAlg)) {
                System.out.println("🔄 [FALLBACK] עובר ל: " + fallbackAlg);
                strategy = factory.getStrategy(fallbackAlg);
                stegoBytes = strategy.embed(fileBytes, strategy.getName() + "::" + message);
                finalAlg = strategy.getName();
            }
        }
        return new Object[]{stegoBytes, finalAlg};
    }
    // בתוך SteganographyService.java
    public String getChosenAlgorithmName(String fileName, byte[] fileBytes, String message) {
        FileMetrics metrics = createMetrics(fileName, fileBytes, message);
        return router.decideAlgorithm(metrics);
    }
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
package com.photoServer.steganography.service;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.factory.SteganoFactory;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.analyzer.MediaAnalyzer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class SteganographyService {

    @Autowired
    private SteganoFactory factory;

    @Autowired
    private MediaAnalyzer analyzer;

    /**
     * פונקציית ההסתרה המרכזית - מבצעת ניתוח, בחירת אסטרטגיה וחישוב מדדים
     */
    public Map<String, Object> hideWithFullMetrics(String fileName, byte[] coverBytes, String message) {
        try {
            // 1. ניתוח המדיה (מזהה אם זה IMAGE או AUDIO)
            FileMetrics initialMetrics = analyzer.analyze(fileName, coverBytes);

            // 2. בחירת האלגוריתם המתאים ביותר מה-Factory
            SteganoStrategy strategy = factory.getOptimalStrategy(initialMetrics);

            // 3. ביצוע ההסתרה (הטמעת המסר בתוך הקובץ)
            byte[] stegoBytes = strategy.embed(coverBytes, message);

            // 4. הכנת אובייקט התוצאות
            Map<String, Object> results = new HashMap<>();
            results.put("bytes", stegoBytes);
            results.put("chosenAlgorithm", strategy.getClass().getSimpleName());
            results.put("mediaType", initialMetrics.type());

            // --- ניווט חכם לחישוב מדדים לאחר הסתרה ---
            if (initialMetrics.type() == MediaType.IMAGE) {
                // קריאה לפונקציית מדדי תמונה (כאן נמצא הקוד של ה-BufferedImage)
                calculateImagePostMetrics(results, coverBytes, stegoBytes);
            }
            else if (initialMetrics.type() == MediaType.AUDIO) {
                // קריאה לפונקציית מדדי אודיו (כך נמנעת קריסה על ה-Width)
                calculateAudioPostMetrics(results, initialMetrics);
            }

            return results;

        } catch (Exception e) {
            System.err.println("❌ Critical Error in SteganographyService: " + e.getMessage());
            throw new RuntimeException("Steganography processing failed: " + e.getMessage(), e);
        }
    }

    /**
     * חישוב מדדים עבור אודיו (WAV/MP3)
     */
    private void calculateAudioPostMetrics(Map<String, Object> results, FileMetrics metrics) {
        // כאן אנחנו מושכים את המדדים הרלוונטיים לשמע שכבר חושבו ב-Analyzer
        results.put("snr", metrics.getMetric("snr"));
        results.put("rms", metrics.getMetric("rms"));
        results.put("spectralActivity", metrics.getMetric("spectralActivity"));
        System.out.println("📊 [SERVICE] Audio metrics calculated successfully.");
    }

    /**
     * חישוב מדדים עבור תמונות (PNG/JPG)
     */
    private void calculateImagePostMetrics(Map<String, Object> results, byte[] cover, byte[] stego) {
        try {
            // כאן נמצא הקוד שגרם לשגיאה קודם - עכשיו הוא מוגן בתוך תנאי של IMAGE בלבד
            BufferedImage img1 = ImageIO.read(new ByteArrayInputStream(cover));
            BufferedImage img2 = ImageIO.read(new ByteArrayInputStream(stego));

            if (img1 != null && img2 != null) {
                int width = img1.getWidth();
                int height = img1.getHeight();
                results.put("dimensions", width + "x" + height);

                // כאן אפשר להוסיף חישוב PSNR או MSE בעתיד
                // double psnr = calculatePSNR(img1, img2);
                // results.put("psnr", psnr);
            }
            System.out.println("🖼️ [SERVICE] Image metrics calculated successfully.");
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Could not calculate image metrics: " + e.getMessage());
        }
    }

    /**
     * פונקציית חילוץ (Extract) - מוצאת את המסר המוחבא
     */
    public String extract(String fileName, byte[] stegoBytes) {
        // מנתח את הקובץ כדי לדעת איזה אלגוריתם נבחר (לפי המדדים)
        FileMetrics metrics = analyzer.analyze(fileName, stegoBytes);
        SteganoStrategy strategy = factory.getOptimalStrategy(metrics);

        // מבצע חילוץ
        return strategy.extract(stegoBytes);
    }
}