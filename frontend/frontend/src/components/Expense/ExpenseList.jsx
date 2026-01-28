import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExpenses, deleteExpense } from "../../services/expenseService";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data);
    } catch (error) {
      console.error("Failed to load expenses", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>

      <Link to="/expenses/add">
        <button>Add New Expense</button>
      </Link>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.title} - ₹{exp.amount} - {exp.date} - {exp.category?.name}

            <button onClick={() => handleDelete(exp.id)}>Delete</button>

            <Link to={`/expenses/edit/${exp.id}`}>
              <button>Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
