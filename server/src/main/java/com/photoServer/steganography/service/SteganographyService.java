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

    private static final double QUALITY_THRESHOLD = 35.0;

    public Map<String, Object> hideWithFullMetrics(String fileName, byte[] coverBytes, String message) {
        System.out.println("🚀 [START] hideWithFullMetrics - File: " + fileName);

        // 1. חישוב מדדים
        FileMetrics metrics = createMetrics(fileName, coverBytes, message);

        // 2. בחירת אלגוריתם והסתרה
        String chosenAlgorithm = router.decideAlgorithm(metrics);
        SteganoStrategy strategy = factory.getStrategy(chosenAlgorithm);

// במקום להשתמש ב-chosenAlgorithm הגולמי, נשתמש ב-strategy.getName()
// זה מבטיח שה-Header יהיה זהה למה שה-Factory יודע לזהות אחר כך.
        String header = strategy.getName() + "::";
        System.out.println("✍️ [EMBED] Using Header: " + header);

        long startTime = System.currentTimeMillis();
        byte[] stegoBytes = strategy.embed(coverBytes, header + message); // שימוש ב-Header המובטח
        long endTime = System.currentTimeMillis();

        // 3. בניית אובייקט התוצאה
        Map<String, Object> results = new HashMap<>();
        results.put("bytes", stegoBytes);
        results.put("chosenAlgorithm", chosenAlgorithm);
        results.put("time", (endTime - startTime) / 1000.0);
        results.put("entropy", metrics.getMetric("entropy"));
        results.put("bpp", (double)(message.length() * 8) / coverBytes.length);

        // ---------------------------------------------------------
        // 🚀 הפרדה קריטית: מדדים לפי סוג מדיה
        // ---------------------------------------------------------
        if (metrics.type() == MediaType.AUDIO) {
            // מדדי אודיו בלבד
            double zcrOriginal = QualityGuard.calculateZCR(coverBytes);
            double zcrStego = QualityGuard.calculateZCR(stegoBytes);
            results.put("zcrDiff", Math.abs(zcrOriginal - zcrStego));
            results.put("snr", metrics.getMetric("snr"));
            results.put("rms", metrics.getMetric("rms"));

            // מונע קריסה: מאפס מדדי תמונה באודיו
            results.put("psnr", 0.0);
            results.put("edgeDensity", 0.0);
        } else {
            // מדדי תמונה בלבד
            results.put("psnr", getPSNR(coverBytes, stegoBytes));

            // שליפה בטוחה של קצוות (בודק את שני השמות האפשריים)
            Double edges = metrics.getMetric("edgeDensity");
            if (edges == null) edges = metrics.getMetric("edge_density");
            results.put("edgeDensity", edges != null ? edges : 0.0);

            // איפוס מדדי אודיו בתמונה
            results.put("snr", 0.0);
        }

        System.out.println("✅ [HIDE DONE] Process finished for " + metrics.type());
        return results;
    }
    public String extractMessage(String fileName, byte[] stegoData) {
        try {
            String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            MediaType type = MediaType.fromExtension(extension);

            if (type == MediaType.AUDIO) {
                System.out.println("🔍 [STEP 1] Extracting algorithm name from header...");

                String algoName = null;
                String messagePart = null;

                // אנחנו עוברים על האסטרטגיות רק כדי למצוא מי מהן מצליחה לקרוא את הכותרת שלה
                for (SteganoStrategy strategy : allStrategies) {
                    if (strategy.getSupportedType() == MediaType.AUDIO) {
                        String raw = strategy.extract(stegoData);

                        if (raw != null && raw.contains("::")) {
                            String[] parts = raw.split("::", 2);
                            algoName = parts[0]; // שלפנו את השם מהכותרת!
                            messagePart = parts[1]; // זה המסר
                            break;
                        }
                    }
                }

                if (algoName == null) {
                    System.out.println("❌ Could not identify algorithm from header.");
                    return "ERROR::MARKER_NOT_FOUND";
                }

                // [STEP 2] פנייה לאלגוריתם הנכון בלבד לפי מה ששלפנו
                System.out.println("🎯 [STEP 2] Heading to: " + algoName);
                SteganoStrategy finalStrategy = factory.getStrategy(algoName);

                // עכשיו אנחנו משתמשים רק בו (במקרה שלנו messagePart כבר מכיל את המידע)
                return messagePart;

            } else {
                // לוגיקת תמונות - ללא שינוי
                for (SteganoStrategy s : allStrategies) {
                    if (s.getSupportedType() == MediaType.IMAGE) {
                        String res = s.extract(stegoData);
                        if (res != null && res.contains("::")) return res;
                    }
                }
            }
            return "ERROR::NOT_FOUND";
        } catch (Exception e) {
            return "ERROR::" + e.getMessage();
        }
    }
    public byte[] hide(String fileName, byte[] fileBytes, String message) {
        System.out.println("📦 [HIDE] Creating metrics...");
        FileMetrics metrics = createMetrics(fileName, fileBytes, message);

        System.out.println("🤖 [ROUTER] Deciding algorithm...");
        String chosenAlgorithm = router.decideAlgorithm(metrics);
        System.out.println("🤖 [ROUTER] Chosen: " + chosenAlgorithm);

        SteganoStrategy strategy = factory.getStrategy(chosenAlgorithm);
        String messageWithHeader = strategy.getName() + "::" + message;

        System.out.println("✍️ [EMBED] Strategy: " + strategy.getName() + " | Header: " + strategy.getName() + "::");
        byte[] stegoBytes = strategy.embed(fileBytes, messageWithHeader);

        if (metrics.type() == MediaType.IMAGE) {
            System.out.println("📸 [CHECK QUALITY] Measuring PSNR...");
            double psnr = getPSNR(fileBytes, stegoBytes);
            if (psnr < QUALITY_THRESHOLD) {
                System.out.println("🔄 [FALLBACK] PSNR too low (" + psnr + "). Triggering fallback...");
                boolean isCompressed = fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg");
                String fallbackAlg = isCompressed ? "OutGuessStrategy" : "MatrixEmbeddingStrategy";
                if (!chosenAlgorithm.equals(fallbackAlg)) {
                    strategy = factory.getStrategy(fallbackAlg);
                    System.out.println("🔄 [FALLBACK] New Strategy: " + strategy.getName());
                    stegoBytes = strategy.embed(fileBytes, strategy.getName() + "::" + message);
                }
            }
        }
        return stegoBytes;
    }

    private FileMetrics createMetrics(String fileName, byte[] fileBytes, String message) {
        System.out.println("📊 [ANALYZER] Processing " + fileName + " (" + fileBytes.length + " bytes)");
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        MediaType type = MediaType.fromExtension(extension);

        MediaAnalyzer analyzer = allAnalyzers.stream()
                .filter(a -> a.getSupportedType() == type)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Media type not supported: " + extension));

        Map<String, Double> metricsMap = analyzer.analyze(fileBytes);

        // --- הוספה עבור אודיו: עדכון מדד הדחיסה ---
        if (type == MediaType.AUDIO) {
            boolean isCompressed = extension.equals("mp3") || extension.equals("aac");
            metricsMap.put("isCompressed", isCompressed ? 1.0 : 0.0);
            System.out.println("🎵 [AUDIO INFO] Extension: " + extension + " | isCompressed: " + isCompressed);
        }
        // ------------------------------------------

        System.out.println("📊 [ANALYZER] Analysis complete.");

        long totalPixels = metricsMap.getOrDefault("totalPixels", 0.0).longValue();
        return new FileMetrics(type, (long) fileBytes.length, totalPixels, message.length(), metricsMap);
    }
    private double getPSNR(byte[] original, byte[] stego) {
        try {
            BufferedImage img1 = ImageIO.read(new ByteArrayInputStream(original));
            BufferedImage img2 = ImageIO.read(new ByteArrayInputStream(stego));
            if (img1 == null || img2 == null) return 100.0;
            return QualityGuard.calculatePSNR(img1, img2);
        } catch (Exception e) { return 0.0; }
    }

    public String getChosenAlgorithmName(String fileName, byte[] fileBytes, String message) {
        FileMetrics metrics = createMetrics(fileName, fileBytes, message);
        return router.decideAlgorithm(metrics);
    }
}