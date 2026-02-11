import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getExpenseById, updateExpense } from "../../services/expenseService";
import { getCategories } from "../../services/categoryService";
import { getPaymentAccounts, ensurePaymentDefaults } from "../../services/paymentAccountService";
import Modal from "../Shared/Modal";
import "../Page.css";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // -----------------------------
  // FIXED: useCallback for ESLint
  // -----------------------------

  const loadExpense = useCallback(async () => {
    try {
      const res = await getExpenseById(id);
      const exp = res.data;

      setExpense({
        title: exp.title,
        amount: exp.amount,
        date: exp.date ? exp.date.split("T")[0] : "",
        categoryId: exp.category?.id ?? "",
        categoryOther: exp.categoryOther ?? "",
        paymentAccountId: exp.paymentAccount?.id ?? "",
        notes: exp.notes ?? ""
      });
    } catch (e) {
      console.error("Failed to load expense", e);
    }
  }, [id]);

  const loadCategories = useCallback(async () => {
    const res = await getCategories();
    setCategories((res.data || []).sort((a, b) => (a.isDefault ? 0 : 1) - (b.isDefault ? 0 : 1)));
  }, []);

  const loadPaymentAccounts = useCallback(async () => {
    try {
      let res = await getPaymentAccounts();
      let accounts = res.data || [];

      if (accounts.length === 0) {
        try {
          res = await ensurePaymentDefaults();
          accounts = res.data || [];
        } catch (_) { }
      }

      setPaymentAccounts(accounts);
    } catch (err) {
      console.error("Failed to load payment accounts:", err);
      setPaymentAccounts([]);
    }
  }, []);

  // -----------------------------
  // FIXED: useEffect dependencies
  // -----------------------------

  useEffect(() => {
    loadExpense();
    loadCategories();
    loadPaymentAccounts();
  }, [loadExpense, loadCategories, loadPaymentAccounts]);

  useEffect(() => {
    if (paymentAccounts.length === 0) {
      const t = setTimeout(() => loadPaymentAccounts(), 2000);
      return () => clearTimeout(t);
    }
  }, [paymentAccounts.length, loadPaymentAccounts]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const isOthersSelected = () => {
    const cat = categories.find(
      (c) => c.id === expense.categoryId || c.id === String(expense.categoryId)
    );
    return cat?.name?.toLowerCase() === "others";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Validation
    if (!expense.title?.trim()) {
      setErrorMessage("Expense title is required");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!expense.amount || expense.amount <= 0) {
      setErrorMessage("Amount must be greater than 0");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (isNaN(Number(expense.amount)) || Number(expense.amount) <= 0) {
      setErrorMessage("Please enter a valid positive amount");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!expense.date) {
      setErrorMessage("Date is required");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!expense.categoryId) {
      setErrorMessage("Please select a category");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: expense.title.trim(),
        amount: Number(expense.amount),
        date: expense.date,
        category: { id: expense.categoryId },
        notes: expense.notes?.trim() || null
      };

      if (expense.paymentAccountId) {
        payload.paymentAccount = { id: expense.paymentAccountId };
      }

      if (isOthersSelected() && expense.categoryOther?.trim()) {
        payload.categoryOther = expense.categoryOther.trim();
      }

      await updateExpense(id, payload);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/expenses");
      }, 1500);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to update expense. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <Link to="/expenses" className="back-link">⬅ Back to Expenses</Link>
      <div className="form-card">
        <h2>Edit Expense</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Expense title"
              name="title"
              value={expense.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="0.00"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="categoryId"
              value={expense.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {(categories.filter(c => c.isDefault).length ? categories.filter(c => c.isDefault) : categories).map((c) => (
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
            <select
              name="paymentAccountId"
              value={expense.paymentAccountId}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              {paymentAccounts.map((pa) => (
                <option key={pa.id} value={pa.id}>{pa.name}</option>
              ))}
            </select>

            {paymentAccounts.length === 0 && (
              <span className="form-hint">
                Cash and Bank will appear after loading. Refresh if needed.
              </span>
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

          <div className="form-buttons-row">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Expense"}
            </button>
            <Link to="/expenses" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/expenses");
        }}
        title="Success"
        type="success"
      >
        <p>Expense updated successfully!</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => {
            setShowSuccessModal(false);
            navigate("/expenses");
          }}>OK</button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        type="error"
      >
        <p>{errorMessage}</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => setShowErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  );
}
