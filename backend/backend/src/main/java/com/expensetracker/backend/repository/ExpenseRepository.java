package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, String> {
    List<Expense> findByUser(User user);
}
