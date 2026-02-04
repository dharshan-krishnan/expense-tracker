import api from "./api";

export const getPaymentAccounts = () => api.get("/api/payment-accounts");
export const ensurePaymentDefaults = () => api.post("/api/payment-accounts/ensure-defaults");
export const getPaymentBalances = () => api.get("/api/payment-accounts/balances");
export const updatePaymentAccount = (id, initialBalance) =>
  api.put(`/api/payment-accounts/${id}`, { initialBalance });
