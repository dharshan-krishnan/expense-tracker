import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import { getPaymentAccounts } from "../../services/paymentAccountService";
import { addBudget } from "../../services/budgetService";
import "../Page.css";

export default function AddBudget() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);

  const [budget, setBudget] = useState({
    categoryId: "",
    amount: "",
    month: "",
    year: "",
    paymentAccountId: ""
  });

  useEffect(() => {
    loadCategories();
    loadPaymentAccounts();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const loadPaymentAccounts = async () => {
    try {
      const res = await getPaymentAccounts();
      setPaymentAccounts(res.data || []);
    } catch (err) {
      console.error("Failed to load payment accounts:", err);
      setPaymentAccounts([]);
    }
  };

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cat = categories.find((c) => c.id === parseInt(budget.categoryId));
    const payload = {
      category: cat?.name ?? budget.categoryId,
      amount: Number(budget.amount),
      month: budget.month,
      year: Number(budget.year)
    };
    if (budget.paymentAccountId) {
      payload.paymentAccount = { id: Number(budget.paymentAccountId) };
    }
    await addBudget(payload);

    navigate("/budgets");
  };

  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="form-page">
      <Link to="/budgets" className="back-link">⬅ Back to Budgets</Link>
      <div className="form-card">
        <h2>Add Budget</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select name="categoryId" value={budget.categoryId} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentAccountId" value={budget.paymentAccountId} onChange={handleChange} required>
              <option value="">Select payment method</option>
              {paymentAccounts.map((pa) => (
                <option key={pa.id} value={pa.id}>{pa.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="0.00"
              name="amount"
              value={budget.amount}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Month</label>
            <select name="month" value={budget.month} onChange={handleChange} required>
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select name="year" value={budget.year} onChange={handleChange} required>
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button type="submit">Add Budget</button>
        </form>
      </div>
    </div>
  );
}
