package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Budget;
import java.util.List;

public interface BudgetService {
    Budget createBudget(Budget budget);
    List<Budget> getAllBudgets();
    void deleteBudget(Long id);
}
