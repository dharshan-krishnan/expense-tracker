import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import EditBudget from "./EditBudget";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'amount', dir: 'desc' });
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const url =
        month && year
          ? `/budgets/filter?month=${month}&year=${year}`
          : "/budgets";

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
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      load();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete budget. Please try again.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(() => {
    const list = [...budgets];
    list.sort((a, b) => {
      const key = sortBy.key;
      if (key === 'amount') {
        return sortBy.dir === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (key === 'category') {
        const av = a.category.toLowerCase();
        const bv = b.category.toLowerCase();
        if (av < bv) return sortBy.dir === 'asc' ? -1 : 1;
        if (av > bv) return sortBy.dir === 'asc' ? 1 : -1;
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
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ 
        textDecoration: 'none', 
        color: '#4F46E5',
        fontSize: '15px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '15px',
        transition: 'all 0.2s ease',
        padding: '8px 12px',
        borderRadius: '8px'
      }} onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)';
        e.currentTarget.style.transform = 'translateX(-4px)';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}>
        ⬅ Back to Dashboard
      </Link>
      <h2>Budget List</h2>

      {error && (
        <div style={{ 
          color: '#d32f2f', 
          padding: '12px', 
          border: '1px solid #d32f2f',
          borderRadius: '4px',
          backgroundColor: '#ffebee',
          marginBottom: '15px'
        }}>
          <p>{error}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => navigate('/budgets/add')}>Add Budget</button>
        <div style={{ color: '#666' }}>Total Budgets: {budgets.length}</div>
      </div>

      <div style={{ marginTop: "10px", marginBottom: 12 }}>
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

        <button onClick={load} style={{ marginLeft: "10px" }} disabled={loading}>
          {loading ? "Loading..." : "Filter"}
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        {loading && <p>Loading budgets...</p>}

        {!loading && budgets.length === 0 ? (
          <p>No budgets found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('category')}>Category {sortBy.key === 'category' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleSort('amount')}>Amount {sortBy.key === 'amount' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((b) => (
                  <tr key={b.id}>
                    <td>{b.category}</td>
                    <td>₹{b.amount.toFixed(2)}</td>
                    <td>{b.month}</td>
                    <td>{b.year}</td>
                    <td>
                      <button onClick={() => setEditing(b)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
