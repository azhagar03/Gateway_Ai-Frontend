import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = product.image ? `https://gateway-ai-backend.onrender.com${product.image}` : "/default-image.png";
  
  return (
    <div className="product-card">
      <img src={imageUrl} alt={product.name} className="product-img" />
      <h3>{product.name}</h3>
      <p className="desc">{product.description}</p>
      <p className="price">₹{product.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
}
