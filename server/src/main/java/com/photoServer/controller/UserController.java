package com.photoServer.controller;
// ודא שזה תואם לשם התיקייה
import com.photoServer.model.*;
import com.photoServer.repository.UserRepository;
import com.photoServer.repository.UserRepository; // ייבוא הריפוזיטורי
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.photoServer.model.Group;
import com.photoServer.model.Invitation; // פותר את האדום ב-Invitation
import com.photoServer.repository.GroupRepository; // פותר את האדום ב-groupRepository
import com.photoServer.repository.InvitationRepository; // פותר את האדום ב-invitationRepository
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.photoServer.model.GroupRequest; // חשוב מאוד!
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private GroupRepository groupRepository; // פותר את האדום בשורה 69

    @Autowired
    private InvitationRepository invitationRepository; // פותר את האדום בשורה 82
    @Autowired
    private UserRepository userRepository; // הזרקת הכלי ששומר ל-DB
    // 1. למעלה, מתחת ל-public class UserController:

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        try {
            // 1. יצירת אובייקט הקבוצה החדש ושמירתו
            Group newGroup = new Group();
            newGroup.setName(request.getGroupName());
            newGroup.setCreator(request.getCreator());

            // הוספת היוצר כחבר ראשון ומנהל בקבוצה
            Group.Member creatorAsMember = new Group.Member();
            creatorAsMember.setUsername(request.getCreator());
            creatorAsMember.setAdmin(true);
            newGroup.setMembers(List.of(creatorAsMember));

            groupRepository.save(newGroup);

            // 2. יצירת הזמנות "ממתינות" לכל חבר שנבחר ב-React (כמו צופיה)
            if (request.getInvitedMembers() != null) {
                for (MemberDTO memberDto : request.getInvitedMembers()) {
                    Invitation invite = new Invitation();
                    invite.setGroupName(request.getGroupName());
                    invite.setInvitedUsername(memberDto.getUsername());
                    invite.setStatus("PENDING"); // זה הסטטוס שגורם להופעת השעון בטלפון

                    invitationRepository.save(invite);
                }
            }

            return ResponseEntity.ok("הקבוצה נוצרה והזמנות נשלחו בהצלחה!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("שגיאה בשרת: " + e.getMessage());
        }
    }
    // הרשמה (REGISTER) - עכשיו זה שומר באמת!
    @PostMapping("/addnewUser")
    public ResponseEntity<?> addNewUser(@RequestBody User user) {
        try {
            // בדיקה בסיסית
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }

            // השמירה האמיתית ב-MongoDB!
            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(savedUser); // מחזירים את האובייקט שנשמר
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // חיפוש המשתמש ב-Database
        return userRepository.findByUsername(loginRequest.getUsername())
                .map(user -> {
                    // בדיקת סיסמה
                    if (user.getPassword().equals(loginRequest.getPassword())) {
                        // מחזיר את כל האובייקט (כולל השם שמופיע ב-Atlas)
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(401).body("Invalid credentials");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body("User not found"));
    }
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        List<User> users = userRepository.findByUsernameStartingWithIgnoreCase(name);
        return ResponseEntity.ok(users);
    }
    // 1. שליפת כל ההזמנות הממתינות למשתמש ספציפי
    @GetMapping("/invitations/{username}")
    public ResponseEntity<List<Invitation>> getMyInvitations(@PathVariable String username) {
        return ResponseEntity.ok(invitationRepository.findByInvitedUsernameAndStatus(username, "PENDING"));
    }

    // 2. אישור הצטרפות לקבוצה
    @PostMapping("/invitations/accept")
    public ResponseEntity<?> acceptInvitation(@RequestParam String invitationId) {
        Invitation invite = invitationRepository.findById(invitationId).orElseThrow();
        invite.setStatus("ACCEPTED");
        invitationRepository.save(invite);

        // כאן כדאי להוסיף את המשתמש לרשימת ה-members של הקבוצה ב-DB
        Group group = groupRepository.findByName(invite.getGroupName());
        // לוגיקה להוספת חבר...

        return ResponseEntity.ok("Welcome to the group!");
    }

    // 3. שליפת קבוצות שהמשתמש חבר בהן (לכפתור "הקבוצות שלי")
    @GetMapping("/my-groups/{username}")
    public ResponseEntity<List<Group>> getMyGroups(@PathVariable String username) {
        // מחפש קבוצות שבהן השם מופיע ברשימת ה-members
        return ResponseEntity.ok(groupRepository.findByMembers_Username(username));    }

}