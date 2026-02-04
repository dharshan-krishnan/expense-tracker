import { useEffect, useState } from "react";
import api from "../../services/api";
import { updatePaymentAccount } from "../../services/paymentAccountService";
import "./BalanceOverview.css";

export default function BalanceOverview() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAccount, setEditingAccount] = useState(null);
  const [initialBalance, setInitialBalance] = useState("");

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSaveInitialBalance = async () => {
    if (!editingAccount) return;
    try {
      await updatePaymentAccount(editingAccount.id, parseFloat(initialBalance) || 0);
      setEditingAccount(null);
      setInitialBalance("");
      loadSummary();
    } catch (err) {
      console.error("Failed to update balance:", err);
    }
  };

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load dashboard summary:", err);
      setError("Failed to load balances");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="balance-loading">Loading balances...</div>;
  if (error) return <div className="balance-error">{error}</div>;
  if (!summary) return null;

  const { totalBudget, totalExpense, availableBalance, budgetDetails, paymentBalances } = summary;

  return (
    <div className="balance-overview">
      <div className="balance-cards">
        <div className="balance-card budget-card">
          <span className="balance-label">Total Budget</span>
          <span className="balance-value">₹{Number(totalBudget).toFixed(2)}</span>
        </div>
        <div className="balance-card expense-card">
          <span className="balance-label">Total Expenses</span>
          <span className="balance-value">₹{Number(totalExpense).toFixed(2)}</span>
        </div>
        <div className="balance-card available-card">
          <span className="balance-label">Available Balance</span>
          <span className="balance-value">₹{Number(availableBalance).toFixed(2)}</span>
        </div>
      </div>

      {paymentBalances && paymentBalances.length > 0 && (
        <div className="payment-balances">
          <h4>Payment Accounts</h4>
          <div className="payment-cards">
            {paymentBalances.map((acc) => (
              <div key={acc.id} className="payment-card">
                <div className="payment-card-info">
                  <span className="payment-name">{acc.name}</span>
                  <span className={`payment-amount ${acc.balance >= 0 ? "positive" : "negative"}`}>
                    ₹{Number(acc.balance).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="payment-edit-btn"
                  onClick={() => {
                    setEditingAccount(acc);
                    setInitialBalance(acc.initialBalance != null ? String(acc.initialBalance) : "0");
                  }}
                  title="Set initial balance"
                >
                  ⚙️
                </button>
              </div>
            ))}
          </div>
          {editingAccount && (
            <div className="payment-edit-modal">
              <div className="payment-edit-content">
                <h5>Set initial balance for {editingAccount.name}</h5>
                <input
                  type="number"
                  step="0.01"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0.00"
                />
                <div className="payment-edit-actions">
                  <button type="button" onClick={handleSaveInitialBalance}>Save</button>
                  <button type="button" className="btn-secondary" onClick={() => { setEditingAccount(null); setInitialBalance(""); }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {budgetDetails && budgetDetails.length > 0 && (
        <div className="budget-breakdown">
          <h4>Budget by Category (This Month)</h4>
          <div className="budget-rows">
            {budgetDetails.map((row, idx) => (
              <div key={idx} className="budget-row">
                <span className="budget-cat">{row.category}</span>
                <span className="budget-spent">₹{Number(row.spent).toFixed(2)}</span>
                <span className="budget-total">/ ₹{Number(row.budget).toFixed(2)}</span>
                <span className={`budget-avail ${row.available >= 0 ? "ok" : "over"}`}>
                  {row.available >= 0 ? "₹" + Number(row.available).toFixed(2) + " left" : "₹" + Math.abs(row.available).toFixed(2) + " over"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
