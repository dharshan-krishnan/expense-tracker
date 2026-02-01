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

export default function MonthlyBarChart() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    try {
      const res = await api.get("/expenses");
      const expenses = Array.isArray(res.data) ? res.data : [];

      if (expenses.length === 0) {
        setError("No expense data available");
        return;
      }

      const monthlyTotals = {};

      expenses.forEach(e => {
        if (!e.date) return;
        const month = e.date.substring(0, 7); // YYYY-MM
        monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
      });

      if (Object.keys(monthlyTotals).length === 0) {
        setError("No valid monthly data found");
        return;
      }

      setChartData({
        labels: Object.keys(monthlyTotals),
        datasets: [
          {
            label: "Monthly Expenses",
            data: Object.values(monthlyTotals),
            backgroundColor: "rgba(139, 90, 43, 0.7)",
            borderRadius: 10
          }
        ]
      });
    } catch (err) {
      console.error("Error loading monthly chart:", err);
      setError("Failed to load monthly data");
    }
  };

  if (error) return <p className="chart-error">{error}</p>;
  if (!chartData) return <p className="chart-loading">Loading...</p>;

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
}