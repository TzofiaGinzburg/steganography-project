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
import java.io.File;
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

        FileMetrics metrics = createMetrics(fileName, coverBytes, message);
        String chosenAlgorithm = router.decideAlgorithm(metrics);
        SteganoStrategy strategy = factory.getStrategy(chosenAlgorithm);

        String header = strategy.getName() + "::";
        System.out.println("✍️ [EMBED] Using Header: " + header);

        long startTime = System.currentTimeMillis();
        byte[] stegoBytes = strategy.embed(coverBytes, header + message);
        long endTime = System.currentTimeMillis();

        Map<String, Object> results = new HashMap<>();
        results.put("bytes", stegoBytes);
        results.put("chosenAlgorithm", chosenAlgorithm);
        results.put("time", (endTime - startTime) / 1000.0);
        results.put("entropy", metrics.getMetric("entropy"));
        results.put("bpp", (double)(message.length() * 8) / coverBytes.length);

        // --- לוגיקת מדדים מופרדת ---
        if (metrics.type() == MediaType.AUDIO) {
            results.put("snr", metrics.getMetric("snr"));
            results.put("rms", metrics.getMetric("rms"));
            results.put("psnr", 0.0);
        } else if (metrics.type() == MediaType.VIDEO) {
            // מדדי וידאו (Motion Vectors / Bitrate)
            results.put("motion", metrics.getMetric("motion"));
            results.put("bitrate", metrics.getMetric("bitrate"));
            results.put("psnr", 0.0); // וידאו לא משתמש ב-PSNR של תמונה בודדת כרגע
        } else {
            // תמונה
            results.put("psnr", getPSNR(coverBytes, stegoBytes));
            Double edges = metrics.getMetric("edgeDensity");
            results.put("edgeDensity", edges != null ? edges : 0.0);
        }

        System.out.println("✅ [HIDE DONE] Process finished for " + metrics.type());
        return results;
    }

    public String extractMessage(String fileName, byte[] stegoData) {
        try {
            String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            MediaType type = MediaType.fromExtension(extension);

            if (type == MediaType.AUDIO) {
                // --- לוגיקת אודיו (נשארת בדיוק כפי שהייתה) ---
                System.out.println("🔍 [STEP 1] Extracting algorithm name from header...");
                String algoName = null;
                String messagePart = null;

                for (SteganoStrategy strategy : allStrategies) {
                    if (strategy.getSupportedType() == MediaType.AUDIO) {
                        String raw = strategy.extract(stegoData);
                        if (raw != null && raw.contains("::")) {
                            String[] parts = raw.split("::", 2);
                            algoName = parts[0];
                            messagePart = parts[1];
                            break;
                        }
                    }
                }
                if (algoName == null) return "ERROR::MARKER_NOT_FOUND";
                return messagePart;

            } else if (type == MediaType.VIDEO) {
                // --- לוגיקת וידאו (התוספת החדשה בלבד) ---
                System.out.println("🎬 [VIDEO] Extracting from video file...");
                for (SteganoStrategy strategy : allStrategies) {
                    if (strategy.getSupportedType() == MediaType.VIDEO) {
                        try {
                            String raw = strategy.extract(stegoData);
                            if (raw != null && raw.contains("::")) {
                                return raw.split("::", 2)[1];
                            }
                        } catch (Exception e) {
                            // דילוג על אסטרטגיה שלא מתאימה לקובץ
                        }
                    }
                }
            } else {
                // --- לוגיקת תמונות (נשארת בדיוק כפי שהייתה) ---
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
        FileMetrics metrics = createMetrics(fileName, fileBytes, message);
        String chosenAlgorithm = router.decideAlgorithm(metrics);
        SteganoStrategy strategy = factory.getStrategy(chosenAlgorithm);

        String messageWithHeader = strategy.getName() + "::" + message;
        byte[] stegoBytes = strategy.embed(fileBytes, messageWithHeader);

        // בדיקת איכות רק לתמונות (מונע קריסה בוידאו/אודיו)
        if (metrics.type() == MediaType.IMAGE) {
            double psnr = getPSNR(fileBytes, stegoBytes);
            if (psnr < QUALITY_THRESHOLD) {
                // Fallback logic...
            }
        }
        return stegoBytes;
    }

    private FileMetrics createMetrics(String fileName, byte[] fileBytes, String message) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        MediaType type = MediaType.fromExtension(extension);

        MediaAnalyzer analyzer = allAnalyzers.stream()
                .filter(a -> a.getSupportedType() == type)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Media type not supported: " + extension));

        Map<String, Double> metricsMap = analyzer.analyze(fileBytes);

        if (type == MediaType.AUDIO || type == MediaType.VIDEO) {
            boolean isCompressed = extension.equals("mp3") || extension.equals("mp4");
            metricsMap.put("isCompressed", isCompressed ? 1.0 : 0.0);
        }

        long totalPixels = metricsMap.getOrDefault("totalPixels", 0.0).longValue();
        return new FileMetrics(type, (long) fileBytes.length, totalPixels, message.length(), metricsMap);
    }

    private double getPSNR(byte[] original, byte[] stego) {
        try {
            // מונע את ה-NullPointerException על ידי בדיקת פורמט לפני הקריאה
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