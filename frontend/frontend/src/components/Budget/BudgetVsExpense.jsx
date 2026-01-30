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
      const bRes = await api.get("/budgets");
      const eRes = await api.get("/expenses");
      
      setBudgets(bRes.data);
      setExpenses(eRes.data);
    } catch (err) {
      console.error("Error loading budget vs expense data:", err);
      setError("Failed to load data");
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
        backgroundColor: "rgba(54, 162, 235, 0.7)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2
      },
      {
        label: "Expense",
        data: expenseValues,
        backgroundColor: "rgba(255, 99, 132, 0.7)", // Red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2
      }
    ]
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ width: "700px", marginTop: "40px" }}>
      <h3>Budget vs Expense</h3>
      <Bar data={data} />
    </div>
  );
}
