import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoryService";

export default function AddBudget() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [budget, setBudget] = useState({
    categoryId: "",
    amount: "",
    month: "",
    year: ""
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8080/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: budget.categoryId,
        amount: Number(budget.amount),
        month: budget.month,
        year: Number(budget.year)
      })
    });

    navigate("/budgets");
  };

  return (
    <div>
      <h2>Add Budget</h2>

      <form onSubmit={handleSubmit}>
        <select name="categoryId" onChange={handleChange} required>
          <option>Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          name="amount"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Month"
          name="month"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          placeholder="Year"
          name="year"
          onChange={handleChange}
          required
        />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}
