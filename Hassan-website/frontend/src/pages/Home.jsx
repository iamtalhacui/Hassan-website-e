import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

const features = [
  {
    icon: "🚚",
    title: "Express Delivery",
    desc: "Get your orders delivered to your doorstep within 24–48 hours across Pakistan.",
  },
  {
    icon: "🔒",
    title: "Secure Shopping",
    desc: "Your data is always protected. We use industry-standard encryption for all transactions.",
  },
  {
    icon: "✨",
    title: "Premium Quality",
    desc: "Every product is carefully sourced and quality-checked before it reaches you.",
  },
  {
    icon: "💳",
    title: "Easy Payments",
    desc: "Cash on delivery available. No hidden fees, no surprises at checkout.",
  },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Special Home Navbar */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo">
            <span className="logo-icon">◈</span>
            <span className="logo-txt">Hassan<span>Store</span></span>
          </div>
          <div className="home-header-actions">
            {user ? (
              <Link to="/products" className="home-btn-primary">Browse Products →</Link>
            ) : (
              <>
                <Link to="/signin" className="home-btn-ghost">Sign In</Link>
                <Link to="/signup" className="home-btn-primary">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">✦ Pakistan's Premium E-Store</div>
          <h1 className="hero-title">
            Shop the <span className="gold-text">finest</span><br />
            products online
          </h1>
          <p className="hero-sub">
            Discover curated collections of fashion, electronics, and lifestyle products —
            delivered fast, with zero hassle.
          </p>
          <div className="hero-actions">
            {user ? (
              <button className="home-btn-primary large" onClick={() => navigate("/products")}>
                Browse Products →
              </button>
            ) : (
              <>
                <Link to="/signup" className="home-btn-primary large">Get Started Free</Link>
                <Link to="/signin" className="home-btn-ghost large">Sign In</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat"><span>500+</span><small>Products</small></div>
            <div className="stat-divider"></div>
            <div className="stat"><span>10k+</span><small>Customers</small></div>
            <div className="stat-divider"></div>
            <div className="stat"><span>99%</span><small>Satisfaction</small></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float card-a">
            <span>🛍️</span>
            <div><strong>New Arrival</strong><small>Air Runner Pro</small></div>
          </div>
          <div className="hero-card-float card-b">
            <span>⭐</span>
            <div><strong>4.9 Rating</strong><small>Verified buyers</small></div>
          </div>
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop"
              alt="Store"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-inner">
          <div className="features-header">
            <p className="section-eyebrow">Why Choose Us</p>
            <h2 className="features-title">Built for a better<br />shopping experience</h2>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-name">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-content">
            <h2 className="cta-title">Ready to start shopping?</h2>
            <p className="cta-sub">Join thousands of happy customers across Pakistan</p>
            {!user && (
              <Link to="/signup" className="home-btn-primary large">
                Create Your Account →
              </Link>
            )}
            {user && (
              <Link to="/products" className="home-btn-primary large">
                Shop Now →
              </Link>
            )}
          </div>
          <div className="cta-orbs">
            <div className="cta-orb"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="logo-icon">◈</span>
            <span>Hassan<span>Store</span></span>
          </div>
          <p className="footer-text">© 2026 Hassan Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;