package com.photoServer.steganography.strategies.audio;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import javax.sound.sampled.*;
import java.io.*;
import java.nio.charset.StandardCharsets;

@Component
public class MagnitudeSpectrumStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int WINDOW_SIZE = 1200;
    private static final int Q_STEP      = 3000; // צעד עגול ונוח
    private static final int ENERGY_THRESHOLD = 2000;
    private static final String MARKER = "##END##";

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        try {
            AudioInputStream ais = AudioSystem.getAudioInputStream(new ByteArrayInputStream(coverData));
            AudioFormat format = ais.getFormat();
            byte[] audioBytes = ais.readAllBytes();
            ais.close();

            String bits = toBitString((secretMessage + MARKER).getBytes(StandardCharsets.UTF_8));
            int bitIdx = 0;

            for (int i = 44; i < audioBytes.length - WINDOW_SIZE && bitIdx < bits.length(); i += WINDOW_SIZE) {
                if (calculateWindowEnergy(audioBytes, i, WINDOW_SIZE) > ENERGY_THRESHOLD) {
                    int targetIdx = i + 500;
                    short sample = getSample(audioBytes, targetIdx);
                    int bit = bits.charAt(bitIdx++) == '1' ? 1 : 0;

                    // שיטה חדשה: אם הביט הוא 1, נהפוך את ה-Zone לאי-זוגי. אם 0, לזוגי.
                    setSample(audioBytes, targetIdx, encodeQIM(sample, bit));
                }
            }
            return createWavByteArray(audioBytes, format);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    @Override
    public String extract(byte[] stegoData) {
        try {
            AudioInputStream ais = AudioSystem.getAudioInputStream(new ByteArrayInputStream(stegoData));
            byte[] audioBytes = ais.readAllBytes();
            ais.close();

            StringBuilder bitStream = new StringBuilder();
            // לוגיקת החילוץ מהחלונות
            for (int i = 44; i < audioBytes.length - WINDOW_SIZE; i += WINDOW_SIZE) {
                if (calculateWindowEnergy(audioBytes, i, WINDOW_SIZE) > (ENERGY_THRESHOLD - 500)) {
                    short sample = getSample(audioBytes, i + 500);
                    bitStream.append(decodeQIM(sample));
                }
            }

            // חילוץ הטקסט עד ל-MARKER (##END##)
            String fullMessage = decodeToText(bitStream.toString());

            // ❌ מוחקים את הקטע הזה! האלגוריתם לא צריך לחתוך ::
            // if (fullMessage.contains("::")) { return fullMessage.split("::")[1]; }

            // ✅ פשוט מחזירים את כל מה שמצאנו (ה-Header + ה-JSON)
            return fullMessage;

        } catch (Exception e) {
            return "MARKER_NOT_FOUND"; // עדיף להחזיר את זה בשגיאה
        }
    }
    // --- לוגיקת ה-Quantization החדשה והחסינה ---
    private short encodeQIM(short sample, int bit) {
        int val = sample + 32768; // הזזה לטווח חיובי בלבד (0-65536) כדי למנוע בעיות סימן
        int zone = val / Q_STEP;
        if (zone % 2 != bit) {
            zone = (zone == 0) ? 1 : zone - 1;
        }
        int newVal = (zone * Q_STEP) + (Q_STEP / 2);
        return (short) (newVal - 32768); // החזרה לטווח המקורי
    }

    private int decodeQIM(short sample) {
        int val = sample + 32768;
        int zone = val / Q_STEP;
        return zone % 2;
    }

    private int calculateWindowEnergy(byte[] data, int start, int len) {
        long sum = 0;
        for (int i = start; i < start + len - 1; i += 20) {
            sum += Math.abs(getSample(data, i));
        }
        return (int) (sum / (len / 20));
    }

    private short getSample(byte[] data, int idx) {
        return (short) ((data[idx] & 0xFF) | (data[idx + 1] << 8));
    }

    private void setSample(byte[] data, int idx, short val) {
        data[idx] = (byte) (val & 0xFF);
        data[idx + 1] = (byte) ((val >> 8) & 0xFF);
    }

    private String toBitString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            for (int i = 7; i >= 0; i--) sb.append((b >> i) & 1);
        }
        return sb.toString();
    }

    private String decodeToText(String bits) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        for (int i = 0; i <= bits.length() - 8; i += 8) {
            int b = Integer.parseInt(bits.substring(i, i + 8), 2);
            baos.write(b);
            String s = new String(baos.toByteArray(), StandardCharsets.UTF_8);
            if (s.contains(MARKER)) return s.split(MARKER)[0];
        }
        return "MARKER_NOT_FOUND";
    }

    private byte[] createWavByteArray(byte[] data, AudioFormat f) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        AudioSystem.write(new AudioInputStream(new ByteArrayInputStream(data), f, data.length/f.getFrameSize()), AudioFileFormat.Type.WAVE, b);
        return b.toByteArray();
    }

    @Override public String getName() { return "MagnitudeSpectrumStrategy"; }
    @Override public MediaType getSupportedType() { return MediaType.AUDIO; }
    @Override public int calculateSuitability(FileMetrics m) { return 100; }
}