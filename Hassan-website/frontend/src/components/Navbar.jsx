import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout }    = useContext(AuthContext);
  const { getCartCount }    = useContext(CartContext);
  const location            = useLocation();
  const navigate            = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef             = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (location.pathname === "/" && !user) return null;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropOpen(false);
    navigate("/");
  };

  const cartCount = getCartCount();

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user ? "/products" : "/"} className="nav-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Hassan<span className="logo-accent">Store</span></span>
        </Link>

        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <span className="nav-welcome">
                Welcome, <strong>{user.name.split(" ")[0]}</strong>!
              </span>

              <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>Products</NavLink>

              <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>
                Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </NavLink>

              {user.isAdmin && (
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active admin-link" : "nav-link admin-link"} onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </NavLink>
              )}

              {/* Profile Dropdown */}
              <div className="nav-profile" ref={dropRef}>
                <button className="profile-trigger" onClick={() => setDropOpen(!dropOpen)}>
                  <div className="profile-avatar">{getInitials(user.name)}</div>
                  <span className="profile-name">{user.name.split(" ")[0]}</span>
                  <span className={`profile-arrow ${dropOpen ? "up" : ""}`}>▾</span>
                </button>

                {dropOpen && (
                  <div className="profile-dropdown">
                    {/* Header */}
                    <div className="dropdown-header">
                      <div className="dropdown-avatar-lg">{getInitials(user.name)}</div>
                      <div>
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                        <span className={`dropdown-role-badge ${user.isAdmin ? "admin" : "user"}`}>
                          {user.isAdmin ? "🛡️ Administrator" : "🛒 Customer"}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="dropdown-body">
                      <div className="dropdown-row">
                        <span className="dropdown-label">📧 Email</span>
                        <span className="dropdown-value">{user.email}</span>
                      </div>
                      <div className="dropdown-row">
                        <span className="dropdown-label">👤 Name</span>
                        <span className="dropdown-value">{user.name}</span>
                      </div>
                      {joinDate && (
                        <div className="dropdown-row">
                          <span className="dropdown-label">📅 Joined</span>
                          <span className="dropdown-value">{joinDate}</span>
                        </div>
                      )}
                      {user.isGoogle && (
                        <div className="dropdown-row">
                          <span className="dropdown-label">🔗 Account</span>
                          <span className="dropdown-value google-tag">Google</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="dropdown-footer">
                      {user.isAdmin && (
                        <Link to="/admin/dashboard" className="dropdown-btn admin-btn" onClick={() => { setDropOpen(false); setMenuOpen(false); }}>
                          ◈ Admin Dashboard
                        </Link>
                      )}
                      <button className="dropdown-btn logout-btn" onClick={handleLogout}>
                        ⊗ Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/signin" className="nav-link" onClick={() => setMenuOpen(false)}>Sign In</NavLink>
              <Link to="/signup" className="btn-signup-nav" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;