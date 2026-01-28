import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExpenseById, updateExpense } from "../../services/expenseService";
import { getCategories } from "../../services/categoryService";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    categoryId: "",
  });

  useEffect(() => {
    loadExpense();
    loadCategories();
  }, []);

  const loadExpense = async () => {
    try {
      const res = await getExpenseById(id);
      const exp = res.data;

      setExpense({
        title: exp.title,
        amount: exp.amount,
        date: exp.date,
        categoryId: exp.category.id,
      });
    } catch (e) {
      console.error("Failed to load expense", e);
    }
  };

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX: Preparing correct payload for backend
    const payload = {
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: {
        id: expense.categoryId,  // Backend needs object
      },
    };

    await updateExpense(id, payload);
    navigate("/expenses");
  };

  return (
    <div>
      <h2>Edit Expense</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={expense.title}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
        />

        <select
          name="categoryId"
          value={expense.categoryId}
          onChange={handleChange}
        >
          <option>Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="submit">Update Expense</button>
      </form>
    </div>
  );
}
