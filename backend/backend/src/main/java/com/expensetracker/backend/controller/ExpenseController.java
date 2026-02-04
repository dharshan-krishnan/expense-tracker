package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.ExpenseService;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin("*")
public class ExpenseController {

    @Autowired
    private UserRepository userRepo;

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        expense.setUser(getLoggedInUser());
        return service.saveExpense(expense);
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return service.getAllByUser(getLoggedInUser());
    }

    @GetMapping("/summary")
    public List<Object[]> summary() {
        return service.getExpenseSummaryByUser(getLoggedInUser());
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable String id, @RequestBody Expense expense) {
        expense.setUser(getLoggedInUser());
        return service.updateExpense(id, expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable String id) {
        service.deleteExpense(id);
    }
}
