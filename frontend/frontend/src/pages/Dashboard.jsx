import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import ExpenseChart from "../components/Expense/ExpenseChart";
import MonthlyBarChart from "../components/Expense/MonthlyBarChart";
import BudgetVsExpense from "../components/Budget/BudgetVsExpense";
import ExpenseManager from "../components/Expense/ExpenseManager";
import BudgetManager from "../components/Budget/BudgetManager";
import CategoryManager from "../components/Category/CategoryManager";
import "./Dashboard.css";

export default function Dashboard() {
  const { username } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>💰 Expense Tracker Dashboard</h1>
        <p>Hello {username}! Manage your finances with ease</p>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          💸 Expenses
        </button>
        <button 
          className={`nav-btn ${activeTab === "budgets" ? "active" : ""}`}
          onClick={() => setActiveTab("budgets")}
        >
          💵 Budgets
        </button>
        <button 
          className={`nav-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          📂 Categories
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="tab-content">
          <div className="section-title">Financial Overview</div>

          <div className="dashboard-grid">
            <div className="card large-card">
              <h3>📊 Category-wise Spending</h3>
              <ExpenseChart />
            </div>

            <div className="card">
              <h3>📈 Monthly Spend</h3>
              <MonthlyBarChart />
            </div>

            <div className="card">
              <h3>💹 Budget vs Expense</h3>
              <BudgetVsExpense />
            </div>
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="tab-content">
          <ExpenseManager />
        </div>
      )}

      {activeTab === "budgets" && (
        <div className="tab-content">
          <BudgetManager />
        </div>
      )}

      {activeTab === "categories" && (
        <div className="tab-content">
          <CategoryManager />
        </div>
      )}
    </div>
  );
}