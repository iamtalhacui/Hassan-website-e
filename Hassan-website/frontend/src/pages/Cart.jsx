import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="cart-empty">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <Link to="/products" className="btn-primary">Browse Products →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="cart-header">
        <div>
          <p className="section-eyebrow">Your Cart</p>
          <h1 className="cart-title">Shopping Cart</h1>
        </div>
        <Link to="/products" className="btn-ghost">← Continue Shopping</Link>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-img-wrap">
                <img src={item.image} alt={item.title} className="item-img" />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.title}</h3>
                <p className="item-desc">{item.description}</p>
                <p className="item-unit-price">Rs. {item.price.toLocaleString()} each</p>
              </div>
              <div className="item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                </div>
                <p className="item-total">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-rows">
            {cartItems.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>{item.title} × {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free-tag">Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {getTotalPrice().toLocaleString()}</span>
            </div>
          </div>
          <button className="btn-primary checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;