package com.photoServer.controller;
import com.photoServer.model.Group;
import java.util.ArrayList;
import com.photoServer.model.Group;
import com.photoServer.model.Invitation;
import com.photoServer.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.photoServer.repository.GroupRepository;
@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private GroupRepository groupRepository; // וודא שה-Repository הזה מוזרק

    @PostMapping("/accept/{id}")
    public ResponseEntity<?> acceptInvitation(@PathVariable String id) {
        // שלב 1: מציאת ההזמנה
        Invitation inv = invitationRepository.findById(id).orElse(null);
        if (inv == null) return ResponseEntity.notFound().build();

        // שלב 2: מציאת הקבוצה לפי השם שבהזמנה
        // חשוב: groupRepository.findByName חייב להחזיר Optional<Group>
        Group group = groupRepository.findByName(inv.getGroupName());
        if (group == null) return ResponseEntity.status(404).body("Group not found");

        // שלב 3: עדכון ההזמנה
        inv.setStatus("ACCEPTED");
        invitationRepository.save(inv);

        // שלב 4: הוספת החבר (כאן ה-getMembers לא יהיה אדום)
        // אנחנו משתמשים במחלקה הפנימית Member שנמצאת בתוך Group
        Group.Member newMember = new Group.Member(inv.getInvitedUsername(), false);

        // מוסיפים לרשימה הקיימת בתוך האובייקט group
        group.getMembers().add(newMember);

        // שלב 5: שמירת הקבוצה המעודכנת
        groupRepository.save(group);

        return ResponseEntity.ok().build();
    }
}