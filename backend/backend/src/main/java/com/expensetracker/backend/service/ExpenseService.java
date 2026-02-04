package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;

import java.util.List;

public interface ExpenseService {

    Expense saveExpense(Expense expense);

    List<Expense> getAllByUser(User user);

    Expense getExpenseById(String id);

    Expense updateExpense(String id, Expense expense);

    void deleteExpense(String id);

    List<Object[]> getExpenseSummaryByUser(User user);
}
