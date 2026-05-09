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
import java.util.Random;

@Component
public class AudioDsssStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int CHIP_RATE = 512; // העליתי ל-1024 ליציבות מקסימלית
    private static final double ALPHA = 0.05;  // העליתי עוצמה כדי לוודא זיהוי
    private static final long SEED = 12345;    // סיד קבוע
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "AudioDsssStrategy"; }

    @Override
    public MediaType getSupportedType() { return MediaType.AUDIO; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            AudioInputStream ais = getPcmStream(coverData);
            AudioFormat format = ais.getFormat();
            byte[] audioBytes = ais.readAllBytes();

            // המרה ל-short (16 bit pcm)
            short[] samples = new short[audioBytes.length / 2];
            ByteBuffer.wrap(audioBytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(samples);

            byte[] messageBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
            boolean[] bits = toBitArray(messageBytes);

            if (bits.length * CHIP_RATE > samples.length) {
                throw new IllegalArgumentException("Audio too short!");
            }

            Random prng = new Random(SEED);
            for (int i = 0; i < bits.length; i++) {
                int bipolarBit = bits[i] ? 1 : -1;
                int offset = i * CHIP_RATE;

                for (int c = 0; c < CHIP_RATE; c++) {
                    int pnCode = prng.nextBoolean() ? 1 : -1;
                    // הזרקה ישירה לתוך ה-short (עוצמה מחושבת יחסית לטווח של 16 ביט)
                    double noise = ALPHA * bipolarBit * pnCode * 32767;
                    int newVal = samples[offset + c] + (int)noise;
                    samples[offset + c] = (short) Math.max(-32768, Math.min(32767, newVal));
                }
            }

            // המרה חזרה לבייטים
            byte[] outBytes = new byte[samples.length * 2];
            ByteBuffer.wrap(outBytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().put(samples);

            return createWavByteArray(outBytes, format);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            AudioInputStream ais = getPcmStream(stegoData);
            byte[] audioBytes = ais.readAllBytes();
            short[] samples = new short[audioBytes.length / 2];
            ByteBuffer.wrap(audioBytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(samples);

            Random prng = new Random(SEED);
            StringBuilder bitStream = new StringBuilder();

            int maxBits = samples.length / CHIP_RATE;
            for (int i = 0; i < maxBits; i++) {
                long correlation = 0; // משתמשים ב-long כדי למנוע Overflow בסכימה
                int offset = i * CHIP_RATE;

                for (int c = 0; c < CHIP_RATE; c++) {
                    int pnCode = prng.nextBoolean() ? 1 : -1;
                    correlation += (long) samples[offset + c] * pnCode;
                }

                bitStream.append(correlation > 0 ? "1" : "0");

                if (bitStream.length() % 8 == 0) {
                    String currentText = bitsToText(bitStream.toString());
                    if (currentText.contains(MARKER)) {
                        return currentText.split(MARKER)[0];
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Marker not found";
    }

    private AudioInputStream getPcmStream(byte[] audioData) throws Exception {
        InputStream bis = new ByteArrayInputStream(audioData);
        AudioInputStream ais = AudioSystem.getAudioInputStream(bis);
        AudioFormat baseFormat = ais.getFormat();

        // הגדרת פורמט המטרה: PCM Signed, 16-bit, Little Endian
        // זה הפורמט הסטנדרטי שבו אפשר לבצע QIM על ה-Samples
        AudioFormat targetFormat = new AudioFormat(
                AudioFormat.Encoding.PCM_SIGNED,
                baseFormat.getSampleRate(),
                16,
                baseFormat.getChannels(),
                baseFormat.getChannels() * 2,
                baseFormat.getSampleRate(),
                false // false = Little Endian
        );

        // המרה של הסטרים מ-MP3 ל-PCM
        return AudioSystem.getAudioInputStream(targetFormat, ais);
    }

    private byte[] createWavByteArray(byte[] pcmData, AudioFormat format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        AudioSystem.write(new AudioInputStream(new ByteArrayInputStream(pcmData), format, pcmData.length / format.getFrameSize()),
                AudioFileFormat.Type.WAVE, baos);
        return baos.toByteArray();
    }

    private boolean[] toBitArray(byte[] data) {
        boolean[] bits = new boolean[data.length * 8];
        for (int i = 0; i < data.length; i++)
            for (int j = 0; j < 8; j++) bits[i * 8 + j] = ((data[i] >> (7 - j)) & 1) == 1;
        return bits;
    }

    protected String bitsToText(String bitString) {
        try {
            int len = bitString.length() / 8;
            byte[] bytes = new byte[len];
            for (int i = 0; i < len; i++) {
                bytes[i] = (byte) Integer.parseInt(bitString.substring(i * 8, i * 8 + 8), 2);
            }
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) { return ""; }
    }

    @Override
    public int calculateSuitability(FileMetrics metrics) { return 95; }
}