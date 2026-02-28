package com.photoServer.service;

import com.photoServer.model.Post;
import com.photoServer.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

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
}
