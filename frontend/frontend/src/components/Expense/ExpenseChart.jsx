import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { getExpenseSummary } from "../../services/expenseService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
    <div>
      <h3>Expense Summary</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length === 0 ? (
        <p>No data</p>
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
