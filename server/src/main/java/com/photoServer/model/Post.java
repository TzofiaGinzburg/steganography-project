package com.photoServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String description;
    private String author;
    private String target;
    private String imageUrl;
    private String heatmapUrl;
    private String createdAt;
    // הוסיפי את השדות האלו למחלקה הקיימת
    private String mediaType; // "IMAGE" או "AUDIO"
    private double snr;       // מדד איכות לשמע (במקום PSNR של תמונה)
    private String mediaUrl;  // שם גנרי במקום imageUrl (אפשר להשאיר את imageUrl אם את לא רוצה לשנות ב-DB)
    // מדדים מדעיים
    private double psnr;
    private double ssim;
    private double entropy;
    private double bpp;
    private double edgeDensity;
    private double capacity;
    private double processTime;
    private String chosenAlgorithm;
    // בתוך Post.java - הוסף את השדות האלו:
    private double motionVariance; // מדד תנועה לוידאו
    private double bitrateMbps;    // איכות הוידאו
    private double fps;            // קצב פריימים
    // אפשר להשתמש ב-heatmapUrl גם לוידאו עבור "מפת תנועה" או Thumbnail
    private List<String> authorizedUsers = new ArrayList<>();
    // הודעות מוחבאות
    // private Map<String, String> userMessages = new HashMap<>();

    // 1. בנאי ריק חובה עבור Spring/MongoDB
    public Post() {}

    public double getMotionVariance() {
        return motionVariance;
    }

    public void setMotionVariance(double motionVariance) {
        this.motionVariance = motionVariance;
    }

    public double getBitrateMbps() {
        return bitrateMbps;
    }

    public void setBitrateMbps(double bitrateMbps) {
        this.bitrateMbps = bitrateMbps;
    }

    public double getFps() {
        return fps;
    }

    public void setFps(double fps) {
        this.fps = fps;
    }

    // 2. Getters & Setters (וודא שכולם קיימים)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    // Getters & Setters
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public double getSnr() { return snr; }
    public void setSnr(double snr) { this.snr = snr; }
    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getHeatmapUrl() { return heatmapUrl; }
    public void setHeatmapUrl(String heatmapUrl) { this.heatmapUrl = heatmapUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        if (createdAt != null) this.createdAt = createdAt.toString();
    }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public double getPsnr() { return psnr; }
    public void setPsnr(double psnr) { this.psnr = psnr; }

    public double getSsim() { return ssim; }
    public void setSsim(double ssim) { this.ssim = ssim; }

    public double getEntropy() { return entropy; }
    public void setEntropy(double entropy) { this.entropy = entropy; }

    public double getBpp() { return bpp; }
    public void setBpp(double bpp) { this.bpp = bpp; }

    public double getEdgeDensity() { return edgeDensity; }
    public void setEdgeDensity(double edgeDensity) { this.edgeDensity = edgeDensity; }

    public String getChosenAlgorithm() { return chosenAlgorithm; }
    public void setChosenAlgorithm(String chosenAlgorithm) { this.chosenAlgorithm = chosenAlgorithm; }

    public List<String> getAuthorizedUsers() {
        return authorizedUsers;
    }

    public void setAuthorizedUsers(List<String> authorizedUsers) {
        this.authorizedUsers = authorizedUsers;
    }
//    public Map<String, String> getUserMessages() { return userMessages; }
//    public void setUserMessages(Map<String, String> userMessages) { this.userMessages = userMessages; }

    // שדות נוספים אם צריך
    public double getCapacity() { return capacity; }
    public void setCapacity(double capacity) { this.capacity = capacity; }
    public double getProcessTime() { return processTime; }
    public void setProcessTime(double processTime) { this.processTime = processTime; }
}