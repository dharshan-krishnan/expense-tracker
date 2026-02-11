import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "./Auth.css"; // Reuse auth styles

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
            <div className="auth-card">
                {message && <div className="auth-alert auth-alert-success">{message}</div>}
                {error && <div className="auth-alert auth-alert-error">{error}</div>}

                <p className="auth-description">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
