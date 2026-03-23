package com.photoServer.steganography.strategies.image; // שימי לב לנתיב המעודכן

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import com.photoServer.steganography.SteganoStrategy;
import com.photoServer.steganography.strategies.BaseSteganoStrategy;
import org.springframework.stereotype.Component;

@Component
public class LsbImage extends BaseSteganoStrategy implements SteganoStrategy {

    @Override
    public MediaType getSupportedType() {
        return MediaType.IMAGE;
    }
    @Override
    public int calculateSuitability(FileMetrics metrics) {
        // שימוש בפונקציית העזר - הכי בטוח והכי קצר
        double entropy = metrics.getMetric("entropy");

        return (entropy < 0.4) ? 100 : 20;
    }

    @Override
    public byte[] embed(byte[] data, String message) {
        // כאן יבוא הקוד של LSB לתמונות
        return data;
    }

    @Override
    public String extract(byte[] data) {
        return "Decoded from Image LSB";
    }

    @Override
    public String getName() {
        return "Least Significant Bit (LSB)";
    }
}
