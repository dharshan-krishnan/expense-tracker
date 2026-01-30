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
      const expenses = res.data;

      const monthlyTotals = {};

      expenses.forEach(e => {
        if (!e.date) return;
        const month = e.date.substring(0, 7); // YYYY-MM
        monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
      });

      setChartData({
        labels: Object.keys(monthlyTotals),
        datasets: [
          {
            label: "Monthly Expenses",
            data: Object.values(monthlyTotals),
            backgroundColor: "rgba(75,192,192,0.6)"
          }
        ]
      });
    } catch (err) {
      console.error("Error loading monthly chart:", err);
      setError("Failed to load monthly data");
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!chartData) return <p>Loading monthly chart...</p>;

  return <Bar data={chartData} />;
}