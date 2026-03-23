package com.photoServer.steganography.strategies.audio;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

@Component
public class AudioLSBStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final int WAV_HEADER_SIZE = 44; // דילוג על ה-Header של ה-WAV
    private static final String MARKER = "##END##";

    @Override
    public String getName() { return "Audio-LSB-Dynamic"; }

    @Override
    public MediaType getSupportedType() { return MediaType.AUDIO; }
    @Override
    public int calculateSuitability(FileMetrics metrics) {
        // בדיקה בסיסית שהאובייקט לא null כדי למנוע קריסה
        if (metrics == null) return 0;

        // שימוש בפונקציה שהגדרת בתוך ה-Record שלך: getMetric
        // היא כבר יודעת לגשת ל-customMetrics ולשלוף את ה-snr
        double snrValue = metrics.getMetric("snr");

        // אם ה-SNR גבוה (מעל 30 דציבל), הקובץ נקי ו-LSB אידיאלי
        return snrValue > 30 ? 100 : 60;
    }
    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        byte[] messageBytes = (secretMessage + MARKER).getBytes(StandardCharsets.UTF_8);
        byte[] stegoData = coverData.clone();

        int bitIdx = 0;
        int totalBits = messageBytes.length * 8;

        // רצים על ה-Data החל מסוף ה-Header
        // כל Sample ב-WAV סטנדרטי הוא 2 בתים (16 ביט)
        for (int i = WAV_HEADER_SIZE; i < stegoData.length - 1 && bitIdx < totalBits; i += 2) {

            // קריאת ה-Sample בפורמט Little Endian (ככה WAV עובד)
            short sample = ByteBuffer.wrap(stegoData, i, 2)
                    .order(ByteOrder.LITTLE_ENDIAN)
                    .getShort();

            // חילוץ הביט הנוכחי מההודעה
            int bytePos = bitIdx / 8;
            int bitPos = 7 - (bitIdx % 8);
            int bitToHide = (messageBytes[bytePos] >> bitPos) & 1;

            // החלפת ה-LSB של ה-Sample
            sample = (short) ((sample & ~1) | bitToHide);

            // כתיבה חזרה למערך הבתים
            byte[] updatedSample = ByteBuffer.allocate(2)
                    .order(ByteOrder.LITTLE_ENDIAN)
                    .putShort(sample)
                    .array();
            stegoData[i] = updatedSample[0];
            stegoData[i+1] = updatedSample[1];

            bitIdx++;
        }
        return stegoData;
    }

    @Override
    public String extract(byte[] stegoData) {
        StringBuilder bitStream = new StringBuilder();

        for (int i = WAV_HEADER_SIZE; i < stegoData.length - 1; i += 2) {
            short sample = ByteBuffer.wrap(stegoData, i, 2)
                    .order(ByteOrder.LITTLE_ENDIAN)
                    .getShort();

            // חילוץ ה-LSB
            bitStream.append(sample & 1);

            // בדיקה כל 8 ביטים אם הגענו ל-MARKER
            if (bitStream.length() >= 8 && bitStream.length() % 8 == 0) {
                String currentDecoded = bitsToText(bitStream.toString());
                if (currentDecoded.contains(MARKER)) {
                    return currentDecoded.split(MARKER)[0];
                }
            }
        }
        return "Marker not found";
    }

    private String bitsToText(String bitString) {
        int charCount = bitString.length() / 8;
        byte[] bytes = new byte[charCount];
        for (int i = 0; i < charCount; i++) {
            String byteStr = bitString.substring(i * 8, (i + 1) * 8);
            bytes[i] = (byte) Integer.parseInt(byteStr, 2);
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }
}