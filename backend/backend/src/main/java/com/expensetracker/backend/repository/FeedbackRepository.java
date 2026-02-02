package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Feedback;
import com.expensetracker.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUser(User user);
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
