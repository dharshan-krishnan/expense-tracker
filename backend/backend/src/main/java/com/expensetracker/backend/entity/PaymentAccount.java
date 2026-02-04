package com.expensetracker.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payment_accounts")
public class PaymentAccount {

    @Id
    private String id;

    private String name;

    private Double initialBalance = 0.0;

    @DBRef
    private User user;

    public PaymentAccount() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getInitialBalance() { return initialBalance; }
    public void setInitialBalance(Double initialBalance) { this.initialBalance = initialBalance; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
