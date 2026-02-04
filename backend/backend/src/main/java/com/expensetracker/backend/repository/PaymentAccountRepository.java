package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentAccountRepository extends MongoRepository<PaymentAccount, String> {
    List<PaymentAccount> findByUser(User user);
}
