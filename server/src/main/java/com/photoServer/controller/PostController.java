package com.photoServer.controller;

import com.photoServer.steganography.factory.QualityGuard;
import com.photoServer.steganography.service.SteganographyService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.photoServer.model.Post;
import com.photoServer.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private SteganographyService steganographyService;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("senderUsername") String senderUsername,
            @RequestParam("target") String target,
            @RequestParam(value = "userMessagesJson", required = false) String userMessagesJson) {

        try {
            byte[] originalBytes = file.getBytes();
            String originalFileName = file.getOriginalFilename();
            ObjectMapper mapper = new ObjectMapper();
            // 1. קריאה ל-Service - הוא כבר הדפיס 0.0771 ו-0.7957
            Map<String, Object> results = steganographyService.hideWithFullMetrics(originalFileName, originalBytes, userMessagesJson);
            byte[] stegoBytes = (byte[]) results.get("bytes");

            // 2. שמירת הקבצים
            String stegoFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Files.write(Paths.get(UPLOAD_DIR + stegoFileName), stegoBytes);

            BufferedImage originalImg = ImageIO.read(new ByteArrayInputStream(originalBytes));
            BufferedImage stegoImg = ImageIO.read(new ByteArrayInputStream(stegoBytes));
            BufferedImage heatmap = QualityGuard.generateHeatmap(originalImg, stegoImg);
            String heatmapFileName = UUID.randomUUID().toString() + "_heatmap.png";
            ImageIO.write(heatmap, "png", new File(UPLOAD_DIR + heatmapFileName));

            // 3. בניית האובייקט והזנת מדדים
            Post newPost = new Post();
            newPost.setAuthor(senderUsername);
            newPost.setDescription(description);
            newPost.setTarget(target);
            newPost.setCreatedAt(LocalDateTime.now());
            newPost.setImageUrl("http://10.0.2.2:8080/uploads/" + stegoFileName);
            newPost.setHeatmapUrl("http://10.0.2.2:8080/uploads/" + heatmapFileName);

            // --- שליפת מדדים בטוחה (Case Insensitive) ---

            // PSNR (לכוכבים)
            Object psnrObj = results.get("PSNR") != null ? results.get("PSNR") : results.get("psnr");
            newPost.setPsnr(psnrObj != null ? ((Number) psnrObj).doubleValue() : 0.0);

            // אנטרופיה (כאן הייתה הבעיה שלך!)
            Object entropyObj = results.get("Entropy") != null ? results.get("Entropy") : results.get("entropy");
            newPost.setEntropy(entropyObj != null ? ((Number) entropyObj).doubleValue() : 0.0);

                    Object edgesObj = results.get("Edges");
            if (edgesObj == null) edgesObj = results.get("edgeDensity");
            if (edgesObj != null) {
                // שימוש ב-Number מאפשר לקחת גם Float וגם Double בלי לקרוס
                newPost.setEdgeDensity(((Number) edgesObj).doubleValue());
            } else {
                newPost.setEdgeDensity(0.0);
            }

            // קיבולת / Payload
            Object bppObj = results.get("Payload") != null ? results.get("Payload") : results.get("bpp");
            if (bppObj == null) bppObj = results.get("capacity");
            newPost.setBpp(bppObj != null ? ((Number) bppObj).doubleValue() : 0.0);

            // אלגוריתם (חשוב להציג באפליקציה)
            String alg = (String) results.get("chosenAlgorithm");
            if (alg == null) alg = (String) results.get("algorithm");
            newPost.setChosenAlgorithm(alg != null ? alg : "Unknown");

            // זמן עיבוד
            Object timeObj = results.get("time");
            newPost.setProcessTime(timeObj != null ? ((Number) timeObj).doubleValue() : 0.0);
// שליפת SSIM מה-results
            Object ssimObj = results.get("ssim");
            if (ssimObj == null) ssimObj = results.get("SSIM");
            newPost.setSsim(ssimObj != null ? ((Number) ssimObj).doubleValue() : 0.0);
            if (userMessagesJson != null) {
                Map<String, String> tempMap = mapper.readValue(userMessagesJson, new TypeReference<Map<String, String>>(){});
                newPost.setAuthorizedUsers(new ArrayList<>(tempMap.keySet()));
            }
            // שנה את החלק הזה:
            if (userMessagesJson != null && !userMessagesJson.isEmpty()) {
                // אנחנו לא שומרים את זה ב-newPost יותר!
                // השורה הזו נמחקת: newPost.setUserMessages(messagesMap);
                System.out.println("🔐 הודעה הוחבאה בתמונה ולא נשמרה במסד.");
            }

// עכשיו נשמור רק את המדדים וה-URL
            postService.savePost(newPost);
            System.out.println("DEBUG KEYS: " + results.keySet());
            // 5. שמירה למסד

            // לוג לווידוא שהערכים נכנסו לאובייקט לפני המונגו
            System.out.println("📊 SAVING TO DB -> Entropy: " + newPost.getEntropy() + ", Edges: " + newPost.getEdgeDensity());

            return ResponseEntity.ok(Map.of("status", "success", "id", newPost.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/feed/{target}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable String target) {
        return ResponseEntity.ok(postService.getAllPostsByTarget(target));
    }

    @GetMapping("/{postId}/decrypt")
    public ResponseEntity<?> decryptPostMessage(@PathVariable String postId, @RequestParam String userName) {
        try {
            // 1. שליפת הפוסט המלא מה-Database כדי לקבל את המדדים השמורים
            Post post = postService.getPostById(postId);
            if (post == null) {
                return ResponseEntity.status(404).body(Map.of("message", "הפוסט לא נמצא"));
            }

            String imageUrl = post.getImageUrl();
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            if (!Files.exists(filePath)) {
                return ResponseEntity.status(404).body(Map.of("message", "קובץ התמונה לא נמצא בשרת"));
            }

            // 2. קריאת הקובץ והפעלת לוגיקת החילוץ (Steganography Logic)
            byte[] fileBytes = Files.readAllBytes(filePath);
            String extractedJson = steganographyService.extractMessage(fileName, fileBytes);

            if (extractedJson == null || extractedJson.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "לא נמצא מסר מוצפן בתמונה"));
            }

            // 3. פענוח ה-JSON שהוחבא בתוך התמונה
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> messages = mapper.readValue(extractedJson, new TypeReference<Map<String, String>>() {});

            // 4. חיפוש המסר הספציפי למשתמש (מתעלם מ-Case)
            String userSecret = messages.entrySet().stream()
                    .filter(e -> e.getKey().equalsIgnoreCase(userName))
                    .map(Map.Entry::getValue)
                    .findFirst().orElse(null);

            if (userSecret != null) {
                // *** התיקון המרכזי: החזרת המסר יחד עם כל המדדים המדעיים מה-DB ***
                return ResponseEntity.ok(Map.of(
                        "secret", userSecret,
                        "chosenAlgorithm", post.getChosenAlgorithm() != null ? post.getChosenAlgorithm() : "Unknown",
                        "psnr", post.getPsnr(),
                        "ssim", post.getSsim(),
                        "entropy", post.getEntropy(),
                        "edgeDensity", post.getEdgeDensity(),
                        "bpp", post.getBpp(),
                        "processTime", post.getProcessTime()
                ));
            }

            return ResponseEntity.ok(Map.of("message", "פענוח הצליח, אך לא נמצא מסר המיועד ל-" + userName));

        } catch (Exception e) {
            e.printStackTrace(); // חשוב ללוגים של השרת
            return ResponseEntity.internalServerError().body(Map.of("error", "Decryption failed: " + e.getMessage()));
        }
    }
}