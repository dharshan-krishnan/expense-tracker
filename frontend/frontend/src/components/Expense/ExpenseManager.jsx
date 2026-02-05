import { useEffect, useState } from "react";
import api from "../../services/api";
import { getPaymentAccounts, ensurePaymentDefaults } from "../../services/paymentAccountService";
import "../Manager.css";

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", date: "", category: "", categoryOther: "", paymentAccount: "", notes: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExpenses();
    loadCategories();
    loadPaymentAccounts();
  }, []);

  useEffect(() => {
    if (paymentAccounts.length === 0) {
      const t = setTimeout(() => loadPaymentAccounts(), 2000);
      return () => clearTimeout(t);
    }
  }, [paymentAccounts.length]);

  const loadExpenses = async () => {
    try {
      const res = await api.get("/api/expenses");
      if (res.data && Array.isArray(res.data)) {
        setExpenses(res.data);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Failed to load expenses. Please try again.");
      setExpenses([]);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      setCategories(data.sort((a, b) => (a.isDefault ? 0 : 1) - (b.isDefault ? 0 : 1)));
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
  };

  const loadPaymentAccounts = async () => {
    try {
      let res = await getPaymentAccounts();
      let accounts = res.data && Array.isArray(res.data) ? res.data : [];
      if (accounts.length === 0) {
        try {
          res = await ensurePaymentDefaults();
          accounts = res.data && Array.isArray(res.data) ? res.data : [];
        } catch (_) {}
      }
      setPaymentAccounts(accounts);
    } catch (err) {
      console.error("Failed to load payment accounts:", err);
      setPaymentAccounts([]);
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
      const categoryObj = categories.find(c => c.id === form.category || c.id === String(form.category));
      if (!categoryObj) {
        setError("Please select a valid category");
        setLoading(false);
        return;
      }
      const data = {
        title: form.title,
        amount: parseFloat(form.amount),
        date: form.date,
        category: { id: categoryObj.id },
        notes: form.notes || null
      };
      if (form.paymentAccount) {
        data.paymentAccount = { id: form.paymentAccount };
      }
      const catName = categoryObj.name?.toLowerCase();
      if (catName === "others" && form.categoryOther?.trim()) {
        data.categoryOther = form.categoryOther.trim();
      }

      if (editing) {
        await api.put(`/api/expenses/${editing}`, data);
      } else {
        await api.post("/api/expenses", data);
      }

      setForm({ title: "", amount: "", date: "", category: "", categoryOther: "", paymentAccount: "", notes: "" });
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
      category: expense.category?.id || "",
      categoryOther: expense.categoryOther || "",
      paymentAccount: expense.paymentAccount?.id || "",
      notes: expense.notes || ""
    });
    setEditing(expense.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/api/expenses/${id}`);
        loadExpenses();
      } catch (err) {
        setError("Failed to delete expense");
      }
    }
  };

  const handleCancel = () => {
    setForm({ title: "", amount: "", date: "", category: "", categoryOther: "", paymentAccount: "", notes: "" });
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
              <option value="">Select category</option>
              {(categories.filter(c => c.isDefault).length ? categories.filter(c => c.isDefault) : categories).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {form.category && categories.find(c => c.id === form.category || c.id === String(form.category))?.name?.toLowerCase() === "others" && (
              <input
                type="text"
                name="categoryOther"
                placeholder="Specify (e.g. Gifts, Donations)"
                value={form.categoryOther}
                onChange={handleChange}
              />
            )}

            <select
              name="paymentAccount"
              value={form.paymentAccount}
              onChange={handleChange}
              required={paymentAccounts.length > 0}
            >
              <option value="">Select payment method</option>
              {paymentAccounts.map(pa => (
                <option key={pa.id} value={pa.id}>{pa.name}</option>
              ))}
            </select>
            {paymentAccounts.length === 0 && (
              <span className="form-hint">Cash and Bank will appear after loading. You can still add an expense without selecting one.</span>
            )}

            <input
              type="text"
              name="notes"
              placeholder="Note about this expense (optional)"
              value={form.notes}
              onChange={handleChange}
            />

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
                      <span className="category-badge">
                        {exp.category?.name}
                        {exp.categoryOther ? ` (${exp.categoryOther})` : ""}
                      </span>
                      <span className="payment-badge">{exp.paymentAccount?.name || "-"}</span>
                      <span className="date">{new Date(exp.date).toLocaleDateString()}</span>
                      {exp.notes && <span className="expense-note" title={exp.notes}>📝</span>}
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