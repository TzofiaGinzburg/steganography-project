package com.photoServer.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.photoServer.model.Post;
import com.photoServer.model.PostComment;
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
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("senderUsername") String senderUsername,
            @RequestParam("target") String target,
            // קבלת המפה כסטרינג של JSON מה-React
            @RequestParam(value = "userMessagesJson", required = false) String userMessagesJson) {

        try {
            // 1. טיפול בתיקיית העלאות
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // 2. שמירת הקובץ
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://10.0.2.2:8080/uploads/" + fileName;

            // 3. המרת ה-JSON של המסרים למפה של Java
            Map<String, String> userMessages = new HashMap<>();
            if (userMessagesJson != null && !userMessagesJson.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                // הפיכת הסטרינג למפה אמיתית של {Username: Message}
                userMessages = mapper.readValue(userMessagesJson, new TypeReference<Map<String, String>>() {});
            }

            // 4. יצירת הפוסט עם ה-Constructor החדש הכולל את המפה
            Post newPost = new Post(description, senderUsername, target, fileUrl, userMessages);
// בתוך PostController.java תחת המתודה createPost
            newPost.setCreatedAt(LocalDateTime.now()); // <--- הוסף את השורה הזו לפני postService.savePost
            postService.savePost(newPost);

            System.out.println("✅ פוסט חדש נשמר עם " + userMessages.size() + " מסרים סודיים.");

            return ResponseEntity.ok(Map.of(
                    "message", "Post uploaded successfully!",
                    "url", fileUrl,
                    "id", newPost.getId()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/feed/{target}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable String target) {
        return ResponseEntity.ok(postService.getAllPostsByTarget(target));
    }

    @GetMapping("/all") // בלי /api ובלי /posts כאן, כי זה כבר מוגדר למעלה במחלקה
    public ResponseEntity<List<Post>> getAllPosts() {
        System.out.println("📬 הקריאה הגיעה לשרת!");
        return ResponseEntity.ok(postService.getAllPosts());
    }
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<PostComment>> getComments(@PathVariable String postId) {
        return ResponseEntity.ok(postService.getCommentsByPostId(postId));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostComment> addComment(@PathVariable String postId, @RequestBody Map<String, String> payload) {
        PostComment comment = new PostComment(postId, payload.get("author"), payload.get("text"));
        return ResponseEntity.ok(postService.saveComment(comment));
    }
}