import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const testimonialRef = useRef(null);

    const [products, setProducts] = useState([]);
  const [bundlePrice, setBundlePrice] = useState(0);

  const PRODUCTS = [
    {
      id: 1,
      name: "1000 Photography Prompts",
      price: 299,
      image: "/images/photography.png",
      desc: "High-quality prompts for creativity.",
    },
    {
      id: 2,
      name: "Social Media Viral Prompts",
      price: 99,
      image: "/images/socialmedia.png",
      desc: "Prebuilt chatbot templates.",
    },
    {
      id: 3,
      name: "Creative Prompt Designer",
      price: 199,
      image: "/images/creative.png",
      desc: "Generate websites with AI.",
    },
    {
      id: 4,
      name: "Killer 1,00,000+ ChatGPT Prompts",
      price: 199,
      image: "/images/chatgpt.png",
      desc: "Create content faster.",
    },
  ];

  const BUNDLE = {
    id: 23,
    name: "AI PowerPack Bundle",
    price: 99,
    image: "/images/hero.png",
    description: "Includes 4 AI-powered tools in one discounted bundle.",
  };

  const testimonials = [
    {
      id: 1,
      text: "Absolutely loved these AI eBooks! The content is simple, practical, and saved me tons of time.",
      author: "Priya S.",
    },
    {
      id: 2,
      text: "Worth every rupee! The ₹99 bundle is a steal for anyone starting with AI tools.",
      author: "Karthik R.",
    },
    {
      id: 3,
      text: "Clear explanations, real-world use cases — perfect for small businesses.",
      author: "Meena D.",
    },
    {
      id: 4,
      text: "The guides are very visual and beginner-friendly. I’ve already started using them for my brand.",
      author: "Rahul V.",
    },
    {
      id: 5,
      text: "Best purchase I made this month! These resources helped me launch my first AI project.",
      author: "Sanjana T.",
    },
  ];

    useEffect(() => {
    const fetchBundleProducts = async () => {
      try {
        const res = await fetch("https://gateway-ai-backend.onrender.com/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        // Take first 4 products for bundle
        const bundleProducts = Array.isArray(data) ? data.slice(0, 4) : [];
        setProducts(bundleProducts);

        // Set a bundle price (example: fixed 99 or sum)
        setBundlePrice(99); // fixed price
        // If you want sum of products instead:
        // setBundlePrice(bundleProducts.reduce((sum, p) => sum + p.price, 0));
      } catch (err) {
        console.error(err);
      }
    };

    fetchBundleProducts();
  }, []);

  if (products.length === 0) return null;

  // ✅ Scroll functions for testimonials
  const scrollLeft = () => {
    testimonialRef.current.scrollBy({
      left: -testimonialRef.current.offsetWidth / 1.5,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    testimonialRef.current.scrollBy({
      left: testimonialRef.current.offsetWidth / 1.5,
      behavior: "smooth",
    });
  };

   const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star-fill ${
          index < rating ? "text-warning" : "text-muted"
        } me-1`}
      ></i>
    ));
  };

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-left">
          <h1 className="hero-title">Gateway Of AI</h1>
          <p className="hero-sub">
            Discover high-quality AI products, prompts, and templates to
            supercharge your projects.
          </p>
          <div className="hero-cta">
            <button className="btn primary" onClick={() => navigate("/products")}>
              Explore Now
            </button>
          </div>
        </div>
        <div className="hero-right">
          <img src="/images/hero.png" alt="hero" className="hero-image" />
        </div>
      </section>

      {/* Bundle Offer Section */}
      <section className="container my-5">
      <h2 className="text-center mb-6 fw-bold">
        Bundle Offer – All 4 Tools for <span className="text-warning">₹{bundlePrice}</span> 
      </h2>
      <div className="row g-4 mt-4">
        {/* Main Bundle Card */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="row g-0">
              <div className="col-md-6">
                <img
                  src={`https://gateway-ai-backend.onrender.com${products[0].image}`}
                  className="img-fluid rounded-start h-100"
                  alt={products[0].name}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="col-md-6 d-flex flex-column justify-content-center p-3">
                <h3>{products[0].name}</h3>
                <p className="text-muted">{products[0].description}</p>
                <p className="fs-5">
                  Total Value: <del>₹{products.reduce((sum, p) => sum + p.price, 0)}</del>{" "}
                  <span className="fw-bold text-success">₹{bundlePrice}</span>
                </p>
<button
  className="btn btn-primary mt-2"
  onClick={() =>
    navigate("/checkout", {
      state: {
        // Pass all 4 products as a bundle
        bundle: {
          id: "bundle-4-tools",
          name: "AI PowerPack Bundle",
          price: bundlePrice, // fixed 99
          products: products, // include all products for info
          qty: 1,
        },
      },
    })
  }
>
  Buy Now
</button>

              </div>
            </div>
          </div>
        </div>

        {/* Included Products */}
        <div className="col-lg-6">
          <h4>Included in this Bundle:</h4>
          <div className="row g-3 mt-2">
            {products.map((p) => (
              <div key={p._id} className="col-6 col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center p-2">
                  <img
                    src={`https://gateway-ai-backend.onrender.com${p.image}`}
                    className="img-fluid mb-2"
                    alt={p.name}
                    style={{ height: "120px", objectFit: "contain" }}
                  />
                  <h6 className="mb-1">{p.name}</h6>
                  <p className="mb-0 fw-bold">₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
          <small className="text-muted d-block mt-3">
            *Bundle price is applicable for a limited time only.
          </small>
        </div>
      </div>
    </section>

      {/* Testimonials Section */}
     <section className="testimonials-section py-5 bg-light position-relative overflow-hidden">
      {/* Background Decorations */}
      <div className="testimonial-bg-decoration testimonial-bg-decoration-1"></div>
      <div className="testimonial-bg-decoration testimonial-bg-decoration-2"></div>

      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          {/* <span className="badge bg-primary bg-gradient mb-3 px-3 py-2 fs-6">
            Testimonials
          </span> */}
          <h2 className="section-title display-5 fw-bold text-dark mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted fs-5 mb-0">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Slider Container */}
        <div className="position-relative">
          {/* Left Arrow Button */}
          <button
            className="testimonial-arrow testimonial-arrow-left btn btn-primary shadow-lg d-none d-md-flex"
            onClick={scrollLeft}
            aria-label="Previous testimonial"
          >
            <i className="bi bi-chevron-left fs-4"></i>
          </button>

          {/* Testimonials Wrapper */}
          <div 
            className="testimonials-wrapper d-flex gap-4 overflow-auto pb-4" 
            ref={testimonialRef}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="testimonial-card card border-0 shadow-sm flex-shrink-0"
              >
                <div className="card-body p-4">
                  {/* Quote Icon */}
                  <div className="quote-icon mb-3">
                    <i className="bi bi-quote fs-1 text-primary opacity-25"></i>
                  </div>

                  {/* Star Rating */}
                  <div className="testimonial-rating mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <p className="testimonial-body text-dark mb-4 fs-6 lh-lg">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    {/* <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="testimonial-avatar rounded-circle shadow-sm"
                      width="50"
                      height="50"
                    /> */}
                    <div>
                      <p className="testimonial-author fw-bold text-dark mb-0">
                        {testimonial.author}
                      </p>
                      <p className="testimonial-role text-muted small mb-0">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Accent */}
                <div className="card-accent"></div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            className="testimonial-arrow testimonial-arrow-right btn btn-primary shadow-lg d-none d-md-flex"
            onClick={scrollRight}
            aria-label="Next testimonial"
          >
            <i className="bi bi-chevron-right fs-4"></i>
          </button>
        </div>

        {/* Mobile Navigation Dots (Optional) */}
        <div className="d-flex justify-content-center gap-2 mt-4 d-md-none">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className="testimonial-dot"
              aria-label={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
    </main>
  );
}
