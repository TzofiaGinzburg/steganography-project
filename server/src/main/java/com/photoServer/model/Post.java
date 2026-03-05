package com.photoServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String description;
    private String author;        // מי ששלח
    private String target;        // groupId או "world"
    private String imageUrl;      // URL לתמונה בשרת
    private String createdAt;

    // המפה המנצחת: המפתח הוא שם המשתמש, הערך הוא המסר הסודי שלו
    private Map<String, String> userMessages = new HashMap<>();

    // פעולה בונה (Constructor) מלאה ומסודרת
    public Post(String description, String author, String target, String imageUrl, Map<String, String> userMessages) {
        this.description = description;
        this.author = author;
        this.target = target;
        this.imageUrl = imageUrl;
        this.userMessages = userMessages;
        this.createdAt = LocalDateTime.now().toString(); // הגדרת זמן יצירה אוטומטית
    }

    // Constructor ריק עבור Spring/MongoDB
    public Post() {}

    // --- Getters & Setters ---

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
    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        if (createdAt != null) {
            this.createdAt = createdAt.toString(); // הופך את התאריך לטקסט
        }
    }
    public Map<String, String> getUserMessages() { return userMessages; }
    public void setUserMessages(Map<String, String> userMessages) { this.userMessages = userMessages; }
}