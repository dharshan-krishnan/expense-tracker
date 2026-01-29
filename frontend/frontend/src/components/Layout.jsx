import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-container">

      <Sidebar />

      <div className="main-content">
        <header className="top-header">
          <h1>Expense Tracker</h1>
        </header>

        <div className="page-content">
          {children}
        </div>
      </div>
      
    </div>
  );
}