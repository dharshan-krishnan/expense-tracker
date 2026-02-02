package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Feedback;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.FeedbackRepository;
import com.expensetracker.backend.service.FeedbackService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackServiceImpl(FeedbackRepository repo) {
        this.repo = repo;
    }

    @Override
    public Feedback save(Feedback feedback) {
        return repo.save(feedback);
    }

    @Override
    public List<Feedback> getAllByUser(User user) {
        return repo.findByUser(user);
    }

    @Override
    public List<Feedback> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }
}
