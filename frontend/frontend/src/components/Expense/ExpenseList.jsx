import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getExpenses, deleteExpense } from "../../services/expenseService";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: "date", dir: "desc" });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getExpenses();
      if (Array.isArray(res.data)) {
        setExpenses(res.data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setError("Failed to load expenses. Please try again.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete expense. Please try again.");
    }
  };

  const sorted = useMemo(() => {
    const list = [...expenses];
    list.sort((a, b) => {
      const key = sortBy.key;
      let av = a[key];
      let bv = b[key];

      if (key === "date") {
        av = new Date(a.date);
        bv = new Date(b.date);
        return sortBy.dir === "asc" ? av - bv : bv - av;
      }

      if (key === "amount") {
        return sortBy.dir === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }

      av = av?.toString?.().toLowerCase() || "";
      bv = bv?.toString?.().toLowerCase() || "";
      if (av < bv) return sortBy.dir === "asc" ? -1 : 1;
      if (av > bv) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [expenses, sortBy]);

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
      <h2>Expenses</h2>

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
        <Link to="/expenses/add">
          <button>Add New Expense</button>
        </Link>
        <div style={{ color: '#666' }}>Total: ₹{expenses.reduce((s, e) => s + (e.amount || 0), 0).toFixed(2)}</div>
      </div>

      {loading && <p>Loading expenses...</p>}

      {!loading && (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('title')}>Title {sortBy.key === 'title' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th onClick={() => toggleSort('amount')}>Amount {sortBy.key === 'amount' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th onClick={() => toggleSort('date')}>Date {sortBy.key === 'date' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>₹{exp.amount.toFixed(2)}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.category?.name || '-'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link to={`/expenses/edit/${exp.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button className="delete-btn" onClick={() => handleDelete(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
