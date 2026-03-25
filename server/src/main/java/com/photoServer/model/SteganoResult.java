package com.photoServer.model;

public class SteganoResult {
    private byte[] bytes;         // התמונה המוצפנת
    private String algorithm;    // שם האלגוריתם שנבחר
    private double psnr;
    private double ssim;
    private double bpp;

    public SteganoResult(byte[] bytes, String algorithm, double psnr, double ssim, double bpp) {
        this.bytes = bytes;
        this.algorithm = algorithm;
        this.psnr = psnr;
        this.ssim = ssim;
        this.bpp = bpp;
    }

    // Getters - זה מה שיעלים את האדום ב-Controller!
    public byte[] getBytes() { return bytes; }
    public String getAlgorithm() { return algorithm; }
    public double getPsnr() { return psnr; }
    public double getSsim() { return ssim; }
    public double getBpp() { return bpp; }
}