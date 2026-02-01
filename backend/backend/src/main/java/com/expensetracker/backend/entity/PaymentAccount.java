package com.expensetracker.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_accounts")
public class PaymentAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double initialBalance = 0.0;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public PaymentAccount() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getInitialBalance() { return initialBalance; }
    public void setInitialBalance(Double initialBalance) { this.initialBalance = initialBalance; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
