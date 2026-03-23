package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.jcodec.api.FrameGrab;
import org.jcodec.api.SequenceEncoder;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.io.SeekableByteChannel;
import org.jcodec.common.model.Picture;
import org.jcodec.common.model.Rational;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

public class VideoDCTMappingStrategy extends BaseSteganoStrategy implements SteganoStrategy {

    private static final String MARKER = "##END##";
    private static final int QUANTUM = 40; // עוצמת השינוי

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        String binaryMsg = toBinary(secretMessage + MARKER);
        int bitIdx = 0;
        File in = null, out = null;

        try {
            in = File.createTempFile("temp_in", ".mp4");
            out = File.createTempFile("temp_out", ".mp4");
            Files.write(in.toPath(), coverData);

            try (SeekableByteChannel r = NIOUtils.readableChannel(in);
                 SeekableByteChannel w = NIOUtils.writableFileChannel(out.getAbsolutePath())) {

                FrameGrab grab = FrameGrab.createFrameGrab(r);
                SequenceEncoder encoder = SequenceEncoder.createWithFps(w, Rational.R(25, 1));

                Picture pic;
                while ((pic = grab.getNativeFrame()) != null) {
                    if (bitIdx < binaryMsg.length()) {
                        int bit = binaryMsg.charAt(bitIdx++) - '0';
                        modifyFrame(pic, bit); // מטמיע ביט אחד בכל הפריים!
                    }
                    encoder.encodeNativeFrame(pic);
                }
                encoder.finish();
            }
            return Files.readAllBytes(out.toPath());
        } catch (Exception e) {
            return coverData;
        } finally {
            if (in != null) in.delete();
            if (out != null) out.delete();
        }
    }

    private void modifyFrame(Picture pic, int bit) {
        byte[] luma = pic.getData()[0];
        int width = pic.getWidth();
        int height = pic.getHeight();

        for (int y = 0; y < height - 8; y += 8) {
            for (int x = 0; x < width - 8; x += 8) {
                int avg = getBlockAverage(luma, x, y, width);
                int quantized = avg / QUANTUM;

                if (bit == 1) {
                    if (quantized % 2 == 0) quantized++;
                } else {
                    if (quantized % 2 != 0) quantized++;
                }
                setBlockAverage(luma, x, y, width, quantized * QUANTUM + (QUANTUM / 2));
            }
        }
    }

    @Override
    public String extract(byte[] stegoData) {
        StringBuilder bits = new StringBuilder();
        File temp = null;
        try {
            temp = File.createTempFile("ext", ".mp4");
            Files.write(temp.toPath(), stegoData);

            try (SeekableByteChannel r = NIOUtils.readableChannel(temp)) {
                FrameGrab grab = FrameGrab.createFrameGrab(r);
                Picture pic;

                while ((pic = grab.getNativeFrame()) != null) {
                    byte[] luma = pic.getData()[0];
                    int width = pic.getWidth();
                    long ones = 0, zeros = 0;

                    // סופר "קולות" מכל הבלוקים בפריים
                    for (int y = 0; y < pic.getHeight() - 8; y += 8) {
                        for (int x = 0; x < width - 8; x += 8) {
                            int avg = getBlockAverage(luma, x, y, width);
                            int bit = (Math.round((float)avg / QUANTUM)) % 2;
                            if (Math.abs(bit) == 1) ones++; else zeros++;
                        }
                    }

                    bits.append(ones > zeros ? "1" : "0");

                    if (bits.length() % 8 == 0) {
                        String msg = fromBinary(bits.toString());
                        if (msg.contains(MARKER)) return msg.substring(0, msg.indexOf(MARKER));
                    }
                    if (bits.length() > 2000) break; // הגנה מהודעות ארוכות מדי
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        finally { if (temp != null) temp.delete(); }
        return "ERROR: Marker not found";
    }

    private int getBlockAverage(byte[] data, int x, int y, int width) {
        long sum = 0;
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                sum += (data[(y + i) * width + (x + j)] & 0xFF);
            }
        }
        return (int) (sum / 64);
    }

    private void setBlockAverage(byte[] data, int x, int y, int width, int newAvg) {
        int currentAvg = getBlockAverage(data, x, y, width);
        int diff = newAvg - currentAvg;
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                int idx = (y + i) * width + (x + j);
                int val = (data[idx] & 0xFF) + diff;
                data[idx] = (byte) Math.max(0, Math.min(255, val));
            }
        }
    }

    private String toBinary(String s) {
        StringBuilder sb = new StringBuilder();
        for (byte b : s.getBytes(StandardCharsets.UTF_8))
            for (int i = 7; i >= 0; i--) sb.append((b >> i) & 1);
        return sb.toString();
    }

    private String fromBinary(String b) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < b.length() - 7; i += 8) {
            try {
                int c = Integer.parseInt(b.substring(i, i + 8), 2);
                sb.append((char) c);
            } catch (Exception ignored) {}
        }
        return sb.toString();
    }

    @Override public String getName() { return "Robust Video Strategy"; }
    @Override public MediaType getSupportedType() { return MediaType.VIDEO; }
    @Override public int calculateSuitability(FileMetrics m) { return 100; }
}