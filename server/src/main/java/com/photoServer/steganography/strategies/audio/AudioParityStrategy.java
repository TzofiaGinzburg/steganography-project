package com.photoServer.steganography.strategies.audio;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

@Component
public class AudioParityStrategy  extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int HEADER_SIZE = 44;
    private static final int BLOCK_SIZE = 8; // כל 8 דגימות מחביאות ביט אחד
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "Audio-Parity"; }
    @Override
    public MediaType getSupportedType() { return MediaType.AUDIO; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        byte[] messageBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
        boolean[] bits = toBitArray(messageBytes);

        int totalSamples = (coverData.length - HEADER_SIZE) / 2;
        int availableBlocks = totalSamples / BLOCK_SIZE;

        // --- התיקון הקריטי כאן ---
        if (bits.length > availableBlocks) {
            System.err.println("❌ הודעה ארוכה מדי! נדרשים " + bits.length + " בלוקים אך יש רק " + availableBlocks);
            return coverData; // מחזירים את המקור בלי לגעת בו
        }
        // ------------------------

        byte[] stegoData = coverData.clone();
        for (int i = 0; i < bits.length; i++) {
            int blockStart = HEADER_SIZE + (i * BLOCK_SIZE * 2);
            int currentParity = calculateBlockParity(stegoData, blockStart);
            int targetParity = bits[i] ? 1 : 0;

            if (currentParity != targetParity) {
                short sample = ByteBuffer.wrap(stegoData, blockStart, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
                sample = (short) (sample + (sample == Short.MAX_VALUE ? -1 : 1));
                ByteBuffer.wrap(stegoData, blockStart, 2).order(ByteOrder.LITTLE_ENDIAN).putShort(sample);
            }
        }
        return stegoData;
    }

    @Override
    public String extract(byte[] stegoData) {
        int totalSamples = (stegoData.length - HEADER_SIZE) / 2;
        int totalBlocks = totalSamples / BLOCK_SIZE;
        StringBuilder bitStream = new StringBuilder();

        for (int i = 0; i < totalBlocks; i++) {
            int blockStart = HEADER_SIZE + (i * BLOCK_SIZE * 2);
            int parity = calculateBlockParity(stegoData, blockStart);
            bitStream.append(parity);

            if (bitStream.length() >= 8 && bitStream.length() % 8 == 0) {
                String currentText = bitsToText(bitStream.toString());
                if (currentText.contains(MARKER)) {
                    return currentText.split(MARKER)[0];
                }
            }
        }
        return "Marker not found";
    }

    private int calculateBlockParity(byte[] data, int start) {
        long sum = 0;
        for (int j = 0; j < BLOCK_SIZE; j++) {
            sum += ByteBuffer.wrap(data, start + (j * 2), 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
        }
        return (int) (Math.abs(sum) % 2);
    }

    private boolean[] toBitArray(byte[] data) {
        boolean[] bits = new boolean[data.length * 8];
        for (int i = 0; i < data.length; i++)
            for (int j = 0; j < 8; j++) bits[i * 8 + j] = ((data[i] >> (7 - j)) & 1) == 1;
        return bits;
    }

    private String bitsToText(String bits) {
        try {
            byte[] bytes = new byte[bits.length() / 8];
            for (int i = 0; i < bytes.length; i++)
                bytes[i] = (byte) Integer.parseInt(bits.substring(i * 8, i * 8 + 8), 2);
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) { return ""; }
    }

    @Override
    public int calculateSuitability(FileMetrics metrics) { return 80; }
}