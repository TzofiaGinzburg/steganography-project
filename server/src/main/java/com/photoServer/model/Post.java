package com.photoServer.model;

public class Post {
    // 1. הגדרת המשתנים
    private String id;
    private String description;
    private String author;
    private String target;
    private String imageUrl;
    private String createdAt; // הוספנו תאריך כדי שנוכל למיין מהחדש לישן
    private String secretMessage;

    // 2. בנאי ריק (חובה עבור Jackson - הספריה שממירה ל-JSON)
    public Post() {}

    // 3. הבנאי המלא שלך (עם תוספת תאריך)
    public Post(String id, String description, String author, String target, String imageUrl,String secretMessage) {
        this.id = id;
        this.description = description;
        this.author = author;
        this.target = target;
        this.imageUrl = imageUrl;
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.secretMessage = secretMessage;



    }

    public Post(String number, String פוסט_חדש_מהבוקר, String אבי, String world, String url) {
    }

    public String getSecretMessage() { return secretMessage; }
    public void setSecretMessage(String secretMessage) { this.secretMessage = secretMessage; }
    // 4. Getters & Setters (חיוני! בלי זה הנתונים לא יישלחו ל-React)
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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}