import { useEffect, useState } from "react";
import api from "../../services/api";
import { getPaymentAccounts } from "../../services/paymentAccountService";
import Modal from "../Shared/Modal";
import ConfirmModal from "../Shared/ConfirmModal";
import "../Manager.css";

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", month: "", year: "", paymentAccount: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBudgets();
    loadCategories();
    loadPaymentAccounts();
  }, []);

  const loadBudgets = async () => {
    try {
      const res = await api.get("/api/budgets");
      if (res.data && Array.isArray(res.data)) {
        setBudgets(res.data);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setError("Failed to load budgets. Please try again.");
      setBudgets([]);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.category) {
      setErrorMessage("Please select a category");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!form.amount || form.amount <= 0) {
      setErrorMessage("Amount must be greater than 0");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setErrorMessage("Please enter a valid positive amount");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!form.month) {
      setErrorMessage("Please select a month");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (!form.year) {
      setErrorMessage("Please select a year");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    try {
      const categoryObj = categories.find(c => c.id === form.category || c.id === String(form.category));
      if (!categoryObj) {
        setErrorMessage("Please select a valid category");
        setShowErrorModal(true);
        setLoading(false);
        return;
      }
      const data = {
        category: categoryObj.name,
        amount: parseFloat(form.amount),
        month: form.month,
        year: parseInt(form.year)
      };
      if (form.paymentAccount) {
        data.paymentAccount = { id: form.paymentAccount };
      }

      if (editing) {
        await api.put(`/api/budgets/${editing}`, data);
        setShowSuccessModal(true);
      } else {
        await api.post("/api/budgets", data);
        setShowSuccessModal(true);
      }

      setForm({ category: "", amount: "", month: "", year: "", paymentAccount: "" });
      setEditing(null);
      loadBudgets();
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to save budget. Please try again.");
      setShowErrorModal(true);
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
      year: budget.year,
      paymentAccount: budget.paymentAccount?.id || ""
    });
    setEditing(budget.id);
  };

  const handleDeleteClick = (id) => {
    const budget = budgets.find(b => b.id === id);
    setBudgetToDelete({ id, category: budget?.category || "this budget" });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!budgetToDelete) return;
    
    try {
      await api.delete(`/api/budgets/${budgetToDelete.id}`);
      loadBudgets();
      setShowDeleteModal(false);
      setBudgetToDelete(null);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to delete budget. Please try again.");
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setForm({ category: "", amount: "", month: "", year: "", paymentAccount: "" });
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

            <select
              name="paymentAccount"
              value={form.paymentAccount}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              {paymentAccounts.map(pa => (
                <option key={pa.id} value={pa.id}>{pa.name}</option>
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
                      <span className="payment-badge">{budget.paymentAccount?.name || "-"}</span>
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
                      onClick={() => handleDeleteClick(budget.id)}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBudgetToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget for "${budgetToDelete?.category}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        type="success"
      >
        <p>{editing ? "Budget updated successfully!" : "Budget created successfully!"}</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => setShowSuccessModal(false)}>OK</button>
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
