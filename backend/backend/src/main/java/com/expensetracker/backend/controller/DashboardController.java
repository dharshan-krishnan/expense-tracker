package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.BudgetService;
import com.expensetracker.backend.service.ExpenseService;
import com.expensetracker.backend.service.PaymentAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private UserRepository userRepo;

    private final BudgetService budgetService;
    private final ExpenseService expenseService;
    private final PaymentAccountService paymentAccountService;

    public DashboardController(BudgetService budgetService, ExpenseService expenseService, PaymentAccountService paymentAccountService) {
        this.budgetService = budgetService;
        this.expenseService = expenseService;
        this.paymentAccountService = paymentAccountService;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        User user = getLoggedInUser();
        int year = LocalDate.now().getYear();
        int month = LocalDate.now().getMonthValue();
        String monthName = LocalDate.now().getMonth().name().charAt(0) + LocalDate.now().getMonth().name().substring(1).toLowerCase();

        List<Budget> budgets = budgetService.getAllByUser(user).stream()
                .filter(b -> b.getYear() == year && monthName.equalsIgnoreCase(b.getMonth()))
                .collect(Collectors.toList());

        List<Expense> expenses = expenseService.getAllByUser(user).stream()
                .filter(e -> {
                    LocalDate d = e.getDate();
                    return d.getYear() == year && d.getMonthValue() == month;
                })
                .collect(Collectors.toList());

        double totalBudget = budgets.stream().mapToDouble(Budget::getAmount).sum();
        double totalExpense = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double availableBalance = totalBudget - totalExpense;

        List<Map<String, Object>> budgetDetails = new ArrayList<>();
        for (Budget b : budgets) {
            double catExpense = expenses.stream()
                    .filter(e -> e.getCategory() != null && b.getCategory().equals(e.getCategory().getName()))
                    .mapToDouble(Expense::getAmount)
                    .sum();
            double catAvailable = b.getAmount() - catExpense;
            Map<String, Object> m = new HashMap<>();
            m.put("category", b.getCategory());
            m.put("budget", b.getAmount());
            m.put("spent", catExpense);
            m.put("available", catAvailable);
            budgetDetails.add(m);
        }

        List<Map<String, Object>> paymentBalances = paymentAccountService.getAllByUser(user).stream()
                .map(acc -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", acc.getId());
                    m.put("name", acc.getName());
                    m.put("balance", paymentAccountService.getBalance(acc, user));
                    m.put("initialBalance", acc.getInitialBalance());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalBudget", totalBudget);
        result.put("totalExpense", totalExpense);
        result.put("availableBalance", availableBalance);
        result.put("budgetDetails", budgetDetails);
        result.put("paymentBalances", paymentBalances);
        return result;
    }
}
