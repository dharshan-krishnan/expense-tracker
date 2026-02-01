package com.expensetracker.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Integer year;

    @ManyToOne
    @JoinColumn(name = "payment_account_id")
    private PaymentAccount paymentAccount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public Double getAmount() { return amount; }

    public void setAmount(Double amount) { this.amount = amount; }

    public String getMonth() { return month; }

    public void setMonth(String month) { this.month = month; }

    public Integer getYear() { return year; }

    public void setYear(Integer year) { this.year = year; }

    public PaymentAccount getPaymentAccount() { return paymentAccount; }
    public void setPaymentAccount(PaymentAccount paymentAccount) { this.paymentAccount = paymentAccount; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }
}
