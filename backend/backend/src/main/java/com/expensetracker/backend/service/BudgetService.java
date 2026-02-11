package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.User;

import java.util.List;

public interface BudgetService {

    Budget create(Budget budget);

    List<Budget> getAllByUser(User user);

    Budget getById(String id, User user);

    Budget update(String id, Budget budget);

    void delete(String id);

    List<Budget> filter(User user, String month, Integer year);
}
