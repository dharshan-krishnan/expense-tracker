import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-expanded={!collapsed}>
      <div className="sidebar-top">
        <button
          className={`hamburger ${collapsed ? "is-closed" : "is-open"}`}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          <span />
          <span />
          <span />
        </button>

        <h2 className="logo">💸 <span className="logo-text">Finance</span></h2>
      </div>

      <nav>
        <Link to="/" className="nav-item" title="Dashboard">
          <span className="icon">📊</span>
          <span className="label">Dashboard</span>
        </Link>

        <Link to="/expenses" className="nav-item" title="Expenses">
          <span className="icon">💸</span>
          <span className="label">Expenses</span>
        </Link>

        <Link to="/categories" className="nav-item" title="Categories">
          <span className="icon">📂</span>
          <span className="label">Categories</span>
        </Link>

        <Link to="/budgets" className="nav-item" title="Budgets">
          <span className="icon">💵</span>
          <span className="label">Budgets</span>
        </Link>

        <Link to="/reports" className="nav-item" title="Reports">
          <span className="icon">📈</span>
          <span className="label">Reports</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 <span className="label">Logout</span>
        </button>
      </div>
    </div>
  );
}