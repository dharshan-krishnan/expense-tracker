import api from "./api";

export const getPaymentAccounts = () => api.get("/payment-accounts");
export const ensurePaymentDefaults = () => api.post("/payment-accounts/ensure-defaults");
export const getPaymentBalances = () => api.get("/payment-accounts/balances");
export const updatePaymentAccount = (id, initialBalance) =>
  api.put(`/payment-accounts/${id}`, { initialBalance });
