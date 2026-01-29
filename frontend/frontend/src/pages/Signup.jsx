import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/auth/signup", form);
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button>Sign Up</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
