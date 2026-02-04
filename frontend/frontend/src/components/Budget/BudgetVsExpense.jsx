import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BudgetVsExpense() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const bRes = await api.get("/api/budgets");
      const eRes = await api.get("/api/expenses");
      
      setBudgets(Array.isArray(bRes.data) ? bRes.data : []);
      setExpenses(Array.isArray(eRes.data) ? eRes.data : []);
    } catch (err) {
      console.error("Error loading budget vs expense data:", err);
      setError("Failed to load data");
      setBudgets([]);
      setExpenses([]);
    }
  };

  const categories = budgets.map(b => b.category);
  const budgetValues = budgets.map(b => b.amount);

  const expenseValues = budgets.map(b =>
  expenses
    .filter(e => e.category && e.category.name === b.category)
    .reduce((sum, x) => sum + x.amount, 0)
);


  const data = {
    labels: categories,
    datasets: [
      {
        label: "Budget",
        data: budgetValues,
        backgroundColor: "rgba(74, 124, 89, 0.7)",
        borderColor: "rgba(74, 124, 89, 1)",
        borderWidth: 2,
        borderRadius: 8
      },
      {
        label: "Expense",
        data: expenseValues,
        backgroundColor: "rgba(166, 93, 87, 0.7)",
        borderColor: "rgba(166, 93, 87, 1)",
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  if (error) return <p className="chart-error">{error}</p>;

  return (
    <div className="chart-wrapper">
      <Bar data={data} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
}
