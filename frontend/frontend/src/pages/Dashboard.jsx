import ExpenseChart from "../components/Expense/ExpenseChart";
import MonthlyBarChart from "../components/Expense/MonthlyBarChart";
import BudgetVsExpense from "../components/Budget/BudgetVsExpense";

export default function Dashboard() {
  return (
    <div>
      <h1>Expense Tracker</h1>

      <h2>Category-wise Expense (Pie)</h2>
      <ExpenseChart />

      <h2>Monthly Expenses</h2>
      <MonthlyBarChart />

      <h2>Budget vs Expense</h2>
      <BudgetVsExpense />

      <ul>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/expenses">Expenses</a></li>
      </ul>
    </div>
  );
}