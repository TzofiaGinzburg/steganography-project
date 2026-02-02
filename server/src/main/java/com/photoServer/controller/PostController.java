
package com.photoServer.controller;



import com.photoServer.model.Post;
import com.photoServer.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    // נתיב תיקיית ההעלאות במחשב שלך
    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("secretMessage") String secretMessage,
            @RequestParam("target") String target) {

        try {
            // 1. יצירת תיקייה אם לא קיימת
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // 2. שמירת הקובץ האמיתי
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 3. יצירת ה-URL עבור ה-React
            // 10.0.2.2 זו הכתובת של המחשב שלך כפי שהאמולטור רואה אותה
            String fileUrl = "http://10.0.2.2:8080/uploads/" + fileName;

            // 4. יצירת אובייקט פוסט ושמירה ב-Service (בזיכרון)
            Post newPost = new Post(UUID.randomUUID().toString(), description, "משתמש", target, fileUrl);
            newPost.setSecretMessage(secretMessage);
            postService.savePost(newPost);

            return ResponseEntity.ok(Map.of("message", "Post uploaded successfully!", "url", fileUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // שליפת הפיד לפי יעד (עולם או קבוצה)
    @GetMapping("/feed/{target}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable String target) {
        return ResponseEntity.ok(postService.getAllPostsByTarget(target));
    }
}