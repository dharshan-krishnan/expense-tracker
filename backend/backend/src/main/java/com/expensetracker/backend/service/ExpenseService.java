package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Expense;
import java.util.List;

public interface ExpenseService {
    Expense addExpense(Expense expense);
    Expense updateExpense(Long id, Expense expense);
    void deleteExpense(Long id);
    List<Expense> getAllExpenses();
}
