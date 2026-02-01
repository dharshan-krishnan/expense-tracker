package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentAccountRepository extends JpaRepository<PaymentAccount, Long> {
    List<PaymentAccount> findByUser(User user);
}
