import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../Shared/Modal";
import ConfirmModal from "../Shared/ConfirmModal";
import "../Manager.css";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

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
      setError("Failed to load categories. Please try again.");
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    setForm({ name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name.trim()) {
      setErrorMessage("Category name is required");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (form.name.trim().length > 50) {
      setErrorMessage("Category name must be 50 characters or less");
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    try {
      if (editing) {
        await api.put(`/api/categories/${editing}`, form);
        setShowSuccessModal(true);
      } else {
        await api.post("/api/categories", form);
        setShowSuccessModal(true);
      }

      setForm({ name: "" });
      setEditing(null);
      loadCategories();
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to save category. Please try again.");
      setShowErrorModal(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    if (category.isDefault) return;
    setForm({ name: category.name });
    setEditing(category.id);
  };

  const handleDeleteClick = (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat?.isDefault) {
      setErrorMessage("Cannot delete default category");
      setShowErrorModal(true);
      return;
    }
    setCategoryToDelete({ id, name: cat?.name || "this category" });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await api.delete(`/api/categories/${categoryToDelete.id}`);
      loadCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to delete category. Please try again.");
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: "" });
    setEditing(null);
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>📂 Category Manager</h2>
        <div className="total-amount">Total Categories: {categories.length}</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="manager-container">
        <div className="form-section">
          <h3>{editing ? "Edit Category" : "Add New Category"}</h3>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Category Name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength="50"
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
          <h3>All Categories ({categories.length})</h3>
          
          {categories.length === 0 ? (
            <p className="empty-state">No categories yet. Create one to organize your expenses! 🏷️</p>
          ) : (
            <div className="category-list">
              {categories.map((cat, index) => (
                <div key={cat.id} className={`category-item ${cat.isDefault ? "default-cat" : ""}`}>
                  <div className="category-info">
                    <div className="category-number">#{index + 1}</div>
                    <div className="category-name">
                      {cat.name}
                      {cat.isDefault && <span className="default-badge">Default</span>}
                    </div>
                  </div>
                  <div className="category-actions">
                    {!cat.isDefault && (
                      <>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(cat)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick(cat.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
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
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This will affect related expenses and budgets. This action cannot be undone.`}
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
        <p>{editing ? "Category updated successfully!" : "Category created successfully!"}</p>
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
