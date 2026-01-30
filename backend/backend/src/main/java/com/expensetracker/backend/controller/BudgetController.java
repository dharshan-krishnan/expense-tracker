package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.BudgetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin("*")
public class BudgetController {

    @Autowired
    private UserRepository userRepo;

    private final BudgetService service;

    public BudgetController(BudgetService service) {
        this.service = service;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElse(null);
    }

    @PostMapping
    public Budget create(@RequestBody Budget budget) {
        budget.setUser(getLoggedInUser());
        return service.create(budget);
    }

    @GetMapping
    public List<Budget> getAll() {
        return service.getAllByUser(getLoggedInUser());
    }

    @GetMapping("/filter")
    public List<Budget> filter(@RequestParam String month, @RequestParam Integer year) {
        return service.filter(getLoggedInUser(), month, year);
    }

    @PutMapping("/{id}")
    public Budget update(@PathVariable Long id, @RequestBody Budget budget) {
        budget.setUser(getLoggedInUser());
        return service.update(id, budget);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}