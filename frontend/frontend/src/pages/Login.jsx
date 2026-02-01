import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Auth.css";

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
      
      if (res.status === 200 && res.data) {
        let token, username;
        
        if (typeof res.data === 'object' && res.data.token) {
          token = res.data.token;
          username = res.data.username;
          
          if (typeof token === 'string' && token.length > 0 && typeof username === 'string' && username.trim().length > 0) {
            login(token, username);
            navigate("/");
          } else {
            setError("Invalid response from server. Please try again.");
          }
        } else if (typeof res.data === 'string' && res.data.length > 0) {
          login(res.data, "User");
          navigate("/");
        } else {
          setError("Invalid login response from server");
        }
      } else {
        setError("Invalid login response from server");
      }
    } catch (err) {
      const errorMessage = err.response?.data || "Login failed. Check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>

      <div className="auth-card">
        {error && (
          <div className="auth-alert auth-alert-error">
            <p>{error}</p>
            <button className="auth-alert-close" onClick={() => setError("")}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              value={form.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={form.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/signup">Create one</a>
        </div>
      </div>
    </div>
  );
}