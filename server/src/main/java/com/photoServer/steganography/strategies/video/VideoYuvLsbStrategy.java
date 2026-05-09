package com.photoServer.steganography.strategies.video;

import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.javacv.*;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;

/**
 * LSB in YUV Domain — Uncompressed / High-Bitrate Video
 * ═══════════════════════════════════════════════════════
 *
 * TARGET:  RAW, ProRes, AVI (uncompressed or near-lossless)
 *          Bitrate > 50 Mbps, any FPS, any motion level.
 *
 * THEORY
 * ──────
 * We embed directly into the Least Significant Bit of each luma (Y) sample.
 * Luma is chosen because:
 *   • The human eye is ~4× less sensitive to luma noise than chroma noise.
 *   • In high-bitrate sources the quantization step is 1 → no re-compression
 *     washes out our edits.
 *   • Y-plane changes never affect chroma, so color accuracy is untouched.
 *
 * CAPACITY:  W × H bits per frame  (e.g. 1920×1080 = 2.07 Mbit/frame).
 *
 * EMBED SAFETY
 * ────────────
 * We embed only in "textured" macroblocks (local variance ≥ VAR_THRESHOLD).
 * Flat regions (sky, white walls) are skipped — LSB flips there cause
 * visible "salt-and-pepper" noise.  Textured regions mask 1-bit changes.
 */
@Component
public class VideoYuvLsbStrategy extends BaseSteganoStrategy {

    private static final String MARKER        = "##LSB##";
    private static final int    VAR_THRESHOLD = 8;
    private static final int    BLOCK_SIZE    = 4;

    private static final int[][] COMMON_RES = {
            {3840, 2160}, {2560, 1440}, {1920, 1080},
            {1280, 720},  {854,  480},  {640,  360}
    };

    private int configW = 0, configH = 0;

    /** Override auto-detection when the resolution is known. */
    public void setDimensions(int w, int h) { configW = w; configH = h; }

    // ── EMBED ─────────────────────────────────────────────────────────────────

    @Override
    public byte[] embed(byte[] coverData, String secretMessage) {
        int[] dim = resolveDimensions(coverData.length);
        if (dim == null) {
            System.err.println("❌ [LSB-YUV EMBED] Cannot determine resolution for "
                    + coverData.length + " bytes. Call setDimensions(w, h).");
            return new byte[0];
        }
        int W = dim[0], H = dim[1];
        int frameSize = W * H * 3 / 2;
        int frames    = coverData.length / frameSize;

        System.out.println("🚀 [LSB-YUV EMBED] " + W + "×" + H
                + " | frames: " + frames + " | bits needed: "
                + ((secretMessage + MARKER).getBytes(StandardCharsets.UTF_8).length * 8));

        boolean[] bits   = toBits((secretMessage + MARKER).getBytes(StandardCharsets.UTF_8));
        byte[]    output = Arrays.copyOf(coverData, coverData.length);
        int       bitIdx = 0;

        for (int f = 0; f < frames && bitIdx < bits.length; f++)
            bitIdx = embedInYPlane(output, f * frameSize, W, H, bits, bitIdx);

        if (bitIdx >= bits.length)
            System.out.println("✅ [LSB-YUV EMBED] All " + bits.length + " bits embedded.");
        else
            System.err.println("⚠️ [LSB-YUV EMBED] Only " + bitIdx + "/" + bits.length
                    + " bits embedded — video too short or too flat!");
        return output;
    }

    private int embedInYPlane(byte[] data, int frameOff,
                              int W, int H, boolean[] bits, int bitIdx) {
        for (int by = 0; by < H - BLOCK_SIZE && bitIdx < bits.length; by += BLOCK_SIZE) {
            for (int bx = 0; bx < W - BLOCK_SIZE && bitIdx < bits.length; bx += BLOCK_SIZE) {
                if (variance(data, frameOff, bx, by, W) < VAR_THRESHOLD) continue;
                int idx = frameOff + (by + BLOCK_SIZE / 2) * W + (bx + BLOCK_SIZE / 2);
                data[idx] = setBit(data[idx], bits[bitIdx] ? 1 : 0);
                bitIdx++;
            }
        }
        return bitIdx;
    }

