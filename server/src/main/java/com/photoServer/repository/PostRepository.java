package com.photoServer.repository;

import com.photoServer.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // פונקציה שמוצאת את כל הפוסטים ששייכים לקבוצה מסוימת או ל-"world"
    List<Post> findByTargetOrderByCreatedAtDesc(String target);
}