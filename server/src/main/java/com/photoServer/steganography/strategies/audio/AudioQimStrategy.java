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
public class AudioQimStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    // DELTA קובע את החוסן. ב-MP3 מומלץ 40 ומעלה כדי לשרוד דחיסה.
    private static final int DELTA = 40;
    private static final String MARKER = "##END##";

    @Override
    public String getName() {
        return "AudioQimStrategy";
    }

    @Override
    public MediaType getSupportedType() {
        return MediaType.AUDIO;
    }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            System.out.println("🎵 [AudioQim] Starting embedding process...");

            // 1. הפיכה ל-PCM
            AudioInputStream ais = getPcmStream(coverData);
            AudioFormat format = ais.getFormat();
            byte[] pcmBytes = ais.readAllBytes();
            short[] samples = bytesToShorts(pcmBytes);
            System.out.println("📊 [AudioQim] PCM data loaded: " + samples.length + " samples found.");

            // 2. הכנת הביטים
            byte[] messageBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
            boolean[] bits = toBitArray(messageBytes);
            System.out.println("📨 [AudioQim] Secret message (with marker): " + messageBytes.length + " bytes (" + bits.length + " bits)");

            if (bits.length > samples.length) {
                throw new IllegalArgumentException("Message too long for this audio file");
            }

            // 3. הזרקת המידע
            System.out.println("🔨 [AudioQim] Applying QIM on samples... (Delta: " + DELTA + ")");
            for (int i = 0; i < bits.length; i++) {
                samples[i] = applyQim(samples[i], bits[i]);
            }
            System.out.println("✅ [AudioQim] Embedding finished.");

            // 4. המרה ודחיסה
            byte[] modifiedPcm = shortsToBytes(samples);
            System.out.println("📦 [AudioQim] Converting modified PCM to MP3 (Compression starts now)...");

            byte[] result = convertPcmToMp3(modifiedPcm, format);

            double compressionRatio = (double) result.length / modifiedPcm.length * 100;
            System.out.format("📉 [AudioQim] Compression Done! PCM: %d bytes -> MP3: %d bytes (%.2f%% of original size)%n",
                    modifiedPcm.length, result.length, compressionRatio);

            return result;

        } catch (Exception e) {
            System.err.println("❌ [AudioQim] Error during embedding: " + e.getMessage());
            throw new RuntimeException("Embedding failed", e);
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            System.out.println("📂 [AudioQim] Starting extraction from stego file...");

            AudioInputStream ais = getPcmStream(stegoData);
            short[] samples = bytesToShorts(ais.readAllBytes());
            System.out.println("📊 [AudioQim] Processing " + samples.length + " samples for hidden bits...");

            StringBuilder bitStream = new StringBuilder();
            int step = 2 * DELTA;
            int bitsFound = 0;

            for (short sample : samples) {
                int q0 = Math.round((float) sample / step) * step;
                int q1 = q0 + (sample >= q0 ? DELTA : -DELTA);

                double d0 = Math.abs(sample - q0);
                double d1 = Math.abs(sample - q1);

                bitStream.append(d1 < d0 ? "1" : "0");
                bitsFound++;

                // בדיקה כל 8 ביטים (בייט אחד)
                if (bitStream.length() > 0 && bitStream.length() % 8 == 0) {
                    String currentText = bitsToText(bitStream.toString());
                    if (currentText.contains(MARKER)) {
                        String finalMessage = currentText.split(MARKER)[0];
                        System.out.println("🔓 [AudioQim] Marker found! Bits checked: " + bitsFound);
                        System.out.println("📝 [AudioQim] Extracted message: " + finalMessage);
                        return finalMessage;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ [AudioQim] Extraction error: " + e.getMessage());
        }
        System.out.println("⚠️ [AudioQim] Marker not found. Could not extract message.");
        return "Message not found";
    }

    private short applyQim(short sample, boolean bit) {
        int step = 2 * DELTA;
        int quantized0 = Math.round((float) sample / step) * step;
        // עבור ביט 1, נזוז בחצי צעד (DELTA)
        int target = bit ? quantized0 + (sample >= quantized0 ? DELTA : -DELTA) : quantized0;
        return (short) Math.max(-32768, Math.min(32767, target));
    }

    private byte[] convertPcmToMp3(byte[] pcmData, AudioFormat pcmFormat) throws Exception {
        ByteArrayOutputStream mp3ByteStream = new ByteArrayOutputStream();

        AudioInputStream sourceStream = new AudioInputStream(
                new ByteArrayInputStream(pcmData), pcmFormat, pcmData.length / pcmFormat.getFrameSize()
        );

        // הגדרת פורמט יעד MP3 (MPEG1L3)
        AudioFormat mp3Format = new AudioFormat(
                new AudioFormat.Encoding("MPEG1L3"),
                pcmFormat.getSampleRate(), -1, pcmFormat.getChannels(), -1, -1, false
        );

        try (AudioInputStream mp3Stream = AudioSystem.getAudioInputStream(mp3Format, sourceStream)) {
            // שימוש ב-SPI (LAME) כדי לקודד את הקובץ
            AudioSystem.write(mp3Stream, new AudioFileFormat.Type("MP3", "mp3"), mp3ByteStream);
        } catch (IllegalArgumentException e) {
            // אם המקודד לא נמצא ב-Classpath, נשמור כ-WAV כברירת מחדל
            return createWavByteArray(pcmData, pcmFormat);
        }

        return mp3ByteStream.toByteArray();
    }

    private AudioInputStream getPcmStream(byte[] audioData) throws Exception {
        InputStream bis = new ByteArrayInputStream(audioData);
        AudioInputStream ais = AudioSystem.getAudioInputStream(bis);
        AudioFormat baseFormat = ais.getFormat();

        AudioFormat targetFormat = new AudioFormat(
                AudioFormat.Encoding.PCM_SIGNED,
                baseFormat.getSampleRate(), 16,
                baseFormat.getChannels(), baseFormat.getChannels() * 2, baseFormat.getSampleRate(), false
        );

        return AudioSystem.getAudioInputStream(targetFormat, ais);
    }

    private byte[] createWavByteArray(byte[] pcmData, AudioFormat format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        AudioInputStream ais = new AudioInputStream(
                new ByteArrayInputStream(pcmData), format, pcmData.length / format.getFrameSize());
        AudioSystem.write(ais, AudioFileFormat.Type.WAVE, baos);
        return baos.toByteArray();
    }

    // --- Utility Methods ---

    private short[] bytesToShorts(byte[] bytes) {
        short[] shorts = new short[bytes.length / 2];
        ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(shorts);
        return shorts;
    }

    private byte[] shortsToBytes(short[] shorts) {
        byte[] bytes = new byte[shorts.length * 2];
        ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().put(shorts);
        return bytes;
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
    public int calculateSuitability(FileMetrics metrics) {
        return 98;
    }
}