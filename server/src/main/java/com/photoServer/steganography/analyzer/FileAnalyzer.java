package com.photoServer.steganography.analyzer;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class FileAnalyzer {

    @Autowired
    private List<MediaAnalyzer> analyzers;

    public FileMetrics analyze(String fileName, byte[] data, String secretMessage) {
        String ext = fileName.substring(fileName.lastIndexOf(".") + 1);
        MediaType type = MediaType.fromExtension(ext);

        // 1. קבלת המפה מהמנתח
        Map<String, Double> features = analyzers.stream()
                .filter(a -> a.getSupportedType() == type)
                .findFirst()
                .map(a -> a.analyze(data))
                .orElse(new HashMap<>());

        // 2. חילוץ הנתונים מהמפה בצורה בטוחה
        long fileSize = (long) data.length;
        long totalPixels = features.getOrDefault("totalPixels", 0.0).longValue();
        int messageLength = (secretMessage != null) ? secretMessage.length() : 0;

        // 3. יצירת האובייקט - חייב להיות בדיוק לפי הסדר של ה-Record!
        return new FileMetrics(
                type,           // 1. MediaType
                fileSize,       // 2. long
                totalPixels,    // 3. long
                messageLength,  // 4. int
                features        // 5. Map<String, Double>
        );
    }
}