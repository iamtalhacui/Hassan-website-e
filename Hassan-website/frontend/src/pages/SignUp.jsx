import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const SignUp = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", adminCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) return setError("All fields are required");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.adminCode);
      navigate("/signin", { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb a1"></div>
        <div className="auth-orb a2"></div>
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <span>◈</span> Hassan<span className="gold">Store</span>
          </Link>
        </div>
        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join thousands of shoppers today</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Hassan Ali" className="form-input" autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className="form-input" autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Minimum 6 characters" className="form-input" autoComplete="new-password" />
          </div>

          <button type="button" className="admin-toggle" onClick={() => setShowAdmin(!showAdmin)}>
            {showAdmin ? "− " : "+ "}Have an admin code?
          </button>

          {showAdmin && (
            <div className="form-group">
              <label className="form-label">Admin Code <span className="optional">(optional)</span></label>
              <input name="adminCode" value={form.adminCode} onChange={handle} placeholder="Enter code if you have one" className="form-input" />
            </div>
          )}

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : "Create Account →"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;