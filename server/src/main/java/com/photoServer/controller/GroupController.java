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
        // 1. שמירת הקבוצה עצמה
        Group newGroup = new Group();
        newGroup.setName(request.getGroupName());
        newGroup.setCreator(request.getCreator());
        groupRepository.save(newGroup);

        // 2. שליחת הזמנה לכל חבר שהוספת לרשימה למטה ב-React
        for (MemberDTO member : request.getInvitedMembers()) {
            Invitation invite = new Invitation();
            invite.setGroupName(request.getGroupName());
            invite.setInvitedUsername(member.getUsername());
            invite.setStatus("PENDING"); // הסטטוס שיישמר ב-DB עבורם
            invitationRepository.save(invite);
        }

        return ResponseEntity.ok("הקבוצה נוצרה והזמנות נשלחו לכל הרשימה!");
    }
    // נקודת קצה לבדיקת הזמנות ממתינות (עבור ה"הבהוב" באפליקציה)
    @GetMapping("/invitations/{username}")
    public ResponseEntity<List<Invitation>> getMyInvitations(@PathVariable String username) {
        List<Invitation> invites = invitationRepository.findByInvitedUsernameAndStatus(username, "PENDING");
        return ResponseEntity.ok(invites);
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

    @GetMapping("/my-groups/{username}")
    public ResponseEntity<List<Group>> getMyGroups(@PathVariable String username) {
        // הוספנו קו תחתי בין Members ל-Username
        return ResponseEntity.ok(groupRepository.findByMembers_Username(username));
    }
}