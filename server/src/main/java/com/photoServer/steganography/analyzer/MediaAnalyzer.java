package com.photoServer.steganography.analyzer;

import com.photoServer.steganography.model.MediaType;
import java.util.Map;

public interface MediaAnalyzer {
    Map<String, Double> analyze(byte[] data); // כל מנתח יחזיר מפת מדדים משלו
    MediaType getSupportedType();             // איזה סוג הוא מנתח
}
