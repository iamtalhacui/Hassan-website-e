import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ phone: "", address: "" });
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = (e) => {
    e.preventDefault();
    if (!form.phone || !form.address) return setError("Phone and address are required");

    const order = {
      id: `ORD-${Date.now()}`,
      user: user.name || user.email || "Unknown User",
      email: user.email || "unknown@example.com",
      items: cartItems,
      totalPrice: getTotalPrice(),
      phone: form.phone,
      address: form.address,
      paymentMethod: "Cash on Delivery",
      status: "Pending",
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("hs_orders") || "[]");
    orders.push(order);
    localStorage.setItem("hs_orders", JSON.stringify(orders));

    clearCart();
    setPlaced(true);
    setTimeout(() => navigate("/"), 3500);
  };

  if (placed) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Thank you for your order. We'll deliver it to you soon.</p>
          <p className="success-sub">Redirecting you home...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate("/products");
    return null;
  }

  return (
    <div className="page-wrapper">
      <div className="checkout-header">
        <p className="section-eyebrow">Almost there</p>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <div className="checkout-layout">
        {/* Form */}
        <div className="checkout-form-section">
          <h2 className="checkout-section-title">Delivery Details</h2>
          {error && <div className="error-msg" style={{ marginBottom: "1rem" }}>{error}</div>}

          <form onSubmit={placeOrder} className="checkout-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input value={user?.name} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input value={user?.email} disabled className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="e.g. 0300-1234567" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Address *</label>
              <textarea name="address" value={form.address} onChange={handle} placeholder="Street, City, Province" className="form-input" rows={3}></textarea>
            </div>

            <div className="payment-box">
              <h3 className="payment-title">Payment Method</h3>
              <label className="payment-option selected">
                <span className="payment-radio">●</span>
                <span className="payment-icon">💵</span>
                <div className="payment-info">
                  <strong>Cash on Delivery</strong>
                  <small>Pay Rs. {getTotalPrice().toLocaleString()} when you receive your order</small>
                </div>
              </label>
            </div>

            <button type="submit" className="btn-primary place-order-btn">
              Place Order — Rs. {getTotalPrice().toLocaleString()}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div className="co-item-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="co-item-info">
                  <p className="co-item-name">{item.title}</p>
                  <p className="co-item-qty">× {item.quantity}</p>
                </div>
                <p className="co-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="co-total-row">
            <span>Total</span>
            <span>Rs. {getTotalPrice().toLocaleString()}</span>
          </div>
          <p className="co-delivery">🚚 Free delivery included</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;