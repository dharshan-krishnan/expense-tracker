import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

export default function BudgetVsExpense() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/api/budgets"),
      axios.get("http://localhost:8080/api/expenses")
    ]).then(([budgetRes, expenseRes]) => {
      const budgets = budgetRes.data;
      const expenses = expenseRes.data;

      const labels = budgets.map(b => b.category.name);

      const budgetAmounts = budgets.map(b => b.amount);

      const expenseTotals = labels.map(label =>
        expenses
          .filter(e => e.category?.name === label)
          .reduce((sum, e) => sum + e.amount, 0)
      );

      setData({
        labels,
        datasets: [
          {
            label: "Budget",
            data: budgetAmounts,
            backgroundColor: "rgba(54,162,235,0.6)"
          },
          {
            label: "Expense",
            data: expenseTotals,
            backgroundColor: "rgba(255,99,132,0.6)"
          }
        ]
      });
    });
  }, []);

  if (!data) return <p>Loading budget comparison...</p>;

  return <Bar data={data} />;
}