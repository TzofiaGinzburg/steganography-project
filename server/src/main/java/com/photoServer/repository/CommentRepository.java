package com.photoServer.repository;

import com.photoServer.model.PostComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<PostComment, String> {
    // פונקציה שתמצא את כל התגובות ששייכות לפוסט מסוים
    List<PostComment> findByPostId(String postId);
}