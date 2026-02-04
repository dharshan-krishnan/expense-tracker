import { useEffect, useState } from "react";
import { updateCategory, getCategories } from "../../services/categoryService";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../Page.css";

export default function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    const res = await getCategories();
    const category = res.data.find((c) => c.id === id || c.id === String(id));
    if (category) setName(category.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateCategory(id, { name });

    navigate("/categories");
  };

  return (
    <div className="form-page">
      <Link to="/categories" className="back-link">⬅ Back to Categories</Link>
      <div className="form-card">
        <h2>Edit Category</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-buttons-row">
            <button type="submit">Save Changes</button>
            <Link to="/categories" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
