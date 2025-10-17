// src/admin/AdminDashboard.js
import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import ProductManager from "./ProductManager";
import OrderManager from "./OrderManager";
import ContactManager from "./ContactManager";
import "./Admin.css";

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("products"); 

  const renderSection = () => {
    switch (activeSection) {
      case "adminProducts":
        return <ProductManager onLogout={onLogout}/>;
      case "adminOrders":
        return <OrderManager onLogout={onLogout}/>;
      case "adminContacts":
        return <ContactManager onLogout={onLogout}/>;
      default:
        return <ProductManager onLogout={onLogout}/>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar active={activeSection} setActive={setActiveSection} onLogout={onLogout}/>
      <div className="admin-content">{renderSection()}</div>
    </div>
  );
}
