package com.photoServer.steganography.strategies.audio;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import javax.sound.sampled.*;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

@Component
public class MagnitudeSpectrumStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int FRAME_SIZE = 1024;
    private static final int FREQ_BIN = 300;
    private static final double STEP = 0.15; // הגדלתי עוד קצת לעמידות שיא
    private static final String START_CODE = "11110000";
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "MagnitudeSpectrumStrategy"; }

    @Override
    public MediaType getSupportedType() { return MediaType.AUDIO; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            AudioInputStream ais = getPcmStream(coverData);
            AudioFormat format = ais.getFormat();
            double[] samples = bytesToDoubles(ais.readAllBytes());

            String fullBitString = START_CODE + toBitString((secretMessage + MARKER).getBytes(StandardCharsets.UTF_8));

            // אנחנו מתחילים מהחלון ה-100 כדי לעקוף רעשי Header בתחילת הקובץ
            int startOffset = 100 * FRAME_SIZE;
            int bitIndex = 0;

            for (int i = startOffset; i < samples.length - FRAME_SIZE && bitIndex < fullBitString.length(); i += FRAME_SIZE) {
                double val = samples[i + FREQ_BIN];
                double magnitude = Math.abs(val);
                double sign = Math.signum(val);
                if (sign == 0) sign = 1;

                int bit = fullBitString.charAt(bitIndex) == '1' ? 1 : 0;
                samples[i + FREQ_BIN] = quantizeMagnitude(magnitude, bit) * sign;
                bitIndex++;
            }

            return createWavByteArray(doublesToBytes(samples), format);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            AudioInputStream ais = getPcmStream(stegoData);
            double[] samples = bytesToDoubles(ais.readAllBytes());
            StringBuilder rawBits = new StringBuilder();

            int startOffset = 100 * FRAME_SIZE;

            for (int i = startOffset; i < samples.length - FRAME_SIZE; i += FRAME_SIZE) {
                double magnitude = Math.abs(samples[i + FREQ_BIN]);

                double d0 = Math.abs(magnitude - getNearestStep(magnitude, 0));
                double d1 = Math.abs(magnitude - getNearestStep(magnitude, 1));

                rawBits.append(d1 < d0 ? "1" : "0");
            }

            String bitString = rawBits.toString();
            int startIndex = bitString.indexOf(START_CODE);
            if (startIndex == -1) return "Marker not found (Sync failed)";

            return bitsToText(bitString.substring(startIndex + START_CODE.length()));
        } catch (Exception e) { return "Error: " + e.getMessage(); }
    }

    private double quantizeMagnitude(double mag, int bit) {
        // רשת קשיחה: 0 יהיה כפולה של 2*STEP, 1 יהיה כפולה + STEP
        double q0 = Math.round(mag / (2 * STEP)) * (2 * STEP);
        return (bit == 0) ? q0 : q0 + STEP;
    }

    private double getNearestStep(double mag, int bit) {
        return quantizeMagnitude(mag, bit);
    }

    // --- Helpers ---

    private String toBitString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            for (int i = 7; i >= 0; i--) sb.append((b >> i) & 1);
        }
        return sb.toString();
    }

    private String bitsToText(String bitString) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i <= bitString.length() - 8; i += 8) {
            try {
                int charVal = Integer.parseInt(bitString.substring(i, i + 8), 2);
                result.append((char) charVal);
                if (result.toString().contains(MARKER)) {
                    return result.toString().split(MARKER)[0];
                }
            } catch (Exception e) { break; }
        }
        return "Marker not found in payload";
    }

    private double[] bytesToDoubles(byte[] bytes) {
        short[] s = new short[bytes.length / 2];
        ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(s);
        double[] d = new double[s.length];
        for (int i = 0; i < s.length; i++) d[i] = s[i] / 32768.0;
        return d;
    }

    private byte[] doublesToBytes(double[] doubles) {
        byte[] bytes = new byte[doubles.length * 2];
        ByteBuffer buffer = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        for (double d : doubles) buffer.putShort((short) (Math.max(-1.0, Math.min(1.0, d)) * 32767));
        return bytes;
    }

    private AudioInputStream getPcmStream(byte[] data) throws Exception {
        AudioInputStream ais = AudioSystem.getAudioInputStream(new ByteArrayInputStream(data));
        AudioFormat base = ais.getFormat();
        // אילוץ ל-Mono כדי למנוע בעיות בערוצי סטריאו
        AudioFormat target = new AudioFormat(AudioFormat.Encoding.PCM_SIGNED, 44100, 16, 1, 2, 44100, false);
        return AudioSystem.getAudioInputStream(target, ais);
    }

    private byte[] createWavByteArray(byte[] pcm, AudioFormat f) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        AudioSystem.write(new AudioInputStream(new ByteArrayInputStream(pcm), f, pcm.length/f.getFrameSize()), AudioFileFormat.Type.WAVE, baos);
        return baos.toByteArray();
    }

    @Override
    public int calculateSuitability(FileMetrics metrics) { return 90; }
}