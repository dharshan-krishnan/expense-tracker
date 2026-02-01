package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;

import java.util.List;

public interface PaymentAccountService {

    List<PaymentAccount> getAllByUser(User user);

    PaymentAccount getOrCreateDefaults(User user);

    PaymentAccount update(Long id, Double initialBalance, User user);

    double getBalance(PaymentAccount account, User user);
}
