import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBudget as getBudgetById, updateBudget } from "../../services/budgetService";
import { getPaymentAccounts } from "../../services/paymentAccountService";
import { getCategories } from "../../services/categoryService";
import Modal from "../Shared/Modal";
import "../Page.css";

export default function EditBudget() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState(""); // Store category name from budget
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [paymentAccountId, setPaymentAccountId] = useState("");
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBudget = useCallback(async () => {
    try {
      const res = await getBudgetById(id);
      const budget = res.data;

      setAmount(budget.amount || "");
      setMonth(budget.month || "");
      setYear(budget.year || "");
      setPaymentAccountId(budget.paymentAccount?.id || "");
      setCategoryName(budget.category || ""); // Store category name
    } catch (err) {
      console.error("Failed to load budget:", err);
      setErrorMessage("Failed to load budget. Please try again.");
      setShowErrorModal(true);
    }
  }, [id]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  const loadPaymentAccounts = useCallback(async () => {
    try {
      const res = await getPaymentAccounts();
      setPaymentAccounts(res.data || []);
    } catch (err) {
      console.error("Failed to load payment accounts:", err);
      setPaymentAccounts([]);
    }
  }, []);

  useEffect(() => {
    loadBudget();
    loadCategories();
    loadPaymentAccounts();
  }, [loadBudget, loadCategories, loadPaymentAccounts]);

  // Set category ID when both categoryName and categories are available
  useEffect(() => {
    if (categoryName && categories.length > 0) {
      const category = categories.find(c => c.name === categoryName);
      if (category) {
        setCategoryId(category.id);
      }
    }
  }, [categoryName, categories]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Validation
    if (!categoryId) {
      setErrorMessage("Please select a category");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage("Amount must be greater than 0");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage("Please enter a valid positive amount");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!month) {
      setErrorMessage("Please select a month");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!year) {
      setErrorMessage("Please select a year");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    try {
      const categoryObj = categories.find(c => c.id === categoryId || c.id === String(categoryId));
      if (!categoryObj) {
        setErrorMessage("Please select a valid category");
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const payload = {
        category: categoryObj.name,
        amount: Number(amount),
        month: month,
        year: Number(year)
      };

      if (paymentAccountId) {
        payload.paymentAccount = { id: paymentAccountId };
      }

      await updateBudget(id, payload);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/budgets");
      }, 1500);
    } catch (err) {
      console.error("Failed to update budget:", err);
      setErrorMessage(err.response?.data || "Failed to update budget. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="form-page">
      <Link to="/budgets" className="back-link">⬅ Back to Budgets</Link>
      <div className="form-card">
        <h2>Edit Budget</h2>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} required>
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="form-buttons-row">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/budgets" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/budgets");
        }}
        title="Success"
        type="success"
      >
        <p>Budget updated successfully!</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => {
            setShowSuccessModal(false);
            navigate("/budgets");
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