    // ── EXTRACT ───────────────────────────────────────────────────────────────

    @Override
    public String extract(byte[] stegoData) {
        int[] dim = resolveDimensions(stegoData.length);
        if (dim == null) {
            System.err.println("❌ [LSB-YUV EXTRACT] Cannot determine resolution for "
                    + stegoData.length + " bytes.");
            return "NOT_FOUND";
        }
        int W = dim[0], H = dim[1];
        int frameSize = W * H * 3 / 2;
        int frames    = stegoData.length / frameSize;

        System.out.println("🔍 [LSB-YUV EXTRACT] " + W + "×" + H + " | frames: " + frames);

        StringBuilder bitStream = new StringBuilder();

        for (int f = 0; f < frames; f++) {
            int frameOff = f * frameSize;
            for (int by = 0; by < H - BLOCK_SIZE; by += BLOCK_SIZE) {
                for (int bx = 0; bx < W - BLOCK_SIZE; bx += BLOCK_SIZE) {
                    if (variance(stegoData, frameOff, bx, by, W) < VAR_THRESHOLD) continue;
                    int idx = frameOff + (by + BLOCK_SIZE / 2) * W + (bx + BLOCK_SIZE / 2);
                    bitStream.append(stegoData[idx] & 1);

                    if (bitStream.length() % 8 == 0) {
                        String text = bitsToText(bitStream.toString());
                        if (text.contains(MARKER)) {
                            String msg = text.substring(0, text.indexOf(MARKER));
                            System.out.println("🎯 [LSB-YUV EXTRACT] \"" + msg + "\"");
                            return msg;
                        }
                    }
                }
            }
        }
        return "NOT_FOUND";
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private int[] resolveDimensions(int totalBytes) {
        if (configW > 0 && configH > 0) return new int[]{configW, configH};
        for (int[] res : COMMON_RES) {
            int fs = res[0] * res[1] * 3 / 2;
            if (fs > 0 && totalBytes % fs == 0) {
                System.out.println("🔎 [LSB-YUV] Detected: " + res[0] + "×" + res[1]
                        + " (" + (totalBytes / fs) + " frames)");
                return res;
            }
        }
        return null;
    }

    private double variance(byte[] data, int frameOff, int bx, int by, int W) {
        long sum = 0, sumSq = 0;
        int  n   = BLOCK_SIZE * BLOCK_SIZE;
        for (int dy = 0; dy < BLOCK_SIZE; dy++)
            for (int dx = 0; dx < BLOCK_SIZE; dx++) {
                int v = data[frameOff + (by + dy) * W + (bx + dx)] & 0xFF;
                sum   += v;
                sumSq += (long) v * v;
            }
        double mean = (double) sum / n;
        return (double) sumSq / n - mean * mean;
    }

    private byte setBit(byte b, int bit) { return (byte) ((b & ~1) | bit); }

    private boolean[] toBits(byte[] bytes) {
        boolean[] bits = new boolean[bytes.length * 8];
        for (int i = 0; i < bytes.length; i++)
            for (int j = 0; j < 8; j++)
                bits[i * 8 + j] = ((bytes[i] >> (7 - j)) & 1) == 1;
        return bits;
    }

    protected String bitsToText(String bits) {
        int    len   = bits.length() / 8;
        byte[] bytes = new byte[len];
        for (int i = 0; i < len; i++)
            bytes[i] = (byte) Integer.parseInt(bits.substring(i * 8, i * 8 + 8), 2);
        return new String(bytes, StandardCharsets.UTF_8);
    }

    @Override public String getName()             { return "VideoLSBYUVStrategy"; }
    @Override public MediaType getSupportedType() { return MediaType.VIDEO; }
    @Override public int calculateSuitability(FileMetrics m) { return 0; } // routed by VideoStrategyRouter
    }

