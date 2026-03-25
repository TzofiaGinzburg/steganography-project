package com.photoServer.service;

import com.photoServer.model.Post;
import com.photoServer.model.PostComment;
import com.photoServer.repository.CommentRepository;
import com.photoServer.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository; // הוסף את ה-Injection הזה למעלה
    public void savePost(Post post) {
        System.out.println("--- התחלת תהליך שמירה במונגו ---");
        System.out.println("תוכן הפוסט: " + post.getDescription());

        // השמירה בפועל
        postRepository.save(post);

        // אם השורה הזו נדפסת עם מזהה, השמירה הצליחה ב-100%
        System.out.println("✅ הפוסט נשמר! מזהה (ID) מהענן: " + post.getId());
        System.out.println("-------------------------------");
    }

    public List<Post> getAllPostsByTarget(String target) {
        return postRepository.findByTargetOrderByCreatedAtDesc(target);
    }

    // בתוך PostService.java
    public List<Post> getAllPosts() {
        try {
            List<Post> posts = postRepository.findAll();
            System.out.println("🔍 Service: נמצאו " + posts.size() + " פוסטים ב-DB");
            return posts;
        } catch (Exception e) {
            System.err.println("❌ שגיאה בשליפת פוסטים מה-DB: " + e.getMessage());
            return new ArrayList<>(); // החזרת רשימה ריקה במקום null כדי למנוע קריסה
        }
    }
    public List<PostComment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }
    // הפונקציה שחסרה לך כדי לאפשר פענוח לפי דרישה
    public Post getPostById(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("שגיאה: פוסט עם מזהה " + postId + " לא נמצא בבסיס הנתונים"));
    }
    public PostComment saveComment(PostComment comment) {
        return commentRepository.save(comment);
    }
}
