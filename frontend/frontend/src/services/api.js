import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Auto attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
