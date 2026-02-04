package com.expensetracker.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    private String category;
    private Double amount;
    private String month;
    private Integer year;

    @DBRef
    private PaymentAccount paymentAccount;

    @DBRef
    private User user;

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

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
