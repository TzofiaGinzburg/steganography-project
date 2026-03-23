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

    // DELTA קובע את המרחק בין נקודות הקוונטיזציה.
    // ככל שהוא גדול יותר - החסינות גבוהה יותר, אך הרעש הנשמע גדל.
    private static final int DELTA = 40;
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "Audio-QIM"; }

    @Override
    public MediaType getSupportedType() { return MediaType.AUDIO; }

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            AudioInputStream ais = getPcmStream(coverData);
            AudioFormat format = ais.getFormat();
            byte[] audioBytes = ais.readAllBytes();
            short[] samples = bytesToShorts(audioBytes);

            byte[] messageBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
            boolean[] bits = toBitArray(messageBytes);

            if (bits.length > samples.length) {
                throw new IllegalArgumentException("Message too long for audio length");
            }

            for (int i = 0; i < bits.length; i++) {
                int bit = bits[i] ? 1 : 0;
                samples[i] = quantize(samples[i], bit);
            }

            byte[] outBytes = shortsToBytes(samples);
            return createWavByteArray(outBytes, format);
        } catch (Exception e) {
            throw new RuntimeException("QIM Embedding failed", e);
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            AudioInputStream ais = getPcmStream(stegoData);
            short[] samples = bytesToShorts(ais.readAllBytes());
            StringBuilder bitStream = new StringBuilder();

            for (short sample : samples) {
                // בדיקה לאיזו רשת הדגימה קרובה יותר: הזוגית (0) או האי-זוגית (1)
                double d0 = Math.pow(sample - quantize(sample, 0), 2);
                double d1 = Math.pow(sample - quantize(sample, 1), 2);

                bitStream.append(d1 < d0 ? "1" : "0");

                if (bitStream.length() % 8 == 0) {
                    String text = bitsToText(bitStream.toString());
                    if (text.contains(MARKER)) return text.split(MARKER)[0];
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Marker not found";
    }

    private short quantize(short sample, int bit) {
        int step = 2 * DELTA;
        // מציאת הכפולה הקרובה ביותר של 2*DELTA
        int quantized0 = Math.round((float) sample / step) * step;

        if (bit == 0) {
            return (short) Math.max(-32768, Math.min(32767, quantized0));
        } else {
            // הזזה של חצי צעד (DELTA) עבור ביט 1
            int quantized1 = quantized0 + (sample >= quantized0 ? DELTA : -DELTA);
            return (short) Math.max(-32768, Math.min(32767, quantized1));
        }
    }

    // --- Helpers ---

    private AudioInputStream getPcmStream(byte[] audioData) throws Exception {
        InputStream bis = new ByteArrayInputStream(audioData);
        AudioInputStream ais = AudioSystem.getAudioInputStream(bis);
        AudioFormat baseFormat = ais.getFormat();
        AudioFormat targetFormat = new AudioFormat(
                AudioFormat.Encoding.PCM_SIGNED, baseFormat.getSampleRate(), 16,
                baseFormat.getChannels(), baseFormat.getChannels() * 2, baseFormat.getSampleRate(), false
        );
        return AudioSystem.getAudioInputStream(targetFormat, ais);
    }

    private byte[] createWavByteArray(byte[] pcmData, AudioFormat format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        AudioSystem.write(new AudioInputStream(new ByteArrayInputStream(pcmData), format, pcmData.length / format.getFrameSize()),
                AudioFileFormat.Type.WAVE, baos);
        return baos.toByteArray();
    }

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
    public int calculateSuitability(FileMetrics metrics) { return 98; }
}