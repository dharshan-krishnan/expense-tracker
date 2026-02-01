import { useState, useEffect } from "react";
import api from "../../services/api";
import { getPaymentAccounts } from "../../services/paymentAccountService";
import "./Modal.css";

export default function EditBudget({ data, onClose }) {
  const [category, setCategory] = useState(data.category);
  const [amount, setAmount] = useState(data.amount);
  const [month, setMonth] = useState(data.month);
  const [year, setYear] = useState(data.year);
  const [paymentAccountId, setPaymentAccountId] = useState(data.paymentAccount?.id || "");
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPaymentAccounts();
        setPaymentAccounts(res.data || []);
      } catch (err) {
        console.error("Failed to load payment accounts:", err);
      }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { category, amount, month, year };
      if (paymentAccountId) {
        payload.paymentAccount = { id: Number(paymentAccountId) };
      }
      await api.put(`/budgets/${data.id}`, payload);
      onClose();
    } catch (err) {
      console.error("Failed to update budget:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Budget</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentAccountId} onChange={(e) => setPaymentAccountId(e.target.value)}>
              <option value="">Select payment method</option>
              {paymentAccounts.map((pa) => (
                <option key={pa.id} value={pa.id}>{pa.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input value={amount} type="number" step="0.01" onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Month</label>
            <input value={month} onChange={(e) => setMonth(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input value={year} type="number" onChange={(e) => setYear(e.target.value)} required />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
