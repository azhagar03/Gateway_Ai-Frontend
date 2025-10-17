import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
    const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://gateway-ai-backend.onrender.com/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const suggestRes = await fetch("https://gateway-ai-backend.onrender.com/api/products");
        const all = await suggestRes.json();
        const filtered = all.filter((p) => p._id !== id);
        setSuggestions(filtered.slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-5">Loading product details...</p>;
  }

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `https://gateway-ai-backend.onrender.com${product.image}`;

      const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate("/checkout", { state: { buyNowProduct: { ...product, qty: 1 } } });
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-6 text-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-primary">₹{product.price?.toFixed(2)}</h4>
          <button
            className="btn btn-primary me-2"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
            <button
            className="btn btn-outline-primary flex-grow-1"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>

      <hr />
      <h4 className="fw-bold mb-4">You might also like</h4>
      <div className="row g-4">
        {suggestions.map((p) => (
          <div key={p._id} className="col-12 col-sm-6 col-md-3">
            <ProductCard product={p} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}
