import { useState } from "react";
import api from "../services/api";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./Auth.css"; // Reuse auth styles

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/api/auth/reset-password", { token, newPassword: password });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-alert auth-alert-error">
                        Invalid or missing token. Please request a new password reset link.
                    </div>
                    <Link to="/forgot-password">Request Reset Link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <div className="auth-card">
                {message && <div className="auth-alert auth-alert-success">{message}</div>}
                {error && <div className="auth-alert auth-alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
