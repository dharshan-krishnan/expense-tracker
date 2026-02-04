import { useEffect, useState } from "react";
import api from "../../services/api";
import "../Manager.css";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Category name is required");
      setLoading(false);
      return;
    }

    try {
      if (editing) {
        await api.put(`/api/categories/${editing}`, form);
      } else {
        await api.post("/api/categories", form);
      }

      setForm({ name: "" });
      setEditing(null);
      loadCategories();
    } catch (err) {
      setError("Failed to save category");
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

  const handleDelete = async (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat?.isDefault) {
      alert("Cannot delete default category");
      return;
    }
    if (window.confirm("Are you sure? This will affect related expenses and budgets.")) {
      try {
        await api.delete(`/api/categories/${id}`);
        loadCategories();
      } catch (err) {
        setError("Failed to delete category");
      }
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
                          onClick={() => handleDelete(cat.id)}
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
    </div>
  );
}
