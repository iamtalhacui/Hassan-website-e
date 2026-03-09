import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const SignIn = () => {
  const { signin, googleLogin } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registered) setSuccess("Account created! Please sign in.");
  }, [location.state]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.email || !form.password) return setError("Email and password are required");
    setLoading(true);
    try {
      await signin(form.email, form.password);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      await googleLogin(credentialResponse.credential);
      navigate("/products");
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to continue shopping</p>
        </div>

        {error   && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        {/* Real Google Login Button */}
        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-in failed. Please try again.")}
            useOneTap={false}
            shape="rectangular"
            theme="filled_black"
            size="large"
            text="continue_with"
            width="360"
          />
        </div>

        <div className="auth-divider"><span>or sign in with email</span></div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com" className="form-input" autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="Your password" className="form-input" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : "Sign In →"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up Free</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;