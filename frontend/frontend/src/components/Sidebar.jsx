import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">💸 Finance</h2>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/budgets">Budgets</Link>
        <Link to="/reports">Reports</Link>
      </nav>
    </div>
  );
}