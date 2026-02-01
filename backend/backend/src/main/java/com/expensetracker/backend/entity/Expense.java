package com.expensetracker.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private double amount;
    private LocalDate date;
    private String notes;
    @Column(name = "category_other")
    private String categoryOther;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "payment_account_id")
    private PaymentAccount paymentAccount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Expense() {}

    public Long getId() { return id; }

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
