package com.photoServer.steganography.factory;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import org.springframework.stereotype.Component;


@Component
public class SteganoRouter {

    public String decideAlgorithm(FileMetrics metrics) {
        if (metrics.type() == null) return "LsbImage";

        return switch (metrics.type()) {
            case IMAGE -> routeImage(metrics);
            case AUDIO -> "LsbAudioStrategy";
            default -> "LsbImage";
        };
    }

    private String routeImage(FileMetrics m) {
        double edgeDensity = m.getMetric("edgeDensity");
        double entropy = m.getMetric("entropy");
        boolean isCompressed = m.getMetric("isCompressed") > 0;
        double capacityRatio = (double) (m.messageLength() * 8) / m.totalPixels();

        System.out.println(String.format("📊 [ROUTER ANALYZER] Payload: %.2f%% | Edges: %.4f | Entropy: %.4f",
                capacityRatio * 100, edgeDensity, entropy));

        if (isCompressed) {
            // תיקון קריטי: אם התמונה חלקה מדי (כמו שלך), OutGuess יכשל.
            // נכריח מעבר ל-J-UNIWARD או נודיע על שגיאה.
            if (entropy < 0.20) {
                System.out.println("⚠️ [ROUTER] Entropy too low (" + entropy + ") for OutGuess. Forcing J-UNIWARD.");
                return "JUniwardStrategy";
            }

            // ניתוב רגיל ל-JPEG
            if (entropy > 0.65 || edgeDensity > 0.10 || capacityRatio > 0.05) {
                System.out.println("🖼️ [ROUTER] High Complexity/Payload -> J-UNIWARD");
                return "JUniwardStrategy";
            }

            System.out.println("📉 [ROUTER] Standard JPG -> OutGuess");
            return "OutGuessStrategy";
        }
        // --- ניתוב עבור PNG (Lossless) ---

        // שינוי קטן בערכים כדי שיתאימו בול לטבלה שלך:

        if (capacityRatio > 0.15 || edgeDensity > 0.12) { // תיקון מ-0.15 ל-0.12
            return "PvdImage";
        }

        if (entropy > 0.50 || edgeDensity > 0.08) { // תיקון מ-0.60 ל-0.50
            return "MatrixEmbeddingStrategy";
        }

        if (entropy < 0.45) { // תיקון מ-0.40 ל-0.45
            return "SpreadSpectrumImage";
        }

        // 4. Patchwork: ברירת מחדל למקרים של עמידות גבוהה
        System.out.println("🧩 [ROUTER] Standard Mode -> Using Patchwork");
        return "PatchworkStrategy";
    }
}