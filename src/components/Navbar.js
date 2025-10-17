import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ setCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav-wrap">
      <div className="container nav-row">
        <Link to="/" className="brand">Gateway Of AI</Link>

        {/* Hamburger button */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav links */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-cart" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="nav-cart" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/contact" className="nav-cart" onClick={() => setMenuOpen(false)}>Contact</Link>
          <button
            onClick={() => {
              setCartOpen(true);
              setMenuOpen(false);
            }}
            className="nav-cart"
          >
            Cart
          </button>
        </nav>
      </div>
    </header>
  );
}
