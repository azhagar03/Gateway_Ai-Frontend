import React, { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function CartManager({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
    setCartOpen(true);
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQtyChange = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max((item.qty || 1) + delta, 1) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  return (
    <>
      {children({
        handleAddToCart,
        cartItems,
        setCartOpen,
      })}

      <CartDrawer
        cartItems={cartItems}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        handleRemove={handleRemove}
        handleQtyChange={handleQtyChange}
      />
    </>
  );
}
