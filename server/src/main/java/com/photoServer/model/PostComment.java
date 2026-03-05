package com.photoServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
public class PostComment {
    @Id
    private String id;
    private String postId; // מקשר בין התגובה לפוסט הספציפי
    private String author;
    private String text;
    private LocalDateTime createdAt;

    // Constructor ריק (חובה ל-Spring)
    public PostComment() {}

    // Constructor נוח לשימוש
    public PostComment(String postId, String author, String text) {
        this.postId = postId;
        this.author = author;
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    // Getters ו-Setters (חשוב כדי שה-Controller יזהה את השדות)
    public String getId() { return id; }
    public String getPostId() { return postId; }
    public String getAuthor() { return author; }
    public String getText() { return text; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}