import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Layout from "../components/Layout";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
}