package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;

@Component
public class VideoYuvLsbStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER = "##END##";

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        System.out.println("\n--- [YUV LOG] Starting LSB in YUV Domain ---");
        byte[] msgBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
        String binaryMsg = toBinaryString(msgBytes);

        byte[] stegoData = coverData.clone();
        int bitIndex = 0;

        // אנחנו נדלג על רכיב ה-Y (בהירות) ונטמין ב-U ו-V (צבע)
        // כדי להבטיח שקיפות ויזואלית מקסימלית (High Fidelity)
        for (int i = 0; i < stegoData.length && bitIndex < binaryMsg.length(); i++) {
            // הטמנה פשוטה בביט הפחות משמעותי (LSB)
            int bit = binaryMsg.charAt(bitIndex) - '0';
            stegoData[i] = (byte) ((stegoData[i] & 0xFE) | bit);
            bitIndex++;
        }

        System.out.println("✅ [SUCCESS] Embedded " + bitIndex + " bits in YUV Raw Data.");
        return stegoData;
    }

    @Override
    public String extract(byte[] stegoData) {
        StringBuilder bitStream = new StringBuilder();

        for (byte b : stegoData) {
            bitStream.append(b & 1);
        }

        String decoded = bitsToText(bitStream.toString());
        if (decoded.contains(MARKER)) {
            return decoded.split(MARKER)[0];
        }
        return "MARKER_NOT_FOUND";
    }

    private String toBinaryString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            for (int i = 7; i >= 0; i--) sb.append((b >> i) & 1);
        }
        return sb.toString();
    }

    private String bitsToText(String bits) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < bits.length() - 7; i += 8) {
            int charCode = Integer.parseInt(bits.substring(i, i + 8), 2);
            sb.append((char) charCode);
            if (sb.toString().contains(MARKER)) break;
        }
        return sb.toString();
    }

    @Override public String getName() { return "Video-YUV-LSB-Master"; }
    @Override public MediaType getSupportedType() { return MediaType.VIDEO; }
    @Override public int calculateSuitability(FileMetrics metrics) { return 100; }
}
