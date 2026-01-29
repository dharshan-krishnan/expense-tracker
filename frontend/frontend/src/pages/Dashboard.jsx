import ExpenseChart from "../components/Expense/ExpenseChart";
import MonthlyBarChart from "../components/Expense/MonthlyBarChart";
import BudgetVsExpense from "../components/Budget/BudgetVsExpense";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      
      <div className="section-title">Financial Overview</div>

      <div className="dashboard-grid">

        <div className="card large-card">
          <h3>Category-wise Spending</h3>
          <ExpenseChart />
        </div>

        <div className="card">
          <h3>Monthly Spend</h3>
          <MonthlyBarChart />
        </div>

        <div className="card">
          <h3>Budget vs Expense</h3>
          <BudgetVsExpense />
        </div>

      </div>
    </div>
  );
}