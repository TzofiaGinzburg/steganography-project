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
public class AudioEchoStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int HEADER_SIZE = 44;
    private static final int FRAME_SIZE = 2048;
    private static final int D0 = 45;
    private static final int D1 = 95;
    private static final double ALPHA = 0.7;
    private static final double ENERGY_THRESHOLD = 0.005;
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "AudioEchoStrategy"; }
    @Override
    public MediaType getSupportedType() { return MediaType.AUDIO; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        byte[] messageBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
        boolean[] bits = toBitArray(messageBytes);
        double[] samples = bytesToDoubles(coverData);

        // --- בדיקת קיבולת חדשה ---
        int availableFrames = 0;
        for (int i = 0; i < samples.length - FRAME_SIZE; i += FRAME_SIZE) {
            if (calculateFrameEnergy(samples, i) >= ENERGY_THRESHOLD) {
                availableFrames++;
            }
        }

        if (bits.length > availableFrames) {
            throw new IllegalArgumentException("Message too long! File can hold " +
                    (availableFrames / 8) + " characters, but message requires " + (bits.length / 8));
        }
        // -----------------------

        double[] stego = samples.clone();
        int bitIndex = 0;
        for (int i = 0; i < samples.length - FRAME_SIZE && bitIndex < bits.length; i += FRAME_SIZE) {
            if (calculateFrameEnergy(samples, i) < ENERGY_THRESHOLD) continue;

            int delay = bits[bitIndex] ? D1 : D0;

            for (int j = delay; j < FRAME_SIZE; j++) {
                double echo = ALPHA * samples[i + j - delay];
                stego[i + j] += bits[bitIndex] ? echo : -echo;
            }
            bitIndex++;
        }
        return doublesToBytes(stego, coverData);
    }

    @Override
    public String extract(byte[] stegoData) {
        double[] samples = bytesToDoubles(stegoData);
        StringBuilder bitStream = new StringBuilder();

        for (int i = 0; i < samples.length - FRAME_SIZE; i += FRAME_SIZE) {
            if (calculateFrameEnergy(samples, i) < ENERGY_THRESHOLD) continue;

            double diff0 = calculateAutoCorr(samples, i, D0);
            double diff1 = calculateAutoCorr(samples, i, D1);

            bitStream.append(diff1 > diff0 ? "1" : "0");

            if (bitStream.length() % 8 == 0) {
                String text = bitsToText(bitStream.toString());
                if (text.contains(MARKER)) return text.split(MARKER)[0];
            }
        }
        return "Marker not found";
    }

    private double calculateAutoCorr(double[] s, int offset, int d) {
        double sum = 0;
        for (int i = d; i < FRAME_SIZE; i++) {
            sum += s[offset + i] * s[offset + i - d];
        }
        return Math.abs(sum);
    }

    private double calculateFrameEnergy(double[] samples, int offset) {
        double sum = 0;
        for (int i = 0; i < FRAME_SIZE; i++) {
            sum += Math.abs(samples[offset + i]);
        }
        return sum / FRAME_SIZE;
    }

    // --- Helpers ---
    private double[] bytesToDoubles(byte[] data) {
        int len = (data.length - HEADER_SIZE) / 2;
        double[] doubles = new double[len];
        for (int i = 0; i < len; i++) {
            doubles[i] = ByteBuffer.wrap(data, HEADER_SIZE + i * 2, 2)
                    .order(ByteOrder.LITTLE_ENDIAN).getShort() / 32768.0;
        }
        return doubles;
    }

    private byte[] doublesToBytes(double[] doubles, byte[] original) {
        byte[] result = original.clone();
        for (int i = 0; i < doubles.length; i++) {
            short val = (short) (Math.max(-1.0, Math.min(1.0, doubles[i])) * 32767);
            ByteBuffer.wrap(result, HEADER_SIZE + i * 2, 2)
                    .order(ByteOrder.LITTLE_ENDIAN).putShort(val);
        }
        return result;
    }

    private boolean[] toBitArray(byte[] data) {
        boolean[] bits = new boolean[data.length * 8];
        for (int i = 0; i < data.length; i++)
            for (int j = 0; j < 8; j++) bits[i * 8 + j] = ((data[i] >> (7 - j)) & 1) == 1;
        return bits;
    }

    protected String bitsToText(String bits) {
        try {
            byte[] bytes = new byte[bits.length() / 8];
            for (int i = 0; i < bytes.length; i++)
                bytes[i] = (byte) Integer.parseInt(bits.substring(i * 8, i * 8 + 8), 2);
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) { return ""; }
    }

    @Override
    public int calculateSuitability(FileMetrics metrics) { return 95; }
}