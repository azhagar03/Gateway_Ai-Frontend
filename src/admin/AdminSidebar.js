import React from "react";

export default function AdminSidebar({ active, setActive }) {
  return (
    <div className="admin-sidebar">
      <button
        className={active === "adminProducts" ? "active" : ""}
        onClick={() => setActive("adminProducts")}
      >
        Products
      </button>
      <button
        className={active === "adminOrders" ? "active" : ""}
        onClick={() => setActive("adminOrders")}
      >
        Orders
      </button>
      <button
        className={active === "adminContacts" ? "active" : ""}
        onClick={() => setActive("adminContacts")}
      >
        Contacts
      </button>
    </div>
  );
}
