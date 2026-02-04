package com.expensetracker.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "expenses")
public class Expense {

    @Id
    private String id;

    private String title;
    private double amount;
    private LocalDate date;
    private String notes;
    private String categoryOther;

    @DBRef
    private Category category;

    @DBRef
    private PaymentAccount paymentAccount;

    @DBRef
    private User user;

    public Expense() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }

    public double getAmount() { return amount; }

    public LocalDate getDate() { return date; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCategoryOther() { return categoryOther; }
    public void setCategoryOther(String categoryOther) { this.categoryOther = categoryOther; }

    public Category getCategory() { return category; }

    public PaymentAccount getPaymentAccount() { return paymentAccount; }

    public User getUser() { return user; }

    public void setTitle(String title) { this.title = title; }

    public void setAmount(double amount) { this.amount = amount; }

    public void setDate(LocalDate date) { this.date = date; }

    public void setCategory(Category category) { this.category = category; }

    public void setPaymentAccount(PaymentAccount paymentAccount) { this.paymentAccount = paymentAccount; }

    public void setUser(User user) { this.user = user; }
}
