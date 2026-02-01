package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.PaymentAccountRepository;
import com.expensetracker.backend.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repo;
    private final PaymentAccountRepository paymentAccountRepo;

    public ExpenseServiceImpl(ExpenseRepository repo, PaymentAccountRepository paymentAccountRepo) {
        this.repo = repo;
        this.paymentAccountRepo = paymentAccountRepo;
    }

    @Override
    public Expense saveExpense(Expense expense) {
        if (expense.getPaymentAccount() != null && expense.getPaymentAccount().getId() != null) {
            PaymentAccount pa = paymentAccountRepo.findById(expense.getPaymentAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Payment account not found"));
            if (!pa.getUser().getId().equals(expense.getUser().getId())) {
                throw new RuntimeException("Payment account does not belong to user");
            }
            expense.setPaymentAccount(pa);
        }
        return repo.save(expense);
    }

    @Override
    public List<Expense> getAllByUser(User user) {
        return repo.findByUser(user);
    }

    @Override
    public Expense getExpenseById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    @Override
    public Expense updateExpense(Long id, Expense expense) {
        Expense e = getExpenseById(id);
        User user = e.getUser();

        e.setTitle(expense.getTitle());
        e.setAmount(expense.getAmount());
        e.setDate(expense.getDate());
        e.setNotes(expense.getNotes());
        e.setCategoryOther(expense.getCategoryOther());
        e.setCategory(expense.getCategory());
        if (expense.getPaymentAccount() != null && expense.getPaymentAccount().getId() != null) {
            PaymentAccount pa = paymentAccountRepo.findById(expense.getPaymentAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Payment account not found"));
            if (!pa.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Payment account does not belong to user");
            }
            e.setPaymentAccount(pa);
        } else {
            e.setPaymentAccount(null);
        }

        return repo.save(e);
    }

    @Override
    public void deleteExpense(Long id) {
        if (id != null) {
            repo.deleteById(id);
        }
    }

    @Override
    public List<Object[]> getExpenseSummaryByUser(User user) {
        return repo.expenseSummaryByUser(user);
    }
}
