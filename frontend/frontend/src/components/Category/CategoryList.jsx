import { useEffect, useState, useMemo } from "react";
import { getCategories, deleteCategory } from "../../services/categoryService";
import { Link } from "react-router-dom";

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
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ 
        textDecoration: 'none', 
        color: '#4F46E5',
        fontSize: '15px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '15px',
        transition: 'all 0.2s ease',
        padding: '8px 12px',
        borderRadius: '8px'
      }} onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)';
        e.currentTarget.style.transform = 'translateX(-4px)';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}>
        ⬅ Back to Dashboard
      </Link>
      <h2>Categories</h2>

      {error && (
        <div style={{ 
          color: '#d32f2f', 
          padding: '12px', 
          border: '1px solid #d32f2f',
          borderRadius: '4px',
          backgroundColor: '#ffebee',
          marginBottom: '15px'
        }}>
          <p>{error}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Link to="/categories/add">
          <button>Add New Category</button>
        </Link>
        <div style={{ color: '#666' }}>Total: {categories.length} categories</div>
      </div>

      {loading && <p>Loading categories...</p>}

      {!loading && (
        <div style={{ overflowX: 'auto' }}>
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
