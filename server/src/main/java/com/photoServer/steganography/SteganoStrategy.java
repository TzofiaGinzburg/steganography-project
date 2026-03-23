package com.photoServer.steganography;

import com.photoServer.steganography.model.FileMetrics;
import com.photoServer.steganography.model.MediaType;

public interface SteganoStrategy {
    // מקבל מערך בייטים של תמונה והודעה, ומחזיר תמונה עם ההודעה בפנים
    byte[] embed(byte[] coverData, String secretMessage);

    // מקבל מערך בייטים של תמונה "נגועה" ומחזיר את ההודעה הסודית
    String extract(byte[] stegoData);

    // שם האלגוריתם (לצורך לוגים או תצוגה)
    String getName();
    // זיהוי: לאיזה סוג קובץ האלגוריתם שייך (IMAGE/VIDEO/AUDIO/TEXT)
    MediaType getSupportedType();

    // החלטה: עד כמה האלגוריתם מתאים למדדים הספציפיים (0-100)
    int calculateSuitability(FileMetrics metrics);

}