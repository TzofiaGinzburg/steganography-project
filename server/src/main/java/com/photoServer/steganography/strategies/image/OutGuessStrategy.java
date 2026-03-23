package com.photoServer.steganography.strategies.image;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class OutGuessStrategy implements SteganoStrategy {

    private static final long SEED = 2026;

    @Override
    public String getName() { return "OutGuessStrategy"; }

    @Override
    public MediaType getSupportedType() { return MediaType.IMAGE; }

    @Override
    public int calculateSuitability(FileMetrics metrics) { return 95; }

    @Override
    public byte[] embed(byte[] fileBytes, String message) {
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(fileBytes));
            int width = image.getWidth();
            int height = image.getHeight();

            // הוספת תו מסיים להודעה
            byte[] msgBytes = (message + "\0").getBytes(StandardCharsets.UTF_8);

            BufferedImage stegoImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            stegoImage.getGraphics().drawImage(image, 0, 0, null);

            // יצירת סדר פיקסלים רנדומלי (חתימת OutGuess)
            Random rnd = new Random(SEED);
            List<int[]> coordinates = new ArrayList<>();
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    coordinates.add(new int[]{x, y});
                }
            }
            Collections.shuffle(coordinates, rnd);

            int coordIndex = 0;
            for (byte b : msgBytes) {
                // מעבר על כל ביט בבית (מה-MSB ל-LSB)
                for (int i = 7; i >= 0; i--) {
                    if (coordIndex >= coordinates.size()) break;

                    int bit = (b >> i) & 1;
                    int[] coord = coordinates.get(coordIndex++);

                    int rgb = stegoImage.getRGB(coord[0], coord[1]);
                    int r = (rgb >> 16) & 0xFF;
                    int g = (rgb >> 8) & 0xFF;
                    int bl = rgb & 0xFF;

                    // הטמעת הביט ב-LSB של ערוץ האדום
                    r = (r & 0xFE) | bit;

                    int newRgb = (r << 16) | (g << 8) | bl;
                    stegoImage.setRGB(coord[0], coord[1], newRgb);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            // משתמשים ב-PNG כדי למנוע איבוד מידע של דחיסת JPEG בטסטים
            ImageIO.write(stegoImage, "png", baos);
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Embedding failed", e);
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(stegoData));
            int width = image.getWidth();
            int height = image.getHeight();

            Random rnd = new Random(SEED);
            List<int[]> coordinates = new ArrayList<>();
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    coordinates.add(new int[]{x, y});
                }
            }
            Collections.shuffle(coordinates, rnd);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int currentByte = 0;
            int bitCount = 0;

            for (int[] coord : coordinates) {
                int rgb = image.getRGB(coord[0], coord[1]);
                int r = (rgb >> 16) & 0xFF;
                int bit = r & 1;

                // בונים את הבית ביט אחרי ביט
                currentByte = (currentByte << 1) | bit;
                bitCount++;

                if (bitCount == 8) {
                    if (currentByte == 0) break; // הגענו לתו ה-NULL, עוצרים.
                    baos.write((byte) currentByte);
                    currentByte = 0;
                    bitCount = 0;
                }

                if (baos.size() > 1000) break; // הגנה
            }

            return baos.toString(StandardCharsets.UTF_8);

        } catch (Exception e) {
            return "Extraction failed";
        }
    }
}