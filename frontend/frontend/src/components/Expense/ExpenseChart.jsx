import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { getExpenseSummary } from "../../services/expenseService";

const COLORS = ["#8B5A2B", "#C7A17A", "#5C3A1A", "#A65D57", "#4A7C59", "#6B5344"];

export default function ExpenseChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await getExpenseSummary();

      // backend gives: [ ["fuel bro", 321] ]
      const formatted = res.data.map(item => ({
        name: item[0],
        value: item[1]
      }));

      setData(formatted);
    } catch (err) {
      console.error("Error loading expense summary:", err);
      setError("Failed to load data");
    }
  };

  return (
    <div className="chart-wrapper">
      {error && <p className="chart-error">{error}</p>}

      {data.length === 0 ? (
        <p className="chart-empty">No data yet</p>
      ) : (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      )}
    </div>
  );
}
