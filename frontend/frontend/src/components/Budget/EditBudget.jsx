import { useState } from "react";

export default function EditBudget({ data, onClose }) {
  const [category, setCategory] = useState(data.category);
  const [amount, setAmount] = useState(data.amount);
  const [month, setMonth] = useState(data.month);
  const [year, setYear] = useState(data.year);

  const handleSave = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8080/api/budgets/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount, month, year })
    });

    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
        <h3>Edit Budget</h3>

        <form onSubmit={handleSave}>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
          <input value={amount} type="number" onChange={(e) => setAmount(e.target.value)} />
          <input value={month} onChange={(e) => setMonth(e.target.value)} />
          <input value={year} type="number" onChange={(e) => setYear(e.target.value)} />

          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
