import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import { getPaymentAccounts } from "../../services/paymentAccountService";
import { addBudget } from "../../services/budgetService";
import Modal from "../Shared/Modal";
import "../Page.css";

export default function AddBudget() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setLoading(true);
    setErrorMessage("");

    // Validation
    if (!budget.categoryId) {
      setErrorMessage("Please select a category");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!budget.amount || budget.amount <= 0) {
      setErrorMessage("Amount must be greater than 0");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (isNaN(Number(budget.amount)) || Number(budget.amount) <= 0) {
      setErrorMessage("Please enter a valid positive amount");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!budget.month) {
      setErrorMessage("Please select a month");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!budget.year) {
      setErrorMessage("Please select a year");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    try {
      const cat = categories.find((c) => c.id === budget.categoryId || c.id === String(budget.categoryId));
      if (!cat) {
        setErrorMessage("Please select a valid category");
        setShowErrorModal(true);
        setLoading(false);
        return;
      }
      
      const payload = {
        category: cat.name,
        amount: Number(budget.amount),
        month: budget.month,
        year: Number(budget.year)
      };
      if (budget.paymentAccountId) {
        payload.paymentAccount = { id: budget.paymentAccountId };
      }
      
      await addBudget(payload);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/budgets");
      }, 1500);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to add budget. Please try again.");
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
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Budget"}
          </button>
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
        <p>Budget created successfully!</p>
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
