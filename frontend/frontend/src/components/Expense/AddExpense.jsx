import { useState, useEffect } from "react";
import { addExpense } from "../../services/expenseService";
import { getCategories } from "../../services/categoryService";
import { getPaymentAccounts, ensurePaymentDefaults } from "../../services/paymentAccountService";
import { useNavigate, Link } from "react-router-dom";
import "../Page.css";

export default function AddExpense() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    categoryId: "",
    categoryOther: "",
    paymentAccountId: "",
    notes: ""
  });

  useEffect(() => {
    loadCategories();
    loadPaymentAccounts();
  }, []);

  useEffect(() => {
    if (paymentAccounts.length === 0) {
      const t = setTimeout(() => loadPaymentAccounts(), 2000);
      return () => clearTimeout(t);
    }
  }, [paymentAccounts.length]);

  const loadCategories = async () => {
    const res = await getCategories();
    const data = res.data || [];
    setCategories((data || []).sort((a, b) => (a.isDefault ? 0 : 1) - (b.isDefault ? 0 : 1)));
  };

  const loadPaymentAccounts = async () => {
    try {
      let res = await getPaymentAccounts();
      let accounts = res.data || [];
      if (accounts.length === 0) {
        try {
          res = await ensurePaymentDefaults();
          accounts = res.data || [];
        } catch (_) {}
      }
      setPaymentAccounts(accounts);
    } catch (err) {
      console.error("Failed to load payment accounts:", err);
      setPaymentAccounts([]);
    }
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const isOthersSelected = () => {
    const cat = categories.find(c => c.id === Number(expense.categoryId));
    return cat?.name?.toLowerCase() === "others";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: expense.title,
      amount: Number(expense.amount),
      date: expense.date,
      category: { id: Number(expense.categoryId) },
      notes: expense.notes || null
    };
    if (expense.paymentAccountId) {
      payload.paymentAccount = { id: Number(expense.paymentAccountId) };
    }
    if (isOthersSelected() && expense.categoryOther?.trim()) {
      payload.categoryOther = expense.categoryOther.trim();
    }

    await addExpense(payload);

    navigate("/expenses");
  };

  const displayCategories = categories.filter(c => c.isDefault);

  return (
    <div className="form-page">
      <Link to="/expenses" className="back-link">⬅ Back to Expenses</Link>
      <div className="form-card">
        <h2>Add Expense</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" placeholder="Expense title" name="title" value={expense.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input type="number" placeholder="0.00" name="amount" value={expense.amount} onChange={handleChange} step="0.01" required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={expense.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="categoryId" value={expense.categoryId} onChange={handleChange} required>
              <option value="">Select category</option>
              {(displayCategories.length ? displayCategories : categories).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {isOthersSelected() && (
            <div className="form-group">
              <label>Specify (optional)</label>
              <input
                type="text"
                name="categoryOther"
                placeholder="e.g. Gifts, Donations"
                value={expense.categoryOther}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentAccountId" value={expense.paymentAccountId} onChange={handleChange} required>
              <option value="">Select payment method</option>
              {paymentAccounts.map((pa) => (
                <option key={pa.id} value={pa.id}>{pa.name}</option>
              ))}
            </select>
            {paymentAccounts.length === 0 && (
              <span className="form-hint">Cash and Bank will appear after loading. Refresh if needed.</span>
            )}
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea
              name="notes"
              placeholder="Add a note about this expense..."
              value={expense.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <button type="submit">Save Expense</button>
        </form>
      </div>
    </div>
  );
}
