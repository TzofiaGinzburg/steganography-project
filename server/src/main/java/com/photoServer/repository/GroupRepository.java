package com.photoServer.repository;

import com.photoServer.model.Group;
import com.photoServer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
    // מוצא קבוצה לפי שם - וודא שהשדה ב-Entity אכן נקרא name
    Group findByName(String name);
    List<Group> findByMembers_Username(String username);

    // מוצא את כל הקבוצות שבהן המשתמש מופיע ברשימת החברים
    // בהנחה שבתוך Group יש List שנקרא members
    List<Group> findByMembersContaining(User user);

    // או אם אתה רוצה לחפש ישירות לפי שם המשתמש בתוך הרשימה:
    // כאן אפשר להוסיף חיפושים עתידיים אם תרצי
}