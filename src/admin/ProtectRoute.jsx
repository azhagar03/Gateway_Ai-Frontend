import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminLoggedIn }) {
  const token = localStorage.getItem("adminToken");

  // ✅ Check both token and state
  if (!token || !adminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}