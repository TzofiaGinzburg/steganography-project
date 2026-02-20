package com.photoServer.repository;

import com.photoServer.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
    // השאילתה הזו נכנסת לתוך ה-List של ה-members ומחפשת התאמה ל-username
    @Query("{ 'members.username': ?0 }")
    List<Group> findByMemberUsername(String username);

    Group findByName(String name);

}
