import { useState, useEffect } from "react";
import { addExpense } from "../../services/expenseService";
import { getCategories } from "../../services/categoryService";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    categoryId: ""
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addExpense({
      title: expense.title,
      amount: Number(expense.amount),
      date: expense.date,
      category: { id: Number(expense.categoryId) }  // FIXED
    });

    navigate("/expenses");
  };

  return (
    <div>
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" name="title" onChange={handleChange} />
        <input type="number" placeholder="Amount" name="amount" onChange={handleChange} />
        <input type="date" name="date" onChange={handleChange} />

        <select name="categoryId" onChange={handleChange} required>
          <option>Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
