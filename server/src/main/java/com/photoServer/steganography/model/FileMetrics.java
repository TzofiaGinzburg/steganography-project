package com.photoServer.steganography.model;

import java.util.Map;

public record FileMetrics(
        MediaType type,               // 1
        long fileSize,                // 2
        long totalPixels,             // 3
        int messageLength,            // 4
        Map<String, Double> customMetrics // 5
) {
    public double getMetric(String key) {
        return customMetrics != null ? customMetrics.getOrDefault(key, 0.0) : 0.0;
    }
}