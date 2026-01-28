package com.expensetracker.backend.service;
import com.expensetracker.backend.entity.Expense;
import java.util.List;

public interface ExpenseService {

    Expense saveExpense(Expense expense);

    List<Expense> getAllExpenses();

    Expense getExpenseById(Long id);

    Expense updateExpense(Long id, Expense expense);

    void deleteExpense(Long id);

    List<Object[]> getExpenseSummary();

}
