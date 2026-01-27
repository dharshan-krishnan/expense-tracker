package com.expensetracker.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expensetracker.backend.entity.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
