package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);

    List<Budget> findByUserAndMonthAndYear(User user, String month, Integer year);
}
