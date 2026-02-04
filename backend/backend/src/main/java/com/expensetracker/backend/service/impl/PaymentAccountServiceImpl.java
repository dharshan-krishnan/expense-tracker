package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.PaymentAccountRepository;
import com.expensetracker.backend.service.PaymentAccountService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentAccountServiceImpl implements PaymentAccountService {

    private final PaymentAccountRepository accountRepo;
    private final ExpenseRepository expenseRepo;

    public PaymentAccountServiceImpl(PaymentAccountRepository accountRepo, ExpenseRepository expenseRepo) {
        this.accountRepo = accountRepo;
        this.expenseRepo = expenseRepo;
    }

    @Override
    public List<PaymentAccount> getAllByUser(User user) {
        List<PaymentAccount> accounts = accountRepo.findByUser(user);
        if (accounts.isEmpty()) {
            getOrCreateDefaults(user);
            accounts = accountRepo.findByUser(user);
        }
        return accounts;
    }

    @Override
    public PaymentAccount getOrCreateDefaults(User user) {
        List<PaymentAccount> existing = accountRepo.findByUser(user);
        if (!existing.isEmpty()) {
            return existing.get(0);
        }
        PaymentAccount cash = new PaymentAccount();
        cash.setName("Cash");
        cash.setInitialBalance(0.0);
        cash.setUser(user);
        accountRepo.save(cash);

        PaymentAccount bank = new PaymentAccount();
        bank.setName("Bank");
        bank.setInitialBalance(0.0);
        bank.setUser(user);
        accountRepo.save(bank);

        return accountRepo.findByUser(user).get(0);
    }

    @Override
    public PaymentAccount update(String id, Double initialBalance, User user) {
        PaymentAccount acc = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment account not found"));
        if (!acc.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }
        acc.setInitialBalance(initialBalance != null ? initialBalance : 0.0);
        return accountRepo.save(acc);
    }

    @Override
    public double getBalance(PaymentAccount account, User user) {
        if (account == null) return 0;
        double spent = expenseRepo.findByUser(user).stream()
                .filter(e -> e.getPaymentAccount() != null && account.getId().equals(e.getPaymentAccount().getId()))
                .mapToDouble(Expense::getAmount)
                .sum();
        return (account.getInitialBalance() != null ? account.getInitialBalance() : 0) - spent;
    }
}
