import React, { useState } from "react";
import "./ContactUs.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = ({ sessionId }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://gateway-ai-backend.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Try again.");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-left">
          <h2>Contact Us</h2>
          <p>We would love to hear from you! Send us a message and we will get back to you as soon as possible.</p>
          <div className="contact-info">
            <div className="info-item"><strong>Email:</strong> gatewayai2025@gmail.com</div>
           <div className="info-item"><strong>Email:</strong> +91 9042707229</div>
          </div>
        </div>
      <ToastContainer position="top-right" autoClose={3000} />

        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
            <input type="email" placeholder="Your Email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
            <input type="text" placeholder="Subject" required value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})}/>
            <textarea placeholder="Your Message" rows="6" required value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})}></textarea>
            <button type="submit" className="btn submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
