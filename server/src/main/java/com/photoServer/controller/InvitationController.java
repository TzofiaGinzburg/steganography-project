package com.photoServer.controller;

import com.photoServer.model.Invitation;
import com.photoServer.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitations") // הוספנו /api כאן כדי שיתאים ל-BASE_URL שלך
public class InvitationController {

    @Autowired
    private InvitationRepository invitationRepository;

    @PostMapping("/accept/{id}")
    public ResponseEntity<?> acceptInvitation(@PathVariable String id) {
        return invitationRepository.findById(id).map(inv -> {
            inv.setStatus("ACCEPTED");
            invitationRepository.save(inv);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}