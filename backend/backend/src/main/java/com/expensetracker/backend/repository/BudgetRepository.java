package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BudgetRepository extends MongoRepository<Budget, String> {
    List<Budget> findByUser(User user);
    List<Budget> findByUserAndMonthAndYear(User user, String month, Integer year);
}
