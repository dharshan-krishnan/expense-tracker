package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.PaymentAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment-accounts")
@CrossOrigin("*")
public class PaymentAccountController {

    @Autowired
    private UserRepository userRepo;

    private final PaymentAccountService service;

    public PaymentAccountController(PaymentAccountService service) {
        this.service = service;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<PaymentAccount> getAll() {
        User user = getLoggedInUser();
        List<PaymentAccount> accounts = service.getAllByUser(user);
        return accounts;
    }

    @PostMapping("/ensure-defaults")
    public List<PaymentAccount> ensureDefaults() {
        return service.getAllByUser(getLoggedInUser());
    }

    @GetMapping("/balances")
    public List<Map<String, Object>> getBalances() {
        User user = getLoggedInUser();
        List<PaymentAccount> accounts = service.getAllByUser(user);
        return accounts.stream().map(acc -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", acc.getId());
            m.put("name", acc.getName());
            m.put("balance", service.getBalance(acc, user));
            m.put("initialBalance", acc.getInitialBalance());
            return m;
        }).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public PaymentAccount updateBalance(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        Double initialBalance = body != null ? body.get("initialBalance") : null;
        return service.update(id, initialBalance, getLoggedInUser());
    }
}
