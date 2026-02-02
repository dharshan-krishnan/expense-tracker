package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Feedback;
import com.expensetracker.backend.entity.User;

import java.util.List;

public interface FeedbackService {
    Feedback save(Feedback feedback);
    List<Feedback> getAllByUser(User user);
    List<Feedback> getAll();
}
