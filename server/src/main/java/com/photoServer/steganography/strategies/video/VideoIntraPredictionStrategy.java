package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

@Component
public class VideoIntraPredictionStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER = "##END##";

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        String binaryMsg = toBinaryString((secretMessage + MARKER).getBytes(StandardCharsets.UTF_8));
        ByteBuffer input = ByteBuffer.wrap(coverData);
        ByteBuffer output = ByteBuffer.allocate(coverData.length + 10000);

        int bitIndex = 0;

        while (input.remaining() > 4) {
            if (input.get(input.position()) == 0 && input.get(input.position()+1) == 0 && input.get(input.position()+2) == 1) {
                output.put(input.get()); output.put(input.get()); output.put(input.get()); // 001

                int naluHeader = input.get() & 0xFF;
                int naluType = naluHeader & 0x1F;
                output.put((byte) naluHeader);

                // אם זה Slice, ננצל את הגוף שלו להטמנת מספר ביטים
                if ((naluType == 1 || naluType == 5) && bitIndex < binaryMsg.length()) {
                    // נטמין ביט כל 10 בייטים בתוך ה-Slice (כדי לא להרוס את הוידאו)
                    int bytesInSlice = 0;
                    while (input.remaining() > 4 && bitIndex < binaryMsg.length()) {
                        // אם נתקלנו ב-Start Code הבא, נצא מהלולאה
                        if (input.get(input.position()) == 0 && input.get(input.position()+1) == 0 && input.get(input.position()+2) == 1) break;

                        int currentByte = input.get() & 0xFF;
                        if (bytesInSlice % 15 == 0 && bitIndex < binaryMsg.length()) { // מרווח של 15 בייטים
                            int secretBit = binaryMsg.charAt(bitIndex) - '0';
                            int originalMode = currentByte & 0x01; // לוקחים את הביט האחרון כ-IPM
                            int stegoByte = (currentByte & 0xFE) | secretBit;
                            output.put((byte) stegoByte);
                            bitIndex++;
                        } else {
                            output.put((byte) currentByte);
                        }
                        bytesInSlice++;
                    }
                }
            } else {
                output.put(input.get());
            }
        }
        while (input.hasRemaining()) output.put(input.get());
        System.out.println("[EMBED] Success! Bits embedded: " + bitIndex + "/" + binaryMsg.length());
        return trimArray(output);
    }

    @Override
    public String extract(byte[] stegoData) {
        ByteBuffer input = ByteBuffer.wrap(stegoData);
        StringBuilder bitStream = new StringBuilder();

        while (input.remaining() > 4) {
            if (input.get(input.position()) == 0 && input.get(input.position()+1) == 0 && input.get(input.position()+2) == 1) {
                input.get(); input.get(); input.get(); // skip 001
                int naluType = input.get() & 0x1F;

                if (naluType == 1 || naluType == 5) {
                    int bytesInSlice = 0;
                    while (input.remaining() > 4) {
                        if (input.get(input.position()) == 0 && input.get(input.position()+1) == 0 && input.get(input.position()+2) == 1) break;
                        int currentByte = input.get() & 0xFF;
                        if (bytesInSlice % 15 == 0) {
                            bitStream.append(currentByte & 0x01);
                        }
                        bytesInSlice++;
                        input.position(input.position());
                    }
                }
            } else {
                input.get();
            }
        }
        String decoded = bitsToText(bitStream.toString());
        return decoded.contains(MARKER) ? decoded.split(MARKER)[0] : "ERROR: Marker not found. Extracted so far: " + decoded;
    }

    private String toBinaryString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            for (int i = 7; i >= 0; i--) sb.append((b >> i) & 1);
        }
        return sb.toString();
    }

    protected String bitsToText(String bits) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < bits.length() - 7; i += 8) {
            try {
                int charCode = Integer.parseInt(bits.substring(i, i + 8), 2);
                sb.append((char) charCode);
            } catch (Exception e) { break; }
        }
        return sb.toString();
    }

    private byte[] trimArray(ByteBuffer bb) {
        byte[] res = new byte[bb.position()];
        bb.flip();
        bb.get(res);
        return res;
    }

    @Override public String getName() { return "VideoIntraPredictionStrategy"; }
    @Override public MediaType getSupportedType() { return MediaType.VIDEO; }
    @Override public int calculateSuitability(FileMetrics metrics) { return 100; }
}