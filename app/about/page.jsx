"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  Search,
  Headset,
  Phone,
  Mail,
  MapPin,
  Quote,
  Star,
  ImageIcon,
  MessageSquare,
  Megaphone,
  CalendarCheck,
  Calculator,
  ChevronRight,
  ArrowUp,
  Home as HomeIcon,
  Car,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .about-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(180deg, #ffffff 0%, #f3fcfd 100%);
  }
  .hph { font-family: 'Outfit', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal { opacity: 0; }
  .fade-up { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

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

  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .about-hero-content > * {
    opacity: 0;
    animation: heroReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .about-hero-content h1 { animation-delay: 0.1s; }
  .about-hero-content .hero-crumb { animation-delay: 0.32s; }

  /* ---------------------------------------------
     Hero
     --------------------------------------------- */
  .about-hero {
    position: relative;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    background: #072b30;
  }
  .about-hero img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
  }
  .about-hero .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(4,25,29,0.9) 0%, rgba(0,77,86,0.75) 100%);
  }
  .about-hero-content { position: relative; z-index: 1; }
  .about-hero h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 14px;
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

  /* ---------------------------------------------
     Feature / intro section
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

  .feature-row {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 18px;
  }
  .feature-check {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: #e6f9ef;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .feature-row h4 { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px; color: #1e293b; margin-bottom: 2px; }
  .feature-row p { font-size: 13px; color: #64748b; line-height: 1.5; }

  .contact-callout {
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(135deg, #072b30 0%, #0a4a52 100%);
    border-radius: 16px;
    padding: 16px 20px;
    margin-top: 8px;
    border: 1px solid transparent;
  }
  .contact-callout .icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(34, 197, 94, 0.18);
    color: #4ade80;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .contact-callout .label { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .contact-callout .value { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #ffffff; }

  .image-blob-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .image-blob-wrap::before {
    content: '';
    position: absolute;
    inset: 6% 10%;
    background: linear-gradient(135deg, #b2ebf2 0%, #d9f7e8 100%);
    border-radius: 42% 58% 63% 37% / 45% 40% 60% 55%;
    z-index: 0;
  }
  .image-blob-wrap img {
    position: relative;
    z-index: 1;
    width: 88%;
    border-radius: 18px;
    box-shadow: 0 25px 50px rgba(0, 151, 167, 0.18);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .image-blob-wrap:hover img {
    transform: translateY(-4px);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35), 0 25px 50px rgba(34, 197, 94, 0.2);
  }

  /* ---------------------------------------------
     Partner strip
     --------------------------------------------- */
  .partner-strip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    padding: 32px 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
  }
  .partner-logo {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #94a3b8;
    filter: grayscale(1);
    opacity: 0.65;
    transition: all 0.3s ease;
  }
  .partner-logo:hover { filter: grayscale(0); opacity: 1; color: #16a34a; }

  /* ---------------------------------------------
     Dark banner (steering wheel)
     --------------------------------------------- */
  .dark-banner {
    position: relative;
    overflow: hidden;
    padding: 70px 24px;
    background: #04191d;
  }
  .dark-banner img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.35;
  }
  .dark-banner .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, rgba(4,25,29,0.95) 20%, rgba(4,25,29,0.6) 100%);
  }
  .dark-banner .banner-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 40px;
    align-items: center;
  }
  .dark-banner h2 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(24px, 3vw, 34px);
    font-weight: 800;
    color: #ffffff;
    line-height: 1.25;
  }
  .dark-banner p { color: rgba(255,255,255,0.65); font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
  @media (max-width: 768px) {
    .dark-banner .banner-inner { grid-template-columns: 1fr; }
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
     Services section
     --------------------------------------------- */
  .service-photo-wrap { position: relative; }
  .service-photo-wrap img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 20px 45px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .service-photo-wrap:hover img {
    transform: translateY(-4px);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35), 0 20px 45px rgba(34, 197, 94, 0.2);
  }
  .rating-badge {
    position: absolute;
    left: 20px;
    bottom: -22px;
    background: #ffffff;
    border-radius: 16px;
    padding: 12px 18px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .rating-badge:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35), 0 12px 30px rgba(34, 197, 94, 0.18);
  }
  .rating-badge .score {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
  }
  .rating-badge .stars { display: flex; gap: 1px; color: #f59e0b; }
  .rating-badge .caption { font-size: 11px; color: #94a3b8; font-weight: 600; }

  .service-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; margin: 22px 0 26px; }
  @media (max-width: 560px) { .service-list { grid-template-columns: 1fr; } }
  .service-item {
    display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; color: #334155;
    padding: 8px 10px; margin: -8px -10px; border-radius: 12px;
    transition: all 0.25s ease;
  }
  .service-item:hover {
    background: rgba(34, 197, 94, 0.08);
    box-shadow: 0 0 0 1.5px rgba(34, 197, 94, 0.35);
    color: #15803d;
  }
  .service-item .dot {
    width: 30px; height: 30px; border-radius: 9px;
    background: #e0f7fa; color: #0097a7;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: all 0.25s ease;
  }
  .service-item:hover .dot { background: rgba(34, 197, 94, 0.18); color: #16a34a; }

  /* ---------------------------------------------
     Testimonials
     --------------------------------------------- */
  .testimonial-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 24px;
    border: 1px solid rgba(0,188,212,0.14);
    box-shadow: 0 4px 18px rgba(0,0,0,0.03);
    transition: all 0.3s ease;
  }
  .testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35), 0 18px 34px rgba(34, 197, 94, 0.16);
    border-color: rgba(34, 197, 94, 0.4);
  }
  .testimonial-card .stars { display: flex; gap: 2px; color: #f59e0b; margin-bottom: 10px; }
  .testimonial-card p { font-size: 13.5px; color: #475569; line-height: 1.7; margin-bottom: 18px; }
  .avatar-circle {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #00bcd4, #0097a7);
    color: #fff; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .testimonial-dots { display: flex; justify-content: center; gap: 7px; margin-top: 30px; }
  .testimonial-dots span { width: 7px; height: 7px; border-radius: 50%; background: #cbd5e1; }
  .testimonial-dots span.active { width: 22px; border-radius: 99px; background: #16a34a; }

  /* ---------------------------------------------
     Final CTA
     --------------------------------------------- */
  .final-cta {
    position: relative;
    overflow: hidden;
    padding: 80px 24px;
    text-align: center;
    background: #04191d;
  }
  .final-cta img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
  }
  .final-cta .cta-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(4,25,29,0.75) 0%, rgba(4,25,29,0.95) 100%);
  }
  .final-cta .cta-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
  .final-cta h2 { font-family: 'Outfit', sans-serif; font-size: clamp(24px, 3.4vw, 34px); font-weight: 800; color: #fff; margin-bottom: 12px; }
  .final-cta p { color: rgba(255,255,255,0.65); font-size: 14px; margin-bottom: 26px; }

  /* ---------------------------------------------
     Footer
     --------------------------------------------- */
  .site-footer {
    position: relative;
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

export default function AboutPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
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

  const handleBrowseCars = () => {
    router.push(isLoggedIn ? "/" : "/signin");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-up");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSpotlightMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const services = [
    { icon: ImageIcon, label: "AI Image Search" },
    { icon: MessageSquare, label: "Chatbot Assistance" },
    { icon: Megaphone, label: "Auto Ad Posting" },
    { icon: CalendarCheck, label: "Book Test Drives" },
    { icon: Calculator, label: "EMI Calculator" },
  ];

  const testimonials = [
    {
      name: "Bilal Ahmed",
      role: "Bought a Honda Civic",
      text: "The inspection report matched the car exactly. First time buying online felt completely safe.",
    },
    {
      name: "Sana Malik",
      role: "Sold her Suzuki Alto",
      text: "Listed on a Friday, had three verified buyers by Sunday. The whole process took under a week.",
    },
    {
      name: "Usman Raza",
      role: "Bought a Toyota Corolla",
      text: "Doorstep delivery and financing help made this the easiest car purchase I've ever made.",
    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="about-page">
        <Navbar />

        {/* Hero */}
        <div className="about-hero">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
            alt="Car dealership showroom"
          />
          <div className="hero-overlay" />
          <div className="about-hero-content">
            <h1>About Car Trade Hub</h1>
            <span className="hero-crumb">
              <span className="glow-hover-zone" onClick={() => router.push("/")} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <HomeIcon size={13} /> Home
              </span>
              <ChevronRight size={12} className="btn-arrow" /> <span className="current">About Us</span>
            </span>
          </div>
        </div>

        {/* Intro / features */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="reveal">
              <span className="eyebrow-pill">Why Car Trade Hub</span>
              <h2 className="hph text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
                A better way to buy and sell your next car
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                We built Car Trade Hub so that buying or selling a car in Pakistan doesn't mean guesswork.
                Every listing is checked, every price is benchmarked against the market, and every step
                is tracked from your dashboard.
              </p>

              <div className="feature-row">
                <span className="feature-check"><ShieldCheck size={15} /></span>
                <div>
                  <h4>Verified listings, always</h4>
                  <p>Our team inspects documents and condition before a car ever goes live.</p>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-check"><Search size={15} /></span>
                <div>
                  <h4>AI-powered matching</h4>
                  <p>Search by photo or describe what you want — we shortlist cars that fit.</p>
                </div>
              </div>
              <div className="feature-row">
                <span className="feature-check"><Headset size={15} /></span>
                <div>
                  <h4>Support at every step</h4>
                  <p>From first message to final paperwork, a real person has your back.</p>
                </div>
              </div>

              <div className="contact-callout glow-card">
                <span className="icon-box"><Phone size={18} /></span>
                <div>
                  <p className="label">Call us for any query</p>
                  <p className="value">+92 300 1234567</p>
                </div>
              </div>
            </div>

            <div className="image-blob-wrap reveal" style={{ animationDelay: "150ms" }}>
              <img
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80"
                alt="Car for sale"
              />
            </div>
          </div>

          {/* Partner strip */}
          <div className="partner-strip mt-16 reveal">
            {["AutoLine", "DriveCo", "MotorHub", "RoadTrust", "GearMark"].map((name) => (
              <span key={name} className="partner-logo"><Car size={16} /> {name}</span>
            ))}
          </div>
        </div>

        {/* Dark banner */}
        <div className="dark-banner">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
            alt="Car interior steering wheel"
          />
          <div className="banner-overlay" />
          <div className="banner-inner">
            <h2 className="reveal">We keep every car clean, inspected, and ready to drive</h2>
            <div className="reveal" style={{ animationDelay: "120ms" }}>
              <p>
                Before a listing goes live, it passes a condition check covering the engine, body,
                interior, and paperwork — so what you see online is what you get at pickup.
              </p>
              <button
                onClick={() => router.push("/cars")}
                onMouseMove={handleSpotlightMove}
                className="spotlight-btn bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition"
              >
                <span>Discover More</span> <ChevronRight size={16} className="btn-arrow" />
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="service-photo-wrap reveal">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
                alt="Handshake after a car deal"
              />
              <div className="rating-badge">
                <span className="score">4.8</span>
                <div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" stroke="none" />)}
                  </div>
                  <p className="caption">From Google Reviews</p>
                </div>
              </div>
            </div>

            <div className="reveal" style={{ animationDelay: "120ms" }}>
              <span className="eyebrow-pill">Our Services</span>
              <h2 className="hph text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
                We handle every step, so you don't have to
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                From the first inspection to the final signature, our team is involved at every stage
                of your purchase or sale.
              </p>

              <div className="service-list">
                {services.map((s) => (
                  <div key={s.label} className="service-item">
                    <span className="dot"><s.icon size={15} /></span>
                    {s.label}
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push("/")}
                onMouseMove={handleSpotlightMove}
                className="spotlight-btn border-2 border-[#0097a7] text-[#0097a7] px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition"
              >
                <span>See All Services</span> <ChevronRight size={16} className="btn-arrow" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white/60 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 reveal">
              <Quote size={34} className="text-[#0097a7] mx-auto mb-3" />
              <h2 className="hph text-2xl md:text-3xl font-bold text-gray-800">What Our Customers Say</h2>
              <p className="text-gray-500 text-sm mt-2">Real experiences from recent buyers and sellers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={t.name} className="testimonial-card reveal" style={{ animationDelay: `${idx * 120}ms` }}>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" stroke="none" />)}
                  </div>
                  <p>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <span className="avatar-circle">{t.name.charAt(0)}</span>
                    <div>
                      <p className="hph text-sm font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              <span className="active" /><span /><span />
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="final-cta">
          <img
            src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80"
            alt="Car at night"
          />
          <div className="cta-overlay" />
          <div className="cta-inner reveal">
            <h2>Ready to find your next car?</h2>
            <p>Browse verified listings across Pakistan, or reach out and we'll help you shortlist the right one.</p>
            <button
              onClick={handleBrowseCars}
              onMouseMove={handleSpotlightMove}
              className="spotlight-btn bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white px-7 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition"
            >
              <span>Browse Cars</span> <ChevronRight size={16} className="btn-arrow" />
            </button>
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
                  <li><a onClick={() => router.push("/cars?bodyType=SUV")}>SUVs</a></li>
                  <li><a onClick={() => router.push("/cars?bodyType=Sedan")}>Sedans</a></li>
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
                  <span>Blue Area, Islamabad, Pakistan</span>
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

        {/* Floating scroll-to-top arrow — ambient green glow while visible */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="scroll-top-btn"
          >
            <ArrowUp size={20} className="btn-arrow" />
          </button>
        )}
      </div>
    </>
  );
}