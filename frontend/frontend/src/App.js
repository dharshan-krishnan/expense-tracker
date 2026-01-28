import { BrowserRouter, Routes, Route } from "react-router-dom";

import CategoryList from "./components/Category/CategoryList";
import AddCategory from "./components/Category/AddCategory";
import Dashboard from "./pages/Dashboard";
import EditCategory from "./components/Category/EditCategory";
import ExpenseList from "./components/Expense/ExpenseList";
import AddExpense from "./components/Expense/AddExpense";
import EditExpense from "./components/Expense/EditExpense";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/reports" element={<Reports />} />
<Route path="/expenses/add" element={<AddExpense />} />
<Route path="/expenses/edit/:id" element={<EditExpense />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
