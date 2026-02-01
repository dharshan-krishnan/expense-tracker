import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import CategoryList from "./components/Category/CategoryList";
import AddCategory from "./components/Category/AddCategory";
import EditCategory from "./components/Category/EditCategory";

import ExpenseList from "./components/Expense/ExpenseList";
import AddExpense from "./components/Expense/AddExpense";
import EditExpense from "./components/Expense/EditExpense";

import BudgetList from "./components/Budget/BudgetList";
import AddBudget from "./components/Budget/AddBudget";
import EditBudget from "./components/Budget/EditBudget";

import Reports from "./pages/Reports";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
          <Route path="/categories/add" element={<PrivateRoute><AddCategory /></PrivateRoute>} />
          <Route path="/categories/edit/:id" element={<PrivateRoute><EditCategory /></PrivateRoute>} />

          <Route path="/expenses" element={<PrivateRoute><ExpenseList /></PrivateRoute>} />
          <Route path="/expenses/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
          <Route path="/expenses/edit/:id" element={<PrivateRoute><EditExpense /></PrivateRoute>} />

          <Route path="/budgets" element={<PrivateRoute><BudgetList /></PrivateRoute>} />
          <Route path="/budgets/add" element={<PrivateRoute><AddBudget /></PrivateRoute>} />
          <Route path="/budgets/edit/:id" element={<PrivateRoute><EditBudget /></PrivateRoute>} />

          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}