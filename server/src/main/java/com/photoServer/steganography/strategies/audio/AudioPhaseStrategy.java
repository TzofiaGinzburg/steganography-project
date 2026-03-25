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

@Component
public class AudioPhaseStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int HEADER_SIZE = 44;
    private static final int FRAME_SIZE = 4096;
    private static final int START_FREQ = 10;
    private static final int END_FREQ = 30; // חייב להיות זהה ב-Embed ו-Extract
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "AudioPhaseStrategy"; }
    @Override
    public MediaType getSupportedType() {
        return MediaType.AUDIO; // או IMAGE, לפי העניין
    }
    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        byte[] messageBytes = secretMessage.getBytes(StandardCharsets.UTF_8);
        byte[] markerBytes = MARKER.getBytes(StandardCharsets.UTF_8);

        // בניית המבנה: [אורך (4 בייטים)] + [הודעה] + [מרקר]
        ByteBuffer bb = ByteBuffer.allocate(4 + messageBytes.length + markerBytes.length);
        bb.putInt(messageBytes.length);
        bb.put(messageBytes);
        bb.put(markerBytes);

        boolean[] bits = toBitArray(bb.array());

        double[] samples = bytesToDoubles(coverData);
        int numFrames = samples.length / FRAME_SIZE;
        int startFrame = 10;

        // חישוב הקיבולת המדויקת
        int availableBits = numFrames - startFrame;

        // הדפסת סטטוס קיבולת
        System.out.println("--- בדיקת קיבולת שמע ---");
        System.out.println("ביטים פנויים בקובץ: " + availableBits);
        System.out.println("ביטים נדרשים להודעה: " + bits.length);

        if (bits.length > availableBits) {
            int bitsToReduce = bits.length - availableBits;
            System.err.println("❌ שגיאה: ההודעה ארוכה מדי!");
            System.err.println("⚠️ חריגה של: " + bitsToReduce + " ביטים.");
            System.err.println("-----------------------");
            return coverData;
        }
        System.out.println("✅ יש מספיק מקום, מתחיל הטמעה...");
        System.out.println("-----------------------");

        DoubleFFT_1D fft = new DoubleFFT_1D(FRAME_SIZE);
        int bitIdx = 0;

        for (int b = startFrame; b < numFrames && bitIdx < bits.length; b++) {
            double[] fftData = new double[FRAME_SIZE * 2];
            System.arraycopy(samples, b * FRAME_SIZE, fftData, 0, FRAME_SIZE);
            fft.realForwardFull(fftData);

            for (int f = START_FREQ; f <= END_FREQ; f++) {
                double re = fftData[f * 2];
                double im = fftData[f * 2 + 1];
                double mag = Math.sqrt(re * re + im * im);
                if (mag < 1e-4) mag = 1e-2;

                double targetPhase = bits[bitIdx] ? Math.PI / 2 : -Math.PI / 2;
                fftData[f * 2] = mag * Math.cos(targetPhase);
                fftData[f * 2 + 1] = mag * Math.sin(targetPhase);
            }

            fft.complexInverse(fftData, true);
            for (int i = 0; i < FRAME_SIZE; i++) {
                samples[b * FRAME_SIZE + i] = fftData[i * 2];
            }
            bitIdx++;
        }
        return doublesToBytes(samples, coverData);
    }
    @Override
    public String extract(byte[] stegoData) {
        double[] samples = bytesToDoubles(stegoData);
        DoubleFFT_1D fft = new DoubleFFT_1D(FRAME_SIZE);
        StringBuilder bitStream = new StringBuilder();

        // חילוץ ביטים החל מפריים 10
        for (int b = 10; b < samples.length / FRAME_SIZE; b++) {
            double[] fftData = new double[FRAME_SIZE * 2];
            System.arraycopy(samples, b * FRAME_SIZE, fftData, 0, FRAME_SIZE);
            fft.realForwardFull(fftData);

            double avgPhase = 0;
            for (int f = START_FREQ; f <= END_FREQ; f++) {
                avgPhase += Math.atan2(fftData[f * 2 + 1], fftData[f * 2]);
            }
            bitStream.append(avgPhase >= 0 ? "1" : "0");

            // בדיקה בכל פעם שיש לנו בית שלם
            if (bitStream.length() >= 40 && bitStream.length() % 8 == 0) {
                try {
                    String currentText = bitsToText(bitStream.toString());
                    // אם המרקר קיים, אנחנו מחלצים רק את מה שבינו לבין האורך שמוגדר בהתחלה
                    if (currentText.contains(MARKER)) {
                        // ה-substring(4) מדלג על ה-4 בייטים של ה-int ששמרנו בהתחלה
                        return currentText.substring(4).split(MARKER)[0];
                    }
                } catch (Exception e) { /* ממשיכים לחלץ */ }
            }
        }
        return "Marker not found";
    }
    // פונקציות העזר bytesToDoubles, doublesToBytes, toBitArray, bitsToText ללא שינוי...
    private double[] bytesToDoubles(byte[] data) {
        int len = (data.length - HEADER_SIZE) / 2;
        double[] doubles = new double[len];
        for (int i = 0; i < len; i++) {
            doubles[i] = ByteBuffer.wrap(data, HEADER_SIZE + i * 2, 2).order(ByteOrder.LITTLE_ENDIAN).getShort() / 32768.0;
        }
        return doubles;
    }

    private byte[] doublesToBytes(double[] doubles, byte[] original) {
        byte[] result = original.clone();
        for (int i = 0; i < doubles.length; i++) {
            short val = (short) (Math.max(-1.0, Math.min(1.0, doubles[i])) * 32767);
            ByteBuffer.wrap(result, HEADER_SIZE + i * 2, 2).order(ByteOrder.LITTLE_ENDIAN).putShort(val);
        }
        return result;
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
    public int calculateSuitability(FileMetrics metrics) { return 100; }
}