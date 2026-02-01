import { useState } from "react";
import { addCategory } from "../../services/categoryService";
import { useNavigate, Link } from "react-router-dom";
import "../Page.css";

export default function AddCategory() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name };

    await addCategory(data);

    navigate("/categories");
  };

  return (
    <div className="form-page">
      <Link to="/categories" className="back-link">⬅ Back to Categories</Link>
      <div className="form-card">
        <h2>Add Category</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="e.g. Food, Transport"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Category</button>
        </form>
      </div>
    </div>
  );
}
