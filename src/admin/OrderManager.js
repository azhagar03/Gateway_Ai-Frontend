import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://gateway-ai-backend.onrender.com/api/orders");
      const data = await res.json();
      console.log("order data", data);
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  // ✅ Delete order by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`https://gateway-ai-backend.onrender.com/api/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        toast.success("Order deleted successfully ✅");
      } else {
        toast.error("Failed to delete order ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting order ❌");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">
          <i className="bi bi-cart-check-fill me-2 text-primary"></i>
          All Orders
        </h2>
        {/* <span className="badge bg-primary fs-6">
          Total: {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span> */}
      </div>
   {orders.length > 0 && (
        <div className="row mt-4 mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Orders</h5>
                <h2 className="mb-0">{orders.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Paid Orders</h5>
                <h2 className="mb-0">
                  {orders.filter(o => o.paymentStatus === "Paid").length}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-warning text-dark">
              <div className="card-body">
                <h5 className="card-title">Pending Orders</h5>
                <h2 className="mb-0">
                  {orders.filter(o => o.paymentStatus === "Pending").length}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm border-0 bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Total Revenue</h5>
                <h2 className="mb-0">
                  ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "50px" }} className="text-center">S.No</th>
                  <th style={{ width: "150px" }}>Name</th>
                  <th style={{ width: "250px" }}>Email</th>
                  <th style={{ width: "150px" }}>Phone</th>
                  <th style={{ width: "100px" }} className="text-center">Total</th>
                  <th style={{ width: "100px" }} className="text-center">Status</th>
                  <th style={{ minWidth: "200px" }}>Items</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <div>No orders found</div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order._id} className="border-bottom">
                      <td className="text-center fw-semibold">{index + 1}</td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {order.firstName} {order.lastName}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="bi bi-envelope me-1"></i>
                          {order.email}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i>
                          {order.phone}
                        </small>
                      </td>
                      <td className="text-center">
                        <span className="fw-bold text-success">
                          ₹{order.totalAmount?.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            order.paymentStatus === "Paid"
                              ? "bg-success"
                              : order.paymentStatus === "Free"
                              ? "bg-info"
                              : order.paymentStatus === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {order.paymentStatus || "N/A"}
                        </span>
                      </td>

                      {/* ✅ REDESIGNED: Horizontal compact items display */}
                      <td>
                        <div className="d-flex flex-wrap gap-2 py-2">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="d-flex align-items-center bg-light border rounded px-2 py-1"
                                style={{ 
                                  gap: "8px",
                                  minWidth: "fit-content"
                                }}
                              >
                                {/* Product Image - Smaller */}
                                <img
                                  src={
                                    item.image?.startsWith("http")
                                      ? item.image
                                      : `https://gateway-ai-backend.onrender.com${item.image || ""}`
                                  }
                                  alt={item.productName}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                    border: "1px solid #dee2e6",
                                    flexShrink: 0
                                  }}
                                  onError={(e) => {
                                    e.target.src = "/placeholder-image.png";
                                  }}
                                />

                                {/* Product Info - Compact */}
                                <div className="d-flex flex-column" style={{ fontSize: "0.85rem" }}>
                                  <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: "150px" }}>
                                    {item.productName}
                                  </span>
                                  <span className="text-muted small">
                                    Qty: {item.qty} × ₹{item.price} = 
                                    <span className="fw-semibold text-success ms-1">
                                      ₹{(item.qty * item.price).toFixed(2)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-muted small">No items</span>
                          )}
                        </div>
                      </td>

                      <td className="text-center">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(order._id)}
                          title="Delete Order"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Optional: Summary Card */}
   
    </div>
  );
}