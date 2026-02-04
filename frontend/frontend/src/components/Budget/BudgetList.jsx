import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import EditBudget from "./EditBudget";
import "../Page.css";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: "amount", dir: "desc" });
  const navigate = useNavigate();

  // -----------------------------
  // Memoized load() for ESLint
  // -----------------------------
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const url =
        month && year
          ? `/api/budgets/filter?month=${month}&year=${year}`
          : "/api/budgets";

      const res = await api.get(url);

      if (Array.isArray(res.data)) {
        setBudgets(res.data);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setError("Failed to load budgets. Please try again.");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/budgets/${id}`);
      load();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete budget. Please try again.");
    }
  };

  // -----------------------------
  // useEffect — fixed dependency
  // -----------------------------
  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => {
    const list = [...budgets];
    list.sort((a, b) => {
      const key = sortBy.key;

      if (key === "amount") {
        return sortBy.dir === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }

      if (key === "category") {
        const av = (a.category || "").toLowerCase();
        const bv = (b.category || "").toLowerCase();
        if (av < bv) return sortBy.dir === "asc" ? -1 : 1;
        if (av > bv) return sortBy.dir === "asc" ? 1 : -1;
        return 0;
      }

      return 0;
    });
    return list;
  }, [budgets, sortBy]);

  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  return (
    <div className="page-wrapper">
      <Link to="/" className="back-link">⬅ Back to Dashboard</Link>
      <h2 className="page-title">Budget List</h2>

      {error && (
        <div className="page-error">
          <p>{error}</p>
        </div>
      )}

      <div className="page-actions">
        <button onClick={() => navigate("/budgets/add")} className="btn-primary">
          + Add Budget
        </button>
        <span className="page-summary">Total: {budgets.length} budgets</span>
      </div>

      <div className="filter-bar">
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
        />

        <button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Filter"}
        </button>
      </div>

      {loading && <p>Loading budgets...</p>}

      {!loading && budgets.length === 0 ? (
        <p>No budgets found</p>
      ) : (
        !loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("category")}>
                    Category{" "}
                    {sortBy.key === "category" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>Payment</th>
                  <th onClick={() => toggleSort("amount")}>
                    Amount{" "}
                    {sortBy.key === "amount" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sorted.map((b) => (
                  <tr key={b.id}>
                    <td>{b.category}</td>
                    <td>{b.paymentAccount?.name || "-"}</td>
                    <td className="amount-income">₹{b.amount.toFixed(2)}</td>
                    <td>{b.month}</td>
                    <td>{b.year}</td>
                    <td>
                      <button onClick={() => setEditing(b)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

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
