import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
 const [showToast, setShowToast] = useState(false); 

  const adminToken = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://gateway-ai-backend.onrender.com/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editProductId
      ? `https://gateway-ai-backend.onrender.com/api/products/${editProductId}`
      : "https://gateway-ai-backend.onrender.com/api/products";
    const method = editProductId ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      if (res.ok) {
        setForm({ name: "", price: "", description: "" });
        setImageFile(null);
        setPreview(null);
        setEditProductId(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (p) => {
    setEditProductId(p._id);
    setForm({ name: p.name, price: p.price, description: p.description });
    setPreview(p.image || null);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`https://gateway-ai-backend.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  setShowToast(true);
  navigate("/admin-login", { replace: true });
};


  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Product Manager</h2>
         <button className="btn btn-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>Logout
               </button>
      </div>
  <div
        className={`toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-4 ${
          showToast ? "show" : "hide"
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body fw-semibold">Logged out successfully!</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      </div>
    
      {/* Form */}
      <form className="border rounded p-3 mb-4 bg-light" onSubmit={handleSubmit}>
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <input
              name="name"
              className="form-control"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="price"
              className="form-control"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-3">
            <textarea
              name="description"
              className="form-control"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">
              {editProductId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Description</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹{p.price.toFixed(2)}</td>
              <td>
                {p.image && (
                  <img
                    src={`https://gateway-ai-backend.onrender.com${p.image}`}
                    alt={p.name}
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                )}
              </td>
              <td>{p.description}</td>
              <td className="">
                <button
                  onClick={() => handleEdit(p)}
                  className="btn btn-outline-success btn-sm mb-2"
                  title="Edit"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn btn-outline-danger btn-sm"
                  title="Delete"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
