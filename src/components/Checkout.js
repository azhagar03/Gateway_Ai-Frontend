import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Checkout({ cartItems = [], setCartItems }) {
  const location = useLocation();
  const navigate = useNavigate();

  const buyNowProduct = location.state?.buyNowProduct;
  const bundle = location.state?.bundle;

  const sessionId =
    localStorage.getItem("sessionId") || Math.random().toString(36).substr(2, 9);
  if (!localStorage.getItem("sessionId")) localStorage.setItem("sessionId", sessionId);

  const items = bundle
    ? bundle.products.map((p) => ({ ...p, qty: 1 }))
    : buyNowProduct
      ? [{ ...buyNowProduct, qty: buyNowProduct.qty || 1 }]
      : cartItems;

  const originalTotal = bundle
    ? bundle.price
    : items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [total, setTotal] = useState(originalTotal);

  useEffect(() => setTotal(originalTotal), [originalTotal]);

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "GDC25") {
      setTotal(0);
      setDiscountApplied(true);
      toast.success("Coupon applied! Your order is free.");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();

    const formattedItems = items.map((p) => ({
      productName: p.name,
      image: p.image,
      qty: p.qty,
      price: p.price,
    }));

    if (discountApplied && total === 0) {
      try {
        const res = await fetch("https://gateway-ai-backend.onrender.com/api/payment/free-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, items: formattedItems, totalAmount: 0, paymentStatus: "Free" }),
        });


        if (res.ok) {
          toast.success("Order Placed successfully!");
          setTimeout(() => {
            if (setCartItems) setCartItems([]);
            navigate("/products", { state: { total, status: "FREE" } });
          }, 2000);
        } else {
          toast.error("Failed to place free order.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error placing free order.");
      }
      return;
    }

    try {
      const orderRes = await fetch("https://gateway-ai-backend.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, form, items: formattedItems, }),
      });

      const data = await orderRes.json();
      if (!data.razorpayOrderId) throw new Error("Order creation failed");

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Gateway Of AI",
        description: "Secure Payment",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          await fetch("https://gateway-ai-backend.onrender.com/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          toast.success("Payment successful!");
          if (setCartItems) setCartItems([]);
          navigate("/products", { state: { total, status: "PAID" } });
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <main className="container py-5">
      <h2 className="text-center mb-4">Checkout</h2>
      <div className="row">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="col-md-7">
          <form onSubmit={handlePay} className="p-3 border rounded bg-light">
            <h4>Billing Details</h4>

            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  className="form-control"
                  placeholder="First Name"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <input
              className="form-control mb-3"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="form-control mb-3"
              type="tel"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="form-control mb-3"
              placeholder="Address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  className="form-control"
                  placeholder="City"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  className="form-control"
                  placeholder="State"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
            </div>

            <input
              className="form-control mb-3"
              placeholder="Pincode"
              required
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
            />

            <div className="input-group mb-3">
              <input
                className="form-control"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={handleApplyCoupon}>
                Apply
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Pay ₹{total.toFixed(2)}
            </button>
          </form>
        </div>

        <div className="col-md-5">
          <div className="p-3 border rounded bg-white">
            <h4>Order Summary</h4>
            {items.map((it) => (
              <div key={it._id || it.id} className="d-flex justify-content-between my-2">
                <img
                  src={`https://gateway-ai-backend.onrender.com${it.image}`}
                  alt={it.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "12px",
                  }}
                />

                <span>{it.name} × {it.qty}</span>
                <span>₹{(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
