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
public class PvdImage extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int[][] RANGE_TABLE = {
            {  0,   7, 3 },
            {  8,  15, 3 },
            { 16,  31, 4 },
            { 32,  63, 5 },
            { 64, 255, 6 }
    };

    // טרמינטור כפול (שני בייטים של אפס) לסיום בטוח של המחרוזת
    private static final byte[] TERMINATOR = { 0x00, 0x00 };

    @Override
    public String getName() { return "PvdImage"; }

    @Override
    public MediaType getSupportedType() { return MediaType.IMAGE; }

    @Override
    public int calculateSuitability(FileMetrics metrics) { return 100; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            BufferedImage src = ImageIO.read(new ByteArrayInputStream(coverData));
            BufferedImage img = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_INT_RGB);
            img.getGraphics().drawImage(src, 0, 0, null);

            String bitStream = toBitString(buildPayload(secretMessage));
            int bitIdx = 0;

            for (int y = 0; y < img.getHeight() && bitIdx < bitStream.length(); y++) {
                for (int x = 0; x < img.getWidth() - 1 && bitIdx < bitStream.length(); x += 2) {

                    int rgb1 = img.getRGB(x, y);
                    int rgb2 = img.getRGB(x + 1, y);

                    int p1 = rgb1 & 0xFF;
                    int p2 = rgb2 & 0xFF;

                    int d = Math.abs(p1 - p2);
                    int[] ri = rangeInfo(d);
                    int n = ri[2];
                    int l_k = ri[0];

                    int end = Math.min(bitIdx + n, bitStream.length());
                    String chunk = bitStream.substring(bitIdx, end);
                    while (chunk.length() < n) chunk += "0";

                    int b_val = Integer.parseInt(chunk, 2);
                    bitIdx += n;

                    int d_new = l_k + b_val;

                    // התיקון כאן: במקום לחלק חצי-חצי, נשנה פיקסל אחד בצורה דומיננטית
                    // זה מונע טעויות עיגול של Java
                    int diff_needed = d_new - d;
                    int p1n, p2n;

                    if (p1 >= p2) {
                        p1n = clamp(p1 + diff_needed);
                        p2n = p2; // משאירים את השני כמו שהוא כדי לא לסבך את החישוב
                    } else {
                        p1n = clamp(p1 - diff_needed);
                        p2n = p2;
                    }

                    // וידוא שההפרש החדש הוא באמת d_new
                    // אם ה-clamp הרס את זה, נתקן את p2
                    int current_d = Math.abs(p1n - p2n);
                    if (current_d != d_new) {
                        if (p1n >= p2n) p2n = clamp(p1n - d_new);
                        else p2n = clamp(p1n + d_new);
                    }

                    img.setRGB(x, y, (rgb1 & 0xFFFF00) | (p1n & 0xFF));
                    img.setRGB(x + 1, y, (rgb2 & 0xFFFF00) | (p2n & 0xFF));
                }
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) { return coverData; }
    }
    @Override
    public String extract(byte[] stegoData) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(stegoData));
            StringBuilder bits = new StringBuilder();
            ByteArrayOutputStream raw = new ByteArrayOutputStream();

            for (int y = 0; y < img.getHeight(); y++) {
                for (int x = 0; x < img.getWidth() - 1; x += 2) {
                    int p1 = img.getRGB(x, y) & 0xFF;
                    int p2 = img.getRGB(x + 1, y) & 0xFF;

                    int d = Math.abs(p1 - p2);
                    int[] ri = rangeInfo(d);
                    int n = ri[2];
                    int l_k = ri[0];

                    int b_val = d - l_k;
                    if (b_val < 0) b_val = 0;

                    String chunk = String.format("%" + n + "s", Integer.toBinaryString(b_val)).replace(' ', '0');
                    bits.append(chunk);

                    while (bits.length() >= 8) {
                        int byteVal = Integer.parseInt(bits.substring(0, 8), 2);
                        raw.write(byteVal);
                        bits.delete(0, 8);

                        byte[] currentArray = raw.toByteArray();
                        if (currentArray.length >= 2 && currentArray[currentArray.length-2] == 0 && currentArray[currentArray.length-1] == 0) {
                            return new String(currentArray, 0, currentArray.length - 2, StandardCharsets.UTF_8);
                        }
                    }
                }
            }
            return new String(raw.toByteArray(), StandardCharsets.UTF_8);
        } catch (Exception e) { return ""; }
    }
    private byte[] buildPayload(String msg) {
        byte[] msgBytes = msg.getBytes(StandardCharsets.UTF_8);
        byte[] payload = new byte[msgBytes.length + TERMINATOR.length];
        System.arraycopy(msgBytes, 0, payload, 0, msgBytes.length);
        System.arraycopy(TERMINATOR, 0, payload, msgBytes.length, TERMINATOR.length);
        return payload;
    }

    private String toBitString(byte[] data) {
        StringBuilder sb = new StringBuilder();
        for (byte b : data) sb.append(String.format("%8s", Integer.toBinaryString(b & 0xFF)).replace(' ', '0'));
        return sb.toString();
    }

    private int[] rangeInfo(int diff) {
        for (int[] row : RANGE_TABLE) if (diff <= row[1]) return row;
        return RANGE_TABLE[RANGE_TABLE.length - 1];
    }

    private int clamp(int v) { return Math.max(0, Math.min(255, v)); }

    private int getChannel(int rgb, int ch) { return (rgb >> (16 - ch * 8)) & 0xFF; }

    private int setChannel(int rgb, int ch, int val) {
        int shift = 16 - ch * 8;
        return (rgb & ~(0xFF << shift)) | ((val & 0xFF) << shift);
    }

    private BufferedImage toRGB(BufferedImage src) {
        BufferedImage dst = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_INT_RGB);
        dst.getGraphics().drawImage(src, 0, 0, null);
        return dst;
    }
}