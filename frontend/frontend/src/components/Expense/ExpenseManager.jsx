import { useEffect, useState } from "react";
import api from "../../services/api";
import "../Manager.css";

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", date: "", category: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to load expenses");
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.title || !form.amount || !form.date || !form.category) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const categoryObj = categories.find(c => c.id === parseInt(form.category));
      const data = {
        title: form.title,
        amount: parseFloat(form.amount),
        date: form.date,
        category: categoryObj
      };

      if (editing) {
        await api.put(`/expenses/${editing}`, data);
      } else {
        await api.post("/expenses", data);
      }

      setForm({ title: "", amount: "", date: "", category: "" });
      setEditing(null);
      loadExpenses();
    } catch (err) {
      setError("Failed to save expense");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category?.id || ""
    });
    setEditing(expense.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/expenses/${id}`);
        loadExpenses();
      } catch (err) {
        setError("Failed to delete expense");
      }
    }
  };

  const handleCancel = () => {
    setForm({ title: "", amount: "", date: "", category: "" });
    setEditing(null);
  };

  const getTotalAmount = () => expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2);

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>💸 Expense Manager</h2>
        <div className="total-amount">Total: ₹{getTotalAmount()}</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="manager-container">
        <div className="form-section">
          <h3>{editing ? "Edit Expense" : "Add New Expense"}</h3>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Expense Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              step="0.01"
              required
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : editing ? "Update" : "Add"}
              </button>
              {editing && (
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="list-section">
          <h3>All Expenses ({expenses.length})</h3>
          
          {expenses.length === 0 ? (
            <p className="empty-state">No expenses yet. Add one to get started! 📊</p>
          ) : (
            <div className="expense-list">
              {expenses.map(exp => (
                <div key={exp.id} className="expense-item">
                  <div className="expense-info">
                    <div className="expense-title">{exp.title}</div>
                    <div className="expense-details">
                      <span className="category-badge">{exp.category?.name}</span>
                      <span className="date">{new Date(exp.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="expense-amount">₹{exp.amount.toFixed(2)}</div>
                  <div className="expense-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(exp)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(exp.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
