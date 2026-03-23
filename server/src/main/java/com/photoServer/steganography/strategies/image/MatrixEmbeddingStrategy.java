package com.photoServer.steganography.strategies.image;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;

@Component
public class MatrixEmbeddingStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    // Hamming(7,4) מאפשר להחביא 3 ביטים ב-7 פיקסלים עם שינוי אחד לכל היותר
    private static final int BLOCK_SIZE = 7;
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "MatrixEmbeddingStrategy"; }

    @Override
    public MediaType getSupportedType() { return MediaType.IMAGE; }

    @Override
    public int calculateSuitability(FileMetrics metrics) {
        // הכי מתאים לתמונות PNG/BMP עם אנטרופיה גבוהה וצורך בקיבולת
        double entropy = metrics.getMetric("entropy");
        return (entropy > 0.6) ? 100 : 70;
    }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(coverData));
            int w = img.getWidth(), h = img.getHeight();

            boolean[] bits = toBitArray((secretMessage + MARKER).getBytes(StandardCharsets.UTF_8));
            int bitIdx = 0;
            int pixelIdx = 0;

            // שינוי התנאי: רצים כל עוד יש לפחות ביט אחד להחביא
            while (bitIdx < bits.length && pixelIdx + BLOCK_SIZE < w * h) {
                int[] pixels = new int[BLOCK_SIZE];
                int currentXor = 0;

                for (int i = 0; i < BLOCK_SIZE; i++) {
                    int x = (pixelIdx + i) % w;
                    int y = (pixelIdx + i) / w;
                    pixels[i] = img.getRGB(x, y);
                    if ((pixels[i] & 1) == 1) {
                        currentXor ^= (i + 1);
                    }
                }

                // בניית ה-Target בזהירות: אם אין עוד ביטים, נשתמש ב-0 (או בביט הקיים בסינדרום כדי לא לשנות)
                int target = 0;
                for (int i = 0; i < 3; i++) {
                    if (bitIdx + i < bits.length) {
                        target |= (bits[bitIdx + i] ? 1 : 0) << i;
                    } else {
                        // אם נגמרו הביטים באמצע בלוק, שומרים על מה שיש בסינדרום כדי לא לבצע שינוי מיותר
                        target |= (currentXor & (1 << i));
                    }
                }

                int changeIdx = currentXor ^ target;
                if (changeIdx > 0) {
                    int i = changeIdx - 1;
                    int x = (pixelIdx + i) % w;
                    int y = (pixelIdx + i) / w;
                    img.setRGB(x, y, pixels[i] ^ 1);
                }

                bitIdx += 3; // תמיד קופצים ב-3 כי הבלוק מעובד כיחידה אחת
                pixelIdx += BLOCK_SIZE;
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos); // חייב PNG כדי לשמור על ה-LSB
            return baos.toByteArray();
        } catch (Exception e) { return coverData; }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(stegoData));
            int w = img.getWidth(), h = img.getHeight();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            int pixelIdx = 0;
            int bitBuffer = 0;
            int bitsInBuffered = 0;
            byte[] markerBytes = MARKER.getBytes(StandardCharsets.UTF_8);

            // לולאה שעוברת בלוקים של 7 פיקסלים (BLOCK_SIZE)
            outerLoop:
            while (pixelIdx + BLOCK_SIZE <= w * h) {
                int syndrome = 0;
                // חישוב הסינדרום של הבלוק הנוכחי
                for (int i = 0; i < BLOCK_SIZE; i++) {
                    int x = (pixelIdx + i) % w;
                    int y = (pixelIdx + i) / w;
                    // קריאת ה-LSB של הערוץ הכחול (או ה-RGB המשולב)
                    if ((img.getRGB(x, y) & 1) == 1) {
                        syndrome ^= (i + 1);
                    }
                }

                // חילוץ 3 ביטים מכל סינדרום (כי 2^3 = 8, ובלוק הוא 7)
                for (int i = 0; i < 3; i++) {
                    int bit = (syndrome >> i) & 1;
                    bitBuffer |= (bit << bitsInBuffered);
                    bitsInBuffered++;

                    if (bitsInBuffered == 8) {
                        baos.write(bitBuffer);

                        // בדיקה האם הגענו למרקר
                        byte[] currentBytes = baos.toByteArray();
                        if (endsWith(currentBytes, markerBytes)) {
                            break outerLoop;
                        }

                        bitBuffer = 0;
                        bitsInBuffered = 0;
                    }
                }
                pixelIdx += BLOCK_SIZE; // קפיצה לבלוק הבא
            }

            String decoded = new String(baos.toByteArray(), StandardCharsets.UTF_8);
            return decoded.contains(MARKER) ? decoded.split(MARKER)[0] : "Marker not found / Corrupted data";

        } catch (Exception e) {
            return "Extraction Error: " + e.getMessage();
        }
    }

    private boolean endsWith(byte[] data, byte[] suffix) {
        if (data.length < suffix.length) return false;
        for (int i = 0; i < suffix.length; i++) {
            if (data[data.length - suffix.length + i] != suffix[i]) return false;
        }
        return true;
    }
    // וודא שזה ה-toBitArray שלך (חשוב לסנכרון)
    private boolean[] toBitArray(byte[] data) {
        boolean[] bits = new boolean[data.length * 8];
        for (int i = 0; i < data.length; i++) {
            for (int j = 0; j < 8; j++) {
                bits[i * 8 + j] = ((data[i] >> j) & 1) == 1;
            }
        }
        return bits;
    }
}