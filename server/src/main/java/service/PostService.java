package com.photoServer.service;

import com.photoServer.model.Post;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    // רשימה אחת בלבד שתשמש כ"מסד נתונים" זמני
    private static final List<Post> postsDatabase = new ArrayList<>();

    // בלוק אתחול: יוצר נתוני דמה ברגע שהשרת עולה
    static {
        postsDatabase.add(new Post("1", "פוסט חדש מהבוקר", "אבי", "world", "https://picsum.photos/id/1/400/300"));
        postsDatabase.add(new Post("2", "מי הצליח לפענח?", "מיכל", "1", "https://picsum.photos/id/2/400/300"));
    }

    // פונקציה 1: שמירת פוסט חדש (נקראת מה-Controller)
    public void savePost(Post post) {
        postsDatabase.add(0, post); // מוסיף להתחלה כדי שהחדש יהיה למעלה
    }

    // פונקציה 2: שליפת פוסטים לפי יעד (נקראת מה-Controller ומה-GroupController)
    public List<Post> getAllPostsByTarget(String target) {
        return postsDatabase.stream()
                .filter(post -> post.getTarget() != null && post.getTarget().equalsIgnoreCase(target))
                .collect(Collectors.toList());
    }
}