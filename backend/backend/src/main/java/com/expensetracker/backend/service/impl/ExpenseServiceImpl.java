package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repo;

    public ExpenseServiceImpl(ExpenseRepository repo) {
        this.repo = repo;
    }

    @Override
    public Expense saveExpense(Expense expense) {
        return repo.save(expense);
    }

    @Override
    public List<Expense> getAllByUser(User user) {
        return repo.findByUser(user);
    }

    @Override
    public Expense getExpenseById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    @Override
    public Expense updateExpense(Long id, Expense expense) {
        Expense e = getExpenseById(id);

        e.setTitle(expense.getTitle());
        e.setAmount(expense.getAmount());
        e.setDate(expense.getDate());
        e.setCategory(expense.getCategory());

        return repo.save(e);
    }

    @Override
    public void deleteExpense(Long id) {
        if (id != null) {
            repo.deleteById(id);
        }
    }

    @Override
    public List<Object[]> getExpenseSummaryByUser(User user) {
        return repo.expenseSummaryByUser(user);
    }
}
