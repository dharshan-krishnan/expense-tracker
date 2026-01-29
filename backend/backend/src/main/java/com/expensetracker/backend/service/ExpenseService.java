package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;

import java.util.List;

public interface ExpenseService {

    Expense saveExpense(Expense expense);

    List<Expense> getAllByUser(User user);

    Expense getExpenseById(Long id);

    Expense updateExpense(Long id, Expense expense);

    void deleteExpense(Long id);

    List<Object[]> getExpenseSummaryByUser(User user);
}
