import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      console.log("Login successful, token:", res.data);
      login(res.data); // JWT token string
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <h2>Sign In</h2>

      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email}
          onChange={handleChange}
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange}
          required 
        />
        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        No account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}