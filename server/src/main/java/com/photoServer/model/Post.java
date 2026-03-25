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

    // מדדים מדעיים
    private double psnr;
    private double ssim;
    private double entropy;
    private double bpp;
    private double edgeDensity;
    private double capacity;
    private double processTime;
    private String chosenAlgorithm;
    private List<String> authorizedUsers = new ArrayList<>();
    // הודעות מוחבאות
    // private Map<String, String> userMessages = new HashMap<>();

    // 1. בנאי ריק חובה עבור Spring/MongoDB
    public Post() {}

    // 2. Getters & Setters (וודא שכולם קיימים)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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