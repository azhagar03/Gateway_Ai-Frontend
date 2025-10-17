import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductsPage from "./components/ProductsPage";
import ProductPage from "./components/ProductPage";
import Checkout from "./components/Checkout";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsPage from "./components/ProductsDetails";
import ProtectedRoute from "./admin/ProtectRoute";
import { Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const STATIC_PRODUCTS = [
  {
    _id: 1,
    name: "1000 Photography Prompts",
    price: 299,
    image: "/images/photography.png",
    description: "High-quality prompts for creativity.",
  },
  {
    _id: 2,
    name: "Social Media Viral Prompts",
    price: 99,
    image: "/images/socialmedia.png",
    description: "Prebuilt chatbot templates.",
  },
  {
    _id: 3,
    name: "Creative Prompt Designer",
    price: 199,
    image: "/images/creative.png",
    description: "Generate websites with AI.",
  },
  {
    _id: 4,
    name: "Killer 1,00,000+ ChatGPT Prompts",
    price: 199,
    image: "/images/chatgpt.png",
    description: "Create content faster.",
  },
];

export default function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
    const [showLogoutToast, setShowLogoutToast] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Restore login state if token exists (on refresh)
 useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminLoggedIn(true);
    }
  }, []);

  // ✅ Add to Cart
  const handleAddToCart = (product) => {
    if (!product) return;
    setCartOpen(true);
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // ✅ Remove item
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // ✅ Quantity change
  const handleQtyChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // ✅ Detect if current route is admin page
  const isAdminPage =
    location.pathname.startsWith("/admin-login") ||
    location.pathname.startsWith("/admin");

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminLoggedIn(false);
    setShowLogoutToast(true);
    navigate("/admin-login", { replace: true });
  };


  return (
    <>
      {/* Navbar & CartDrawer only on user pages */}
      {!isAdminPage && <Navbar setCartOpen={setCartOpen} />}
      {!isAdminPage && (
        <CartDrawer
          cartItems={cartItems}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          handleRemove={handleRemove}
          handleQtyChange={handleQtyChange}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage products={STATIC_PRODUCTS} onAddToCart={handleAddToCart} />
          }
        />
        <Route
          path="/products"
          element={
            <ProductsPage
              products={STATIC_PRODUCTS}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductPage
              products={STATIC_PRODUCTS}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetailsPage
              products={STATIC_PRODUCTS}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
        <Route path="/contact" element={<ContactUs />} />
 <Route
          path="/admin-login"
          element={
            adminLoggedIn ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin
                onLogin={() => {
                  setAdminLoggedIn(true);
                  navigate("/admin");
                }}
              />
            )
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminLoggedIn={adminLoggedIn}>
              <AdminDashboard onLogout={handleAdminLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminPage && <Footer />}

         <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <Toast
          onClose={() => setShowLogoutToast(false)}
          show={showLogoutToast}
          delay={2000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white fw-semibold">Logged out successfully!</Toast.Body>
        </Toast>
      </div>
    </>
  );
}
