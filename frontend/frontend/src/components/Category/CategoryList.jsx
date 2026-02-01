import { useEffect, useState, useMemo } from "react";
import { getCategories, deleteCategory } from "../../services/categoryService";
import { Link } from "react-router-dom";
import "../Page.css";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      setError("Failed to load categories. Please try again.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete category. Please try again.");
    }
  };

  const sorted = useMemo(() => {
    const list = [...categories];
    list.sort((a, b) => {
      const av = a.name.toLowerCase();
      const bv = b.name.toLowerCase();
      if (av < bv) return sortBy.dir === 'asc' ? -1 : 1;
      if (av > bv) return sortBy.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [categories, sortBy]);

  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  return (
    <div className="page-wrapper">
      <Link to="/" className="back-link">⬅ Back to Dashboard</Link>
      <h2 className="page-title">Categories</h2>

      {error && (
        <div className="page-error">
          <p>{error}</p>
        </div>
      )}

      <div className="page-actions">
        <Link to="/categories/add" className="btn-primary">+ Add New Category</Link>
        <span className="page-summary">Total: {categories.length} categories</span>
      </div>

      {loading && <p>Loading categories...</p>}

      {!loading && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Category {sortBy.key === 'name' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>
                    <Link to={`/categories/edit/${cat.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button className="delete-btn" onClick={() => handleDelete(cat.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
