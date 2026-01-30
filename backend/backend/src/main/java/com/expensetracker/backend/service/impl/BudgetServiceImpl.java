package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.service.BudgetService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository repo;

    public BudgetServiceImpl(BudgetRepository repo) {
        this.repo = repo;
    }

    @Override
    public Budget create(Budget budget) {
        return repo.save(budget);
    }

    @Override
    public List<Budget> getAllByUser(User user) {
        return repo.findByUser(user);
    }

    @Override
    public Budget update(Long id, Budget updated) {
        Budget b = repo.findById(id).orElseThrow(() -> new RuntimeException("Budget not found"));

        b.setCategory(updated.getCategory());
        b.setMonth(updated.getMonth());
        b.setYear(updated.getYear());
        b.setAmount(updated.getAmount());

        return repo.save(b);
    }

    @Override
    public void delete(Long id) {
        if (id != null) {
            repo.deleteById(id);
        }
    }

    @Override
    public List<Budget> filter(User user, String month, Integer year) {
        return repo.findByUserAndMonthAndYear(user, month, year);
    }
}
