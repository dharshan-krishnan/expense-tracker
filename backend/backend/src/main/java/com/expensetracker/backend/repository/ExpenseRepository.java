package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("""
        SELECT e.category.name, SUM(e.amount)
        FROM Expense e
        GROUP BY e.category.name
    """)
    List<Object[]> expenseSummary();
}
