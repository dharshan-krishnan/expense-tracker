import { useEffect, useState } from "react";
import { updateCategory, getCategories } from "../../services/categoryService";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    const res = await getCategories();
    const category = res.data.find((c) => c.id === parseInt(id));
    setName(category.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateCategory(id, { name });

    navigate("/categories");
  };

  return (
    <div>
      <h2>Edit Category</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
