// /app/contact/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle,
  Loader2,
  MessageCircle,
  ChevronRight,
  ArrowUp,
  Home as HomeIcon,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .contact-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(180deg, #ffffff 0%, #f3fcfd 100%);
  }
  .hph { font-family: 'Outfit', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

  /* ---------------------------------------------
     Global green hover glow — cards + arrows
     --------------------------------------------- */
  .glow-card {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .glow-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35), 0 18px 34px rgba(34, 197, 94, 0.16);
    border-color: rgba(34, 197, 94, 0.4);
  }
  .btn-arrow {
    transition: transform 0.3s ease, filter 0.3s ease, color 0.3s ease;
  }
  .btn-arrow:hover,
  button:hover .btn-arrow,
  a:hover .btn-arrow,
  .glow-hover-zone:hover .btn-arrow {
    transform: translateX(3px);
    filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.65));
    color: #22c55e;
  }
  .spotlight-btn:hover .btn-arrow { color: #d1fae5; filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.85)); }

  /* ---------------------------------------------
     Hero
     --------------------------------------------- */
  .contact-hero {
    position: relative;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    background: #072b30;
  }
  .contact-hero img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
  }
  .contact-hero .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(4,25,29,0.9) 0%, rgba(0,77,86,0.75) 100%);
  }
  .contact-hero-content { position: relative; z-index: 1; }
  .contact-hero h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 10px;
  }
  .contact-hero p {
    color: rgba(255,255,255,0.7);
    font-size: 14px;
    max-width: 460px;
    margin: 0 auto 14px;
    line-height: 1.6;
  }
  .hero-crumb {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.02em;
  }
  .hero-crumb .current { color: #7ee8d8; }
  .glow-hover-zone { transition: color 0.3s ease; }
  .glow-hover-zone:hover { color: #4ade80; }

  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .contact-hero-content > * {
    opacity: 0;
    animation: heroReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .contact-hero-content h1 { animation-delay: 0.1s; }
  .contact-hero-content p { animation-delay: 0.24s; }
  .contact-hero-content .hero-crumb { animation-delay: 0.38s; }

  /* ---------------------------------------------
     Info + form cards
     --------------------------------------------- */
  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #0097a7;
    background: #e0f7fa;
    border: 1px solid #b2ebf2;
    padding: 5px 12px;
    border-radius: 99px;
    margin-bottom: 14px;
  }

  .info-card {
    background: white;
    border-radius: 18px;
    padding: 20px;
    border: 1px solid rgba(0,188,212,0.14);
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  }

  .info-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #00bcd4, #0097a7);
    color: #fff;
  }

  .social-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0f7fa;
    color: #0097a7;
    border: 1px solid #b2ebf2;
    transition: all 0.25s ease;
  }
  .social-btn:hover {
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.4);
    color: #16a34a;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14), 0 0 16px rgba(34, 197, 94, 0.4);
    transform: translateY(-2px);
  }

  .form-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,188,212,0.14);
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .form-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3), 0 20px 38px rgba(34, 197, 94, 0.14);
    border-color: rgba(34, 197, 94, 0.35);
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    transition: all 0.2s ease;
    outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .form-input:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14), 0 0 14px rgba(34, 197, 94, 0.25);
  }

  .spotlight-btn {
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }
  .spotlight-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle 140px at var(--mx, 50%) var(--my, 50%), rgba(34, 197, 94, 0.35), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 0;
  }
  .spotlight-btn:hover::before { opacity: 1; }
  .spotlight-btn:hover {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.16), 0 8px 24px rgba(34, 197, 94, 0.28);
    transform: translateY(-2px);
  }
  .spotlight-btn span, .spotlight-btn svg { position: relative; z-index: 1; }

  /* ---------------------------------------------
     Footer
     --------------------------------------------- */
  .site-footer {
    position: relative;
    margin-top: 40px;
    background: linear-gradient(180deg, #072b30 0%, #04191d 100%);
    color: rgba(255,255,255,0.7);
    overflow: hidden;
  }
  .site-footer::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -80px;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,188,212,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .footer-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 56px 24px 0;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; row-gap: 32px; }
  }
  @media (max-width: 560px) {
    .footer-grid { grid-template-columns: 1fr; }
  }
  .footer-brand {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .footer-brand .dot { color: #00e5c7; }
  .footer-desc {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(255,255,255,0.55);
    max-width: 300px;
    margin-bottom: 18px;
  }
  .footer-social {
    display: flex;
    gap: 10px;
  }
  .footer-social a {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.75);
    transition: all 0.25s ease;
  }
  .footer-social a:hover {
    background: rgba(34, 197, 94, 0.14);
    border-color: rgba(34, 197, 94, 0.45);
    color: #4ade80;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14), 0 0 18px rgba(34, 197, 94, 0.45);
    transform: translateY(-2px);
  }
  .footer-heading {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #ffffff;
    margin-bottom: 18px;
  }
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .footer-links a {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 2px 4px;
    margin: -2px -4px;
    border-radius: 8px;
    font-size: 13.5px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
  }
  .footer-links a:hover {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.1);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12), 0 0 14px rgba(34, 197, 94, 0.4);
    transform: translateX(3px);
  }
  .footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 14px;
    line-height: 1.5;
  }
  .footer-contact-item svg { color: #00bcd4; margin-top: 2px; flex-shrink: 0; }
  .footer-bottom {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 24px 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    color: rgba(255,255,255,0.4);
  }
  .footer-bottom-links {
    display: flex;
    gap: 18px;
  }
  .footer-bottom-links a {
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .footer-bottom-links a:hover { color: rgba(255,255,255,0.75); }

  /* ---------------------------------------------
     Scroll-to-top arrow — ambient green glow
     while visible, stronger glow on hover
     --------------------------------------------- */
  @keyframes scrollGlowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45), 0 4px 18px rgba(0,0,0,0.15); }
    50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0), 0 4px 18px rgba(0,0,0,0.15); }
  }
  .scroll-top-btn {
    position: fixed;
    bottom: 26px;
    right: 26px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00bcd4, #0097a7);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(34, 197, 94, 0.5);
    cursor: pointer;
    z-index: 50;
    animation: scrollGlowPulse 2.2s ease-in-out infinite;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .scroll-top-btn:hover {
    transform: translateY(-4px) scale(1.06);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3), 0 0 22px rgba(34, 197, 94, 0.6), 0 8px 20px rgba(0,0,0,0.2);
  }
  .scroll-top-btn svg { transition: transform 0.25s ease; }
  .scroll-top-btn:hover svg { transform: translateY(-2px); }
