package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Feedback;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private UserRepository userRepo;

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        try {
            feedback.setUser(getLoggedInUser());
            Feedback saved = service.save(feedback);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback submitted successfully");
            response.put("id", saved.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to submit feedback: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserFeedback() {
        try {
            return ResponseEntity.ok(service.getAllByUser(getLoggedInUser()));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve feedback");
            return ResponseEntity.status(500).body(error);
        }
    }
}
