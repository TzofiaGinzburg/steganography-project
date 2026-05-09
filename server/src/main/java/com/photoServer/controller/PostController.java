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
            @RequestHeader Map<String, String> headers,
            @RequestParam("description") String description,
            @RequestParam("senderUsername") String senderUsername,
            @RequestParam("target") String target,
            @RequestParam(value = "userMessagesJson", required = false) String userMessagesJson) {

        try {
            // --- בדיקות תקינות קובץ (נשאר ללא שינוי) ---
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty or null");
            }

            byte[] originalBytes = file.getBytes();
            String originalFileName = file.getOriginalFilename();
            String contentType = file.getContentType();

            // --- שלב 2: זיהוי סוג המדיה (הוספת תמיכה בוידאו) ---
            boolean isAudio = contentType != null && contentType.startsWith("audio");
            boolean isVideo = contentType != null && contentType.startsWith("video");

            // --- שלב 3: הפעלת שירות הסטגנוגרפיה (הסרביס כבר מזהה וידאו ומפעיל את הראוטר החדש) ---
            Map<String, Object> results = steganographyService.hideWithFullMetrics(originalFileName, originalBytes, userMessagesJson);
            byte[] stegoBytes = (byte[]) results.get("bytes");

            // --- שלב 4: שמירת הקובץ המוצפן לדיסק ---
            String stegoFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Files.write(Paths.get(UPLOAD_DIR + stegoFileName), stegoBytes);

            // --- שלב 5: בניית אובייקט הפוסט ---
            Post newPost = new Post();
            newPost.setAuthor(senderUsername);
            newPost.setDescription(description);
            newPost.setTarget(target);
            newPost.setCreatedAt(LocalDateTime.now());

            // עדכון סוג המדיה בפוסט
            if (isVideo) {
                newPost.setMediaType("VIDEO");
            } else {
                newPost.setMediaType(isAudio ? "AUDIO" : "IMAGE");
            }

            String baseUrl = "http://10.0.2.2:8080/uploads/";
            newPost.setImageUrl(baseUrl + stegoFileName);
            newPost.setChosenAlgorithm((String) results.getOrDefault("chosenAlgorithm", "Unknown"));
            newPost.setProcessTime(extractDouble(results, "time"));

            // --- שלב 6: לוגיקה ספציפית לפי סוג מדיה ---
            if (isVideo) {
                // לוגיקה חדשה לוידאו: שליפת המדדים שה-Analyzer והראוטר ייצרו
                newPost.setMotionVariance(extractDouble(results, "motionVariance", "motion"));
                newPost.setBitrateMbps(extractDouble(results, "bitrateMbps", "bitrate"));
                newPost.setFps(extractDouble(results, "fps"));

                // בוידאו כרגע אין Heatmap, אפשר להשאיר null או להשתמש בפריים ראשון
                newPost.setHeatmapUrl(null);

            } else if (isAudio) {
                // לוגיקת אודיו קיימת - אל תיגע
                String specFileName = UUID.randomUUID().toString() + "_spec.png";
                com.photoServer.steganography.strategies.audio.SpectrogramGenerator.generateSpectrogram(stegoBytes, UPLOAD_DIR + specFileName);
                newPost.setHeatmapUrl(baseUrl + specFileName);
                newPost.setSnr(extractDouble(results, "snr", "SNR"));
                newPost.setEntropy(extractDouble(results, "entropy", "Entropy"));
            } else {
                // לוגיקת תמונה קיימת - אל תיגע
                BufferedImage originalImg = ImageIO.read(new ByteArrayInputStream(originalBytes));
                BufferedImage stegoImg = ImageIO.read(new ByteArrayInputStream(stegoBytes));
                BufferedImage heatmap = QualityGuard.generateHeatmap(originalImg, stegoImg);

                String heatmapFileName = UUID.randomUUID().toString() + "_heatmap.png";
                ImageIO.write(heatmap, "png", new File(UPLOAD_DIR + heatmapFileName));

                newPost.setHeatmapUrl(baseUrl + heatmapFileName);
                newPost.setPsnr(extractDouble(results, "psnr", "PSNR"));
                newPost.setSsim(extractDouble(results, "ssim", "SSIM"));
                newPost.setEntropy(extractDouble(results, "entropy", "Entropy"));
                newPost.setEdgeDensity(extractDouble(results, "edgeDensity", "Edges"));
                newPost.setBpp(extractDouble(results, "bpp", "Payload"));
            }

            // --- שלב 7: מורשי גישה ושמירה (נשאר ללא שינוי) ---
            if (userMessagesJson != null && !userMessagesJson.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, String> tempMap = mapper.readValue(userMessagesJson, new TypeReference<>(){});
                newPost.setAuthorizedUsers(new ArrayList<>(tempMap.keySet()));
            }

            postService.savePost(newPost);
            return ResponseEntity.ok(Map.of("status", "success", "id", newPost.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // פונקציית עזר מעודכנת - תומכת עכשיו בכל המפתחות החדשים
    private double extractDouble(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            if (map.containsKey(key) && map.get(key) != null) {
                Object value = map.get(key);
                if (value instanceof Number) {
                    return ((Number) value).doubleValue();
                }
            }
        }
        return 0.0;
    }
    @GetMapping("/feed/{target}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable String target) {
        return ResponseEntity.ok(postService.getAllPostsByTarget(target));
    }

    @GetMapping("/{postId}/decrypt")
    public ResponseEntity<?> decryptPostMessage(@PathVariable String postId, @RequestParam String userName) {
        try {
            System.out.println("\n--- 🛡️ פתיחת חבילה (Decrypt) ---");
            Post post = postService.getPostById(postId);
            if (post == null) return ResponseEntity.status(404).body(Map.of("message", "הפוסט לא נמצא"));

            Path filePath = Paths.get(UPLOAD_DIR + post.getImageUrl().substring(post.getImageUrl().lastIndexOf("/") + 1));
            byte[] fileBytes = Files.readAllBytes(filePath);

            // שליפה מהסרביס
            String extractedRaw = steganographyService.extractMessage(post.getImageUrl(), fileBytes);
            System.out.println("1. Raw data extracted: " + extractedRaw);

            if (extractedRaw.startsWith("ERROR::")) {
                return ResponseEntity.ok(Map.of("message", "לא נמצא מידע מוצפן (מרקר חסר)"));
            }

            // ניקוי המחרוזת - חיפוש ה-"::"
            String jsonPart = "";
            if (extractedRaw.contains("::")) {
                jsonPart = extractedRaw.substring(extractedRaw.indexOf("::") + 2).trim();
            } else {
                jsonPart = extractedRaw.trim();
            }

            System.out.println("2. JSON Part identified: " + jsonPart);

            // איתור סוגריים למקרה של "זנבות" אודיו
            int start = jsonPart.indexOf("{");
            int end = jsonPart.lastIndexOf("}");

            if (start == -1 || end == -1) {
                System.out.println("3. ❌ Failure: Could not find JSON braces {}");
                return ResponseEntity.ok(Map.of("message", "המידע שחולץ אינו בפורמט הודעה תקין"));
            }

            String finalJson = jsonPart.substring(start, end + 1);
            System.out.println("3. Final JSON for parsing: " + finalJson);

            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> messages = mapper.readValue(finalJson, new TypeReference<Map<String, String>>() {});

            // חיפוש המשתמש (Case Insensitive)
            String userSecret = messages.entrySet().stream()
                    .filter(e -> e.getKey().trim().equalsIgnoreCase(userName.trim()))
                    .map(Map.Entry::getValue)
                    .findFirst().orElse(null);

            if (userSecret != null) {
                System.out.println("✅ הצלחה! נמצא מסר עבור: " + userName);
                return ResponseEntity.ok(Map.of(
                        "secret", userSecret,
                        "chosenAlgorithm", post.getChosenAlgorithm()
                ));
            }

            return ResponseEntity.ok(Map.of("message", "לא נמצא מסר עבור המשתמש " + userName));

        } catch (Exception e) {
            System.err.println("🚨 שגיאת פענוח: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }}