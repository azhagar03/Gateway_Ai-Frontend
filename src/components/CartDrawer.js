import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer({
  cartItems = [],
  cartOpen,
  setCartOpen,
  handleRemove,
  handleQtyChange,
}) {
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const goToCheckout = () => {
    setCartOpen(false);
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h3>🛒 Your Cart</h3>
        <button className="close-btn" onClick={() => setCartOpen(false)}>
          ✕
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `https://gateway-ai-backend.onrender.com${item.image}`
                }
                alt={item.name}
              />
              <div className="info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                <div className="qty-controls">
                  <button onClick={() => handleQtyChange(item._id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => handleQtyChange(item._id, 1)}>+</button>
                </div>

                <button
                  className="remove"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-footer">
            <h4>Total: ₹{total.toFixed(2)}</h4>
            <button className="checkout-btn" onClick={goToCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
