package com.photoServer.controller;

import com.photoServer.model.Group;
import com.photoServer.model.GroupRequest;
import com.photoServer.model.Invitation;
import com.photoServer.model.MemberDTO;
import com.photoServer.repository.GroupRepository;
import com.photoServer.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*") // מאפשר לאפליקציה ב-React Native לתקשר עם השרת
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        // 1. יצירת הקבוצה
        Group newGroup = new Group();
        newGroup.setName(request.getGroupName());
        newGroup.setCreator(request.getCreator()); // שומר את 'tami' למשל

        List<Group.Member> members = new ArrayList<>();
        members.add(new Group.Member(request.getCreator(), true)); // המנהל
        newGroup.setMembers(members);
        groupRepository.save(newGroup);

        // 2. יצירת ההזמנות - כאן התיקון עבור המוזמנים
        if (request.getInvitedMembers() != null) {
            for (MemberDTO member : request.getInvitedMembers()) {
                Invitation invite = new Invitation();
                invite.setGroupName(request.getGroupName());

                // שים לב: כאן אנחנו לוקחים את השם של החבר שהוזמן!
                invite.setInvitedUsername(member.getUsername());

                // מי ששלח את ההזמנה (היוצר)
                invite.setInviterUsername(request.getCreator());

                invite.setStatus("PENDING");
                invitationRepository.save(invite);

                System.out.println("Invitation sent to: " + member.getUsername());
            }
        }
        return ResponseEntity.ok("הקבוצה נוצרה והזמנות נשלחו לחברים");
    }
    
    // נקודת קצה לבדיקת הזמנות ממתינות (עבור ה"הבהוב" באפליקציה)
    @GetMapping("/invitations/{username}")
    public ResponseEntity<List<Invitation>> getMyInvitations(@PathVariable String username) {
        List<Invitation> invites = invitationRepository.findByInvitedUsernameAndStatus(username, "PENDING");
        return ResponseEntity.ok(invites);
    }


    @PostMapping("/invitations/accept")
    public ResponseEntity<?> acceptInvitation(@RequestParam String invitationId) {
        // 1. מציאת ההזמנה
        Invitation invite = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("הזמנה לא נמצאה"));

        // 2. עדכון סטטוס ההזמנה
        invite.setStatus("ACCEPTED");
        invitationRepository.save(invite);

        // 3. הוספת המשתמש לקבוצה האמיתית
        Group group = groupRepository.findByName(invite.getGroupName());
        if (group != null) {
            // יצירת אובייקט חבר חדש
            Group.Member newMember = new Group.Member(invite.getInvitedUsername(), false); // false כי הוא לא אדמין

            // הוספה לרשימת החברים הקיימת
            if (group.getMembers() == null) {
                group.setMembers(new ArrayList<>());
            }

            // בדיקה שהחבר לא כבר רשום (ליתר ביטחון)
            boolean alreadyMember = group.getMembers().stream()
                    .anyMatch(m -> m.getUsername().equals(invite.getInvitedUsername()));

            if (!alreadyMember) {
                group.getMembers().add(newMember);
                groupRepository.save(group);
            }
            return ResponseEntity.ok("הצטרפת לקבוצה בהצלחה!");
        }
        return ResponseEntity.status(404).body("הקבוצה לא נמצאה");
    }
    @GetMapping("/my-groups/{username}")
    public ResponseEntity<List<Group>> getMyGroups(@PathVariable String username) {
        // שימוש בפונקציה המדויקת מה-Repository
        List<Group> groups = groupRepository.findByMemberUsername(username);
        return ResponseEntity.ok(groups);
    }

}