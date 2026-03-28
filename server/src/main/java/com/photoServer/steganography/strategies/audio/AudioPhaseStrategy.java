package com.photoServer.steganography.strategies.audio;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.jtransforms.fft.DoubleFFT_1D;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Component
public class AudioPhaseStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int HEADER_SIZE = 44;
    private static final int FRAME_SIZE = 512;
    private static final int[] TARGET_BINS = {10, 30, 50}; // 3 ביטים לכל פריים
    private static final String MARKER = "##END##";
    private static final String ALGO_IDENTIFIER = "AudioPhaseStrategy::";

    @Override public String getName() { return "AudioPhaseStrategy"; }
    @Override public MediaType getSupportedType() { return MediaType.AUDIO; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        // בונים את ההודעה המלאה שכוללת זיהוי אלגוריתם
        String fullPayload = ALGO_IDENTIFIER + secretMessage + MARKER;
        byte[] payloadBytes = fullPayload.getBytes(StandardCharsets.UTF_8);
        boolean[] bits = toBitArray(payloadBytes);

        double[] samples = bytesToDoubles(coverData);
        int startFrame = 2; // צמצום המרווח כדי להרוויח מקום
        int numFrames = (samples.length / FRAME_SIZE) - startFrame - 1;
        int totalCapacity = numFrames * TARGET_BINS.length;

        System.out.println("📊 [CAPACITY] נדרש: " + bits.length + " | זמין: " + totalCapacity);

        if (bits.length > totalCapacity) {
            throw new RuntimeException("Capacity exceeded. Need " + bits.length + " bits but only have " + totalCapacity);
        }

        DoubleFFT_1D fft = new DoubleFFT_1D(FRAME_SIZE);
        int bitIdx = 0;

        for (int i = 0; i < numFrames && bitIdx < bits.length; i++) {
            double[] fftData = new double[FRAME_SIZE];
            System.arraycopy(samples, (i + startFrame) * FRAME_SIZE, fftData, 0, FRAME_SIZE);
            fft.realForward(fftData);

            for (int bin : TARGET_BINS) {
                if (bitIdx < bits.length) {
                    bitIdx = embedBit(fftData, bin, bits, bitIdx);
                }
            }

            fft.realInverse(fftData, true);
            System.arraycopy(fftData, 0, samples, (i + startFrame) * FRAME_SIZE, FRAME_SIZE);
        }
        return doublesToBytes(samples, coverData);
    }

    @Override
    public String extract(byte[] stegoData) {
        double[] samples = bytesToDoubles(stegoData);
        DoubleFFT_1D fft = new DoubleFFT_1D(FRAME_SIZE);
        StringBuilder bitStream = new StringBuilder();
        int startFrame = 2;
        int numFrames = (samples.length / FRAME_SIZE) - startFrame - 1;

        for (int i = 0; i < numFrames; i++) {
            double[] fftData = new double[FRAME_SIZE];
            System.arraycopy(samples, (i + startFrame) * FRAME_SIZE, fftData, 0, FRAME_SIZE);
            fft.realForward(fftData);

            for (int bin : TARGET_BINS) {
                bitStream.append(extractBit(fftData, bin));
            }

            if (bitStream.length() >= 8 && bitStream.length() % 8 == 0) {
                byte[] bytes = bitsToByteArray(bitStream.toString());
                String decoded = new String(bytes, StandardCharsets.UTF_8);
                if (decoded.contains(MARKER)) {
                    if (decoded.contains(ALGO_IDENTIFIER)) {
                        String finalMessage = decoded.substring(decoded.indexOf(ALGO_IDENTIFIER) + ALGO_IDENTIFIER.length()).split(MARKER)[0];

                        // --- הדפסת ההודעה שפוענחה ---
                        System.out.println("🔓 [EXTRACT] ההודעה שפוענחה מהקובץ: \"" + finalMessage + "\"");

                        return finalMessage;
                    }
                }
            }
        }
        return null;
    }

    private int embedBit(double[] fftData, int bin, boolean[] bits, int idx) {
        int k = bin * 2;
        double mag = Math.max(0.1, Math.sqrt(fftData[k]*fftData[k] + fftData[k+1]*fftData[k+1]));
        double phase = bits[idx] ? 0 : Math.PI;
        fftData[k] = mag * Math.cos(phase);
        fftData[k+1] = mag * Math.sin(phase);
        return idx + 1;
    }

    private String extractBit(double[] fftData, int bin) {
        int k = bin * 2;
        double phase = Math.atan2(fftData[k+1], fftData[k]);
        return Math.abs(phase) < Math.PI / 2 ? "1" : "0";
    }

    // --- Helpers ---
    private boolean[] toBitArray(byte[] data) {
        boolean[] bits = new boolean[data.length * 8];
        for (int i = 0; i < data.length; i++)
            for (int j = 0; j < 8; j++) bits[i * 8 + j] = ((data[i] >> (7 - j)) & 1) == 1;
        return bits;
    }

    private byte[] bitsToByteArray(String bitStr) {
        byte[] bytes = new byte[bitStr.length() / 8];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = (byte) Integer.parseInt(bitStr.substring(i * 8, i * 8 + 8), 2);
        }
        return bytes;
    }

    private double[] bytesToDoubles(byte[] data) {
        int sampleCount = (data.length - HEADER_SIZE) / 2;
        double[] out = new double[sampleCount];
        ByteBuffer buffer = ByteBuffer.wrap(data).order(ByteOrder.LITTLE_ENDIAN);
        for (int i = 0; i < sampleCount; i++) {
            out[i] = buffer.getShort(HEADER_SIZE + i * 2) / 32768.0;
        }
        return out;
    }

    private byte[] doublesToBytes(double[] doubles, byte[] original) {
        byte[] res = Arrays.copyOf(original, original.length);
        ByteBuffer buf = ByteBuffer.wrap(res).order(ByteOrder.LITTLE_ENDIAN);
        for (int i = 0; i < doubles.length; i++) {
            short val = (short) (Math.max(-1, Math.min(1, doubles[i])) * 32767);
            buf.putShort(HEADER_SIZE + i * 2, val);
        }
        return res;
    }

    @Override public int calculateSuitability(FileMetrics metrics) { return 100; }
}