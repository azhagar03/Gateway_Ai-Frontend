import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  if (!product) return null;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://gateway-ai-backend.onrender.com${product.image}`
    : "/default-image.png";

 const handleAddToCart = (e) => {
  e.stopPropagation();
  if (onAddToCart) onAddToCart({ ...product, qty: 1 }); // ensure qty included
};

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate("/checkout", { state: { buyNowProduct: { ...product, qty: 1 } } });
  };

  return (
    <div
      className="card h-100 bg-light shadow-sm border-0 rounded-3 overflow-hidden position-relative"
      style={{ cursor: "pointer", transition: "transform 0.3s" }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={imageUrl}
        alt={product.name}
        className="card-img-top mt-2"
        style={{
          objectFit: "contain",
          height: "200px",
          transition: "transform 0.3s",
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{product.name}</h5>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-primary">
            ₹{product.price?.toFixed(2) ?? "0.00"}
          </span>
        </div>
        <div className="d-flex gap-2">
          {onAddToCart && (
            <button
              className="btn submit-btn text-light flex-grow-1"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
          <button
            className="btn btn-outline-primary flex-grow-1"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
