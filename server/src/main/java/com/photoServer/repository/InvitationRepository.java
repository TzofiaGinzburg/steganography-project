
package com.photoServer.repository;

import com.photoServer.model.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface InvitationRepository extends MongoRepository<Invitation, String> {
    List<Invitation> findByInvitedUsernameAndStatus(String username, String status);
}