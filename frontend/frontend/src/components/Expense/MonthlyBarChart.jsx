import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

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

  useEffect(() => {
    axios.get("http://localhost:8080/api/expenses")
      .then(res => {
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
      });
  }, []);

  if (!chartData) return <p>Loading monthly chart...</p>;

  return <Bar data={chartData} />;
}