import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getExpenses, deleteExpense } from "../../services/expenseService";
import ConfirmModal from "../Shared/ConfirmModal";
import Modal from "../Shared/Modal";
import "../Page.css";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: "date", dir: "desc" });
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getExpenses();
      if (Array.isArray(res.data)) {
        setExpenses(res.data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setError("Failed to load expenses. Please try again.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    const expense = expenses.find(e => e.id === id);
    setExpenseToDelete({ id, title: expense?.title || "this expense" });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    
    try {
      await deleteExpense(expenseToDelete.id);
      loadExpenses();
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMessage(error.response?.data || "Failed to delete expense. Please try again.");
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

  const sorted = useMemo(() => {
    const list = [...expenses];
    list.sort((a, b) => {
      const key = sortBy.key;
      let av = a[key];
      let bv = b[key];

      if (key === "date") {
        av = new Date(a.date);
        bv = new Date(b.date);
        return sortBy.dir === "asc" ? av - bv : bv - av;
      }

      if (key === "amount") {
        return sortBy.dir === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }

      av = av?.toString?.().toLowerCase() || "";
      bv = bv?.toString?.().toLowerCase() || "";
      if (av < bv) return sortBy.dir === "asc" ? -1 : 1;
      if (av > bv) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [expenses, sortBy]);

  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0).toFixed(2);

  return (
    <div className="page-wrapper">
      <Link to="/" className="back-link">⬅ Back to Dashboard</Link>
      <h2 className="page-title">Expenses</h2>

      {error && (
        <div className="page-error">
          <p>{error}</p>
        </div>
      )}

      <div className="page-actions">
        <Link to="/expenses/add" className="btn-primary">+ Add New Expense</Link>
        <span className="page-summary">Total: ₹{total}</span>
      </div>

      {loading && <p>Loading expenses...</p>}

      {!loading && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('title')}>Title {sortBy.key === 'title' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th onClick={() => toggleSort('amount')}>Amount {sortBy.key === 'amount' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th onClick={() => toggleSort('date')}>Date {sortBy.key === 'date' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td className="amount-expense">₹{exp.amount.toFixed(2)}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>
                    {exp.category?.name || '-'}
                    {exp.categoryOther ? ` (${exp.categoryOther})` : ''}
                    {exp.notes && ' 📝'}
                  </td>
                  <td>{exp.paymentAccount?.name || '-'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link to={`/expenses/edit/${exp.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button className="delete-btn" onClick={() => handleDeleteClick(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />

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
