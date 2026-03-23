package com.photoServer.steganography.model;

public enum MediaType {
    IMAGE, VIDEO, AUDIO, TEXT;

    public static MediaType fromExtension(String ext) {
        if (ext == null || ext.isEmpty()) return TEXT;

        return switch (ext.toLowerCase()) {
            case "png", "jpg", "jpeg", "bmp" -> IMAGE;
            case "mp4", "avi", "mov" -> VIDEO;
            case "mp3", "wav", "flac" -> AUDIO;
            default -> TEXT;
        };
    }
}