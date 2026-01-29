import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditBudget from "./EditBudget";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    const url =
      month && year
        ? `http://localhost:8080/api/budgets/filter?month=${month}&year=${year}`
        : "http://localhost:8080/api/budgets";

    const res = await fetch(url);
    const data = await res.json();
    setBudgets(data);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/budgets/${id}`, {
      method: "DELETE"
    });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
        <a href="/">⬅ Back to Dashboard</a>
      <h2>Budget List</h2>

      <button onClick={() => navigate("/budgets/add")}>Add Budget</button>

      <div style={{ marginTop: "20px" }}>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All Months</option>
          <option>January</option><option>February</option><option>March</option>
          <option>April</option><option>May</option><option>June</option>
          <option>July</option><option>August</option><option>September</option>
          <option>October</option><option>November</option><option>December</option>
        </select>

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button onClick={load} style={{ marginLeft: "10px" }}>Filter</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {budgets.length === 0 ? (
          <p>No budgets found</p>
        ) : (
          <ul style={{ fontSize: "18px", marginLeft: "20px" }}>
            {budgets.map((b) => (
              <li key={b.id} style={{ marginBottom: "10px" }}>
                <strong>{b.category}</strong> — ₹{b.amount} — {b.month} {b.year}
                <button
                  onClick={() => setEditing(b)}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(b.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <EditBudget
          data={editing}
          onClose={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