`;

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Auto-fill user data if logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData((prev) => ({
          ...prev,
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSpotlightMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSubmitted(false);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          subject: "",
          message: "",
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    { icon: Phone, title: "Phone", details: "+92 300 1234567", sub: "Mon–Fri, 9AM – 6PM" },
    { icon: Mail, title: "Email", details: "support@cartradehub.pk", sub: "sales@cartradehub.pk" },
    { icon: MapPin, title: "Office", details: "DHA Phase 8, Karachi", sub: "Pakistan" },
    { icon: Clock, title: "Hours", details: "Mon–Fri: 9AM – 6PM", sub: "Sat: 10AM – 2PM" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="contact-page">
        <Navbar />

        {/* Hero */}
        <div className="contact-hero">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80"
            alt="Customer support team"
          />
          <div className="hero-overlay" />
          <div className="contact-hero-content">
            <h1>Get in Touch</h1>
            <p>Have questions? We'd love to hear from you — send us a message and we'll respond within 24 hours.</p>
            <span className="hero-crumb">
              <span
                className="glow-hover-zone"
                onClick={() => router.push("/")}
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <HomeIcon size={13} /> Home
              </span>
              <ChevronRight size={12} className="btn-arrow" /> <span className="current">Contact Us</span>
            </span>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left side — info cards */}
            <div className="space-y-5">
              <span className="eyebrow-pill">Contact Info</span>
              {infoItems.map((item, idx) => (
                <div key={item.title} className="info-card glow-card fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="info-icon">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 className="hph text-lg font-bold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.details}</p>
                      <p className="text-gray-400 text-sm">{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div className="info-card glow-card fade-up" style={{ animationDelay: "400ms" }}>
                <h3 className="hph text-lg font-bold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <button className="social-btn"><Facebook size={18} /></button>
                  <button className="social-btn"><Twitter size={18} /></button>
                  <button className="social-btn"><Instagram size={18} /></button>
                  <button className="social-btn"><Linkedin size={18} /></button>
                </div>
              </div>

              {/* Message sent confirmation */}
              {submitted && (
                <div className="info-card fade-up border-green-200 bg-green-50" style={{ animationDelay: "500ms" }}>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-green-500" />
                    <div>
                      <p className="font-semibold text-green-700">Message Sent!</p>
                      <p className="text-sm text-green-600">We'll get back to you soon.</p>
                    </div>
                  </div>
                </div>
              )}

              {submitted && (
                <div className="info-card fade-up border-sky-200 bg-sky-50" style={{ animationDelay: "550ms" }}>
                  <div className="flex items-center gap-3">
                    <MessageCircle size={24} className="text-sky-500" />
                    <div>
                      <p className="font-semibold text-sky-700">Check Your Messages</p>
                      <p className="text-sm text-sky-600">View this message in your inbox</p>
                      <button
                        onClick={() => router.push("/messages")}
                        className="mt-1 text-xs text-sky-600 hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        Go to Messages <ChevronRight size={12} className="btn-arrow" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side — form */}
            <div className="form-card fade-up" style={{ animationDelay: "200ms" }}>
              <span className="eyebrow-pill">Send a Message</span>
              <h2 className="hph text-xl font-bold text-gray-800 mb-5">We'll get back to you shortly</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                />
                <textarea
                  placeholder="Your Message *"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input resize-none"
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  onMouseMove={handleSpotlightMove}
                  className="spotlight-btn w-full py-3 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition"
                >
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} className="btn-arrow" />}
                  <span>{submitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div>
                <div className="footer-brand">CarTradeHub<span className="dot">.</span></div>
                <p className="footer-desc">
                  Pakistan's trusted car marketplace. Every listing is checked for accuracy so buyers and sellers can deal with confidence.
                </p>
                <div className="footer-social">
                  <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
                  <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
                  <a href="#" aria-label="Twitter"><Twitter size={15} /></a>
                  <a href="#" aria-label="YouTube"><Youtube size={15} /></a>
                </div>
              </div>

              <div>
                <div className="footer-heading">Explore</div>
                <ul className="footer-links">
                  <li><a onClick={() => router.push("/")}>Homepage</a></li>
                  <li><a onClick={() => router.push("/cars")}>Browse Cars</a></li>
                  <li><a onClick={() => router.push("/about")}>About Us</a></li>
                  <li><a onClick={() => router.push("/contact")}>Contact Us</a></li>
                </ul>
              </div>

              <div>
                <div className="footer-heading">Support</div>
                <ul className="footer-links">
                  <li><a>Help Center</a></li>
                  <li><a>How Buying Works</a></li>
                  <li><a>How Selling Works</a></li>
                  <li><a>Terms & Privacy</a></li>
                </ul>
              </div>

              <div>
                <div className="footer-heading">Get in Touch</div>
                <div className="footer-contact-item">
                  <Phone size={15} />
                  <span>+92 300 1234567</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={15} />
                  <span>support@cartradehub.pk</span>
                </div>
                <div className="footer-contact-item">
                  <MapPin size={15} />
                  <span>DHA Phase 8, Karachi, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} CarTradeHub. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a>Privacy Policy</a>
              <a>Terms of Service</a>
              <a>Sitemap</a>
            </div>
          </div>
        </footer>

        {/* Floating scroll-to-top arrow */}
        {showScrollTop && (
          <button onClick={scrollToTop} aria-label="Scroll to top" className="scroll-top-btn">
            <ArrowUp size={20} className="btn-arrow" />
          </button>
        )}
      </div>
    </>
  );
}