package com.photoServer.controller;

import com.photoServer.model.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/users") // הכתובת הראשית
@CrossOrigin(origins = "*")    // מאפשר לטלפון להתחבר למחשב
public class UserController {

    // כאן אנחנו יוצרים את הניתוב שסיכמת עם המורה
    @PostMapping("/addnewUser")
    public ResponseEntity<Boolean> addNewUser(@RequestBody User user) {
        // 1. ה-Java מקבל את האובייקט 'user' מה-React באופן אוטומטי
        System.out.println("ניסיון הרשמה עבור: " + user.getFirstName());

        // 2. בדיקה בסיסית (למשל: שלא שלחו שם ריק)
        if (user.getFirstName() == null || user.getFirstName().isEmpty()) {
            return ResponseEntity.ok(false);
        }

        // 3. הצלחה - מחזירים true
        return ResponseEntity.ok(true);
    }
    // בתוך UserController.java
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // כרגע, לצורך בדיקה, נניח שיש משתמש אחד במערכת
        String validUsername = "ppp";
        String validPassword = "123";

        if (validUsername.equals(loginRequest.getUsername()) &&
                validPassword.equals(loginRequest.getPassword())) {

            // אם הפרטים נכונים, נחזיר אובייקט משתמש מלא (כאילו שלפנו מהמסד)
            User foundUser = new User();
            foundUser.setFirstName("ישראל");
            foundUser.setLastName("ישראלי");
            foundUser.setUsername(validUsername);

            return ResponseEntity.ok(foundUser);
        } else {
            // אם הפרטים שגויים
            return ResponseEntity.status(401).body("שם משתמש או סיסמה שגויים");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // כרגע (לפני ה-Database) אנחנו עושים בדיקה דמיונית
        if ("admin".equals(username) && "1234".equals(password)) {
            // ניצור אובייקט "דמו" שיחזור ל-React
            User mockUser = new User();
            mockUser.setFirstName("משתמש");
            mockUser.setLastName("בדיקה");
            mockUser.setUsername(username);
            return ResponseEntity.ok(mockUser);
        } else {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
}
