package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Feedback;
import com.expensetracker.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByUser(User user);
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
