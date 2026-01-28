import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../services/categoryService";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await getCategories();
    setCategories(response.data);
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:8080/api/categories/${id}`);
        loadCategories();   // refresh the list
    } catch (error) {
        console.error("Delete failed", error);
    }
};
  return (
    <div>
      <h2>Categories</h2>

      <Link to="/categories/add">
        <button>Add New Category</button>
      </Link>

      <ul>
  {categories.map((cat) => (
    <li key={cat.id}>
      {cat.name}

      <button onClick={() => handleDelete(cat.id)}>Delete</button>

      <Link to={`/categories/edit/${cat.id}`}>
        <button>Edit</button>
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
}
