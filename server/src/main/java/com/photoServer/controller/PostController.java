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
            @RequestHeader Map<String, String> headers, // הוספתי כדי לראות את ה-Headers
            @RequestParam("description") String description,
            @RequestParam("senderUsername") String senderUsername,
            @RequestParam("target") String target,
            @RequestParam(value = "userMessagesJson", required = false) String userMessagesJson) {

        try {
            System.out.println("--- SERVER DEBUG START ---");
            System.out.println("Content-Type Header: " + headers.get("content-type"));

            if (file == null) {
                System.out.println("❌ MultipartFile is NULL");
            } else {
                System.out.println("File Param Name: " + file.getName());
                System.out.println("Original Filename: " + file.getOriginalFilename());
                System.out.println("Declared Content Type: " + file.getContentType());
                System.out.println("File Size (bytes): " + file.getSize());
            }

            if (file == null || file.isEmpty()) {
                System.out.println("❌ הקובץ הגיע ריק (size 0 או empty)");
                return ResponseEntity.badRequest().body("File is empty or null");
            }

            byte[] originalBytes = file.getBytes();
            System.out.println("✅ הצלחנו לקרוא בייטים! אורך: " + originalBytes.length);
            String originalFileName = file.getOriginalFilename();
            String contentType = file.getContentType();

            System.out.println("✅ התקבל קובץ: " + originalFileName + " בגודל: " + originalBytes.length);

            // --- שלב 2: זיהוי סוג המדיה ---
            boolean isAudio = contentType != null && contentType.startsWith("audio");

            // --- שלב 3: הפעלת שירות הסטגנוגרפיה (פעם אחת!) ---
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
            newPost.setMediaType(isAudio ? "AUDIO" : "IMAGE");

            String baseUrl = "http://10.0.2.2:8080/uploads/";
            newPost.setImageUrl(baseUrl + stegoFileName);
            newPost.setChosenAlgorithm((String) results.getOrDefault("chosenAlgorithm", "Unknown"));
            newPost.setProcessTime(extractDouble(results, "time"));

            // --- שלב 6: לוגיקה ספציפית לפי סוג מדיה ---
            if (isAudio) {
                String specFileName = UUID.randomUUID().toString() + "_spec.png";
                com.photoServer.steganography.strategies.audio.SpectrogramGenerator.generateSpectrogram(stegoBytes, UPLOAD_DIR + specFileName);
                newPost.setHeatmapUrl(baseUrl + specFileName);
                newPost.setSnr(extractDouble(results, "snr", "SNR"));
                newPost.setEntropy(extractDouble(results, "entropy", "Entropy"));
            } else {
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

            // --- שלב 7: מורשי גישה ושמירה ---
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
    // פונקציית עזר לשליפה גנרית של דאבל מהמפה (נשארת בתוך ה-Controller)
    private double extractDouble(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            if (map.containsKey(key) && map.get(key) != null) {
                return ((Number) map.get(key)).doubleValue();
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