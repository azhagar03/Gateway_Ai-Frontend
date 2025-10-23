import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>Gateway Of AI</h3>
          <p>
            Discover AI tools, prompt libraries, and templates to power your creative & business projects.
          </p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact</h4>
          <p>Email: gatewayai2025@gmail.com</p>
          <p>Email: +91 9042707229</p>
        </div>

        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/p/Gateway-Software-Solutions-61565314764305/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/gatewaysoftwaresolutions/?hl=en" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://in.linkedin.com/company/gateway-software-solutions" target="_blank" rel="noopener noreferrer">
               <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()}, Gateway Of AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
