import api from "./api";

export const getExpenses = () => api.get("/api/expenses");

export const addExpense = (expense) => api.post("/api/expenses", expense);

export const deleteExpense = (id) =>
  api.delete(`/api/expenses/${id}`);

export const getExpenseById = (id) =>
  api.get(`/api/expenses/${id}`);

export const updateExpense = (id, expense) =>
  api.put(`/api/expenses/${id}`, expense);

export const getExpenseSummary = () =>
  api.get("/api/expenses/summary");
