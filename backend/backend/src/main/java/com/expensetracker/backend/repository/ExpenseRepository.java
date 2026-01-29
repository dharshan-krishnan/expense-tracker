package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

    @Query("SELECT e.category.name, SUM(e.amount) FROM Expense e WHERE e.user = :user GROUP BY e.category.name")
    List<Object[]> expenseSummaryByUser(User user);
}
