package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Expense;
import java.util.List;

public interface ExpenseService {
    Expense saveExpense(Expense expense);
    List<Expense> getAllExpenses();
    void deleteExpense(Long id);
}
