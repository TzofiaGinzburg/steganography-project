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
            case AUDIO ->routeAudio(metrics);
            case VIDEO -> routeVideo(metrics);
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
    /**
     * ניתוב וידאו - מבוסס על טבלת הקריטריונים המקצועית
     */
    private String routeVideo(FileMetrics m) {
        double motion = m.getMetric("motionVariance");
        double fps = m.getMetric("fps");
        double bitrate = m.getMetric("bitrateMbps");

        // יחס קיבולת נדרש (כמה ביטים ביחס לסך הפיקסלים)
        double capacityRatio = (double) (m.messageLength() * 8) / m.totalPixels();

        System.out.println(String.format("🎬 [VIDEO ROUTER] Motion: %.2f | Payload: %.4f%%",
                motion, capacityRatio * 100));

        // שלב 1: בחירת האלגוריתם האידיאלי לפי הטבלה
        String ideal = "VideoMetadataStrategy";

        if (motion > 3.0) {
            ideal = "MotionVectorStrategy";
        } else if (bitrate > 50.0) {
            ideal = "VideoLSBStrategy";
        } else if (motion < 0.5) {
            ideal = "VideoDCTMappingStrategy";
        } else if (motion >= 0.5 && motion <= 3.0 && fps < 60) {
            ideal = "IntraPredictionStrategy";
        } else if (fps >= 60) {
            ideal = "FrameRateModStrategy";
        }

        // שלב 2: תיקון לפי קיבולת (כדי למנוע עיוות ויזואלי)
        return applyVideoCapacityGuard(ideal, capacityRatio);
    }

    private String applyVideoCapacityGuard(String ideal, double ratio) {
        // 1. Motion Vector רגיש מאוד - מעל 0.5% הוא מתחיל ליצור "קפיצות"
        if (ideal.equals("MotionVectorStrategy") && ratio > 0.005) {
            System.out.println("⚠️ [CAPACITY] Payload too high for Motion Vectors. Switching to Intra-prediction.");
            return "IntraPredictionStrategy";
        }

        // 2. DCT ו-Intra - מעל 2% מתחילים לראות "בלוקים" (Artifacts)
        if ((ideal.equals("VideoDCTMappingStrategy") || ideal.equals("IntraPredictionStrategy")) && ratio > 0.02) {
            System.out.println("⚠️ [CAPACITY] High Payload. Switching to LSB (YUV) for better visual quality.");
            return "VideoLSBStrategy";
        }

        // 3. אם הקיבולת מטורפת (מעל 10%) - נשתמש ב-Metadata כדי לא להרוס את התמונה
        if (ratio > 0.10) {
            System.out.println("🚨 [CAPACITY] Massive Payload. Forcing Metadata Strategy to avoid video corruption.");
            return "VideoMetadataStrategy";
        }

        return ideal;
    }
    private String routeAudio(FileMetrics m) {
        double snr = m.getMetric("snr");
        double activity = m.getMetric("spectralActivity"); // ZCR
        double rms = m.getMetric("rms");
        int msgBits = m.messageLength() * 8;
        long fileSize = m.fileSize();

        // הגדרת קיבולת לפי סוגי אלגוריתמים (לפי דגימות)
        long dsssCap = (fileSize - 44) / 2048;   // נמוכה מאוד (חסינות גבוהה)
        long frameCap = (fileSize - 44) / 512;    // בינונית (Phase/Echo)
        long parityCap = (fileSize - 44) / 256;   // גבוהה (Parity)
        long lsbCap = (fileSize - 44) / 2;        // מקסימלית (LSB)

        System.out.println(String.format("🤖 [ADAPTIVE ROUTER] SNR: %.2f | ZCR: %.2f | Needed: %d bits", snr, activity, msgBits));

        // --- שכבת החלטה א': בחירה אידיאלית לפי הטבלה ---
        String idealAlgo = "AudioParityStrategy"; // ברירת מחדל

        if (activity > 0.40) idealAlgo = "AudioDsssStrategy";
        else if (activity > 0.30 || snr < 40) idealAlgo = "AudioEchoStrategy";
        else if (activity < 0.05 && snr >= 40) idealAlgo = "AudioPhaseStrategy";
        else if (activity >= 0.10 && activity <= 0.30 && snr >= 35) idealAlgo = "MagnitudeSpectrumStrategy";
        else if (snr > 60 && rms > 0.15) idealAlgo = "AudioLSBStrategy";

        // --- שכבת החלטה ב': בדיקת התאמה וחיפוש חלופה (The Adaptive Logic) ---
        return selectBestFit(idealAlgo, msgBits, dsssCap, frameCap, parityCap, lsbCap, snr, activity);
    }

    private String selectBestFit(String ideal, int bits, long dsss, long frame, long parity, long lsb, double snr, double zcr) {

        // 1. אם האידיאלי הוא DSSS אבל אין מקום -> נסה לעבור ל-Echo (עמיד אבל עם יותר מקום)
        if (ideal.equals("AudioDsssStrategy") && bits > dsss) {
            System.out.println("⚠️ [CAPACITY] Message too long for DSSS. Checking Echo Hiding...");
            if (bits <= frame) return "AudioEchoStrategy";
        }

        // 2. אם האידיאלי הוא Phase/Magnitude אבל אין מקום -> נסה Parity (עדיין איכותי, פי 2 מקום)
        if ((ideal.equals("AudioPhaseStrategy") || ideal.equals("MagnitudeSpectrumStrategy")) && bits > frame) {
            System.out.println("⚠️ [CAPACITY] Message too long for Frequency-domain. Checking Parity...");
            if (bits <= parity) return "AudioParityStrategy";
        }

        // 3. אם האידיאלי הוא Parity אבל אין מקום -> מוצא אחרון LSB (רק אם ה-SNR מאפשר זאת)
        if (ideal.equals("AudioParityStrategy") && bits > parity) {
            if (bits <= lsb && snr > 45) {
                System.out.println("⚠️ [CAPACITY] High volume message. Falling back to LSB Strategy.");
                return "AudioLSBStrategy";
            }
        }

        // --- שכבת החלטה ג': אימות סופי לפני קריסה ---
        long finalCap = getCapForAlgo(ideal, dsss, frame, parity, lsb);
        if (bits > finalCap) {
            throw new RuntimeException("🚨 [FATAL] ההודעה ארוכה מדי עבור כל האלגוריתמים המתאימים לסוג הסאונד. הקטן את ההודעה ב-" + (bits - finalCap) + " ביטים.");
        }

        return ideal;
    }

    private long getCapForAlgo(String algo, long dsss, long frame, long parity, long lsb) {
        switch (algo) {
            case "AudioDsssStrategy": return dsss;
            case "AudioLSBStrategy": return lsb;
            case "AudioParityStrategy": return parity;
            default: return frame;
        }
    }}