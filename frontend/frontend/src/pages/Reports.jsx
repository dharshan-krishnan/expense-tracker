import { useEffect, useState } from "react";
import axios from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const res = await axios.get("/expenses/summary");

    const labels = res.data.map(item => item[0]);
    const data = res.data.map(item => item[1]);

    setChartData({
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data,
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffcd56",
            "#4bc0c0"
          ]
        }
      ]
    });
  };

  return (
    <div>
      <h2>Expense Report</h2>
      {chartData && <Pie data={chartData} />}
    </div>
  );
}
