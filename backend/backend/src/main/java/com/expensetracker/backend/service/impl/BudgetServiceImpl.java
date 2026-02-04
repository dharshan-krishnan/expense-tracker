package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.PaymentAccountRepository;
import com.expensetracker.backend.service.BudgetService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository repo;
    private final PaymentAccountRepository paymentAccountRepo;

    public BudgetServiceImpl(BudgetRepository repo, PaymentAccountRepository paymentAccountRepo) {
        this.repo = repo;
        this.paymentAccountRepo = paymentAccountRepo;
    }

    @Override
    public Budget create(Budget budget) {
        if (budget.getPaymentAccount() != null && budget.getPaymentAccount().getId() != null) {
            PaymentAccount pa = paymentAccountRepo.findById(budget.getPaymentAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Payment account not found"));
            if (!pa.getUser().getId().equals(budget.getUser().getId())) {
                throw new RuntimeException("Payment account does not belong to user");
            }
            budget.setPaymentAccount(pa);
        }
        return repo.save(budget);
    }

    @Override
    public List<Budget> getAllByUser(User user) {
        return repo.findByUser(user);
    }

    @Override
    public Budget update(String id, Budget updated) {
        Budget b = repo.findById(id).orElseThrow(() -> new RuntimeException("Budget not found"));
        User user = b.getUser();

        b.setCategory(updated.getCategory());
        b.setMonth(updated.getMonth());
        b.setYear(updated.getYear());
        b.setAmount(updated.getAmount());
        if (updated.getPaymentAccount() != null && updated.getPaymentAccount().getId() != null) {
            PaymentAccount pa = paymentAccountRepo.findById(updated.getPaymentAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Payment account not found"));
            if (!pa.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Payment account does not belong to user");
            }
            b.setPaymentAccount(pa);
        } else {
            b.setPaymentAccount(null);
        }

        return repo.save(b);
    }

    @Override
    public void delete(String id) {
        if (id != null) {
            repo.deleteById(id);
        }
    }

    @Override
    public List<Budget> filter(User user, String month, Integer year) {
        return repo.findByUserAndMonthAndYear(user, month, year);
    }
}
