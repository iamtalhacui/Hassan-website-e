import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("All fields are required");
    setLoading(true);
    try {
      const user = await signin(form.email, form.password);
      if (!user.isAdmin) {
        setError("Access denied. Admin accounts only.");
        setLoading(false);
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="al-bg">
        <div className="al-grid"></div>
        <div className="al-orb al-orb1"></div>
        <div className="al-orb al-orb2"></div>
      </div>

      <div className="al-left">
        <div className="al-brand">
          <span className="al-logo-icon">◈</span>
          <span className="al-logo-text">Hassan<span>Store</span></span>
        </div>
        <h1 className="al-headline">Admin<br />Control<br />Center</h1>
        <p className="al-tagline">Manage your store, products, orders and users from one powerful dashboard.</p>
        <div className="al-features">
          <div className="al-feat"><span>📦</span> Product Management</div>
          <div className="al-feat"><span>📋</span> Order Tracking</div>
          <div className="al-feat"><span>👥</span> User Management</div>
          <div className="al-feat"><span>📊</span> Sales Analytics</div>
        </div>
      </div>

      <div className="al-right">
        <div className="al-card">
          <div className="al-card-header">
            <div className="al-shield">🛡️</div>
            <h2 className="al-card-title">Admin Access</h2>
            <p className="al-card-sub">Sign in with your admin credentials</p>
          </div>

          {error && <div className="al-error">{error}</div>}

          <form onSubmit={submit} className="al-form">
            <div className="al-field">
              <label className="al-label">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="admin@hassanstore.com"
                className="al-input"
                autoComplete="email"
              />
            </div>
            <div className="al-field">
              <label className="al-label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                className="al-input"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="al-btn" disabled={loading}>
              {loading ? <span className="al-spinner"></span> : "Access Dashboard →"}
            </button>
          </form>

          <p className="al-back">
            Not an admin? <a href="/signin" className="al-link">Go to Store →</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;