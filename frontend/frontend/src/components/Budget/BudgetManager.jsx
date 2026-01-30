import { useEffect, useState } from "react";
import api from "../../services/api";
import "../Manager.css";

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", month: "", year: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBudgets();
    loadCategories();
  }, []);

  const loadBudgets = async () => {
    try {
      const res = await api.get("/budgets");
      setBudgets(res.data);
    } catch (err) {
      setError("Failed to load budgets");
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

    if (!form.category || !form.amount || !form.month || !form.year) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const categoryObj = categories.find(c => c.id === parseInt(form.category));
      const data = {
        category: categoryObj.name,
        amount: parseFloat(form.amount),
        month: form.month,
        year: parseInt(form.year)
      };

      if (editing) {
        await api.put(`/budgets/${editing}`, data);
      } else {
        await api.post("/budgets", data);
      }

      setForm({ category: "", amount: "", month: "", year: "" });
      setEditing(null);
      loadBudgets();
    } catch (err) {
      setError("Failed to save budget");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setForm({
      category: categories.find(c => c.name === budget.category)?.id || "",
      amount: budget.amount,
      month: budget.month,
      year: budget.year
    });
    setEditing(budget.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/budgets/${id}`);
        loadBudgets();
      } catch (err) {
        setError("Failed to delete budget");
      }
    }
  };

  const handleCancel = () => {
    setForm({ category: "", amount: "", month: "", year: "" });
    setEditing(null);
  };

  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const getTotalBudget = () => budgets.reduce((sum, b) => sum + b.amount, 0).toFixed(2);

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>💵 Budget Manager</h2>
        <div className="total-amount">Total Budget: ₹{getTotalBudget()}</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="manager-container">
        <div className="form-section">
          <h3>{editing ? "Edit Budget" : "Add New Budget"}</h3>
          
          <form onSubmit={handleSubmit}>
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

            <input
              type="number"
              name="amount"
              placeholder="Budget Amount"
              value={form.amount}
              onChange={handleChange}
              step="0.01"
              required
            />

            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              required
            >
              <option value="">Select Month</option>
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
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
          <h3>All Budgets ({budgets.length})</h3>
          
          {budgets.length === 0 ? (
            <p className="empty-state">No budgets yet. Create one to set limits! 🎯</p>
          ) : (
            <div className="budget-list">
              {budgets.map(budget => (
                <div key={budget.id} className="budget-item">
                  <div className="budget-info">
                    <div className="budget-title">{budget.category}</div>
                    <div className="budget-details">
                      <span className="month-badge">{budget.month} {budget.year}</span>
                    </div>
                  </div>
                  <div className="budget-amount">₹{budget.amount.toFixed(2)}</div>
                  <div className="budget-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(budget)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(budget.id)}
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
