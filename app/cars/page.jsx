"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Search, MapPin, Fuel, Settings2, Eye, ArrowRight, X, ChevronDown, Car, Heart, Loader2, Sparkles, SlidersHorizontal, Filter, Facebook, Instagram, Twitter, Youtube, Phone, Mail, ShieldCheck, BadgeCheck, Clock3 } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .cp {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f7fa 100%);
  }
  .hph { font-family: 'Outfit', sans-serif; }

  /* ---------------------------------------------
     Hero banner
     --------------------------------------------- */
  .hero-banner {
    position: relative;
    margin: 20px 24px 0;
    border-radius: 24px;
    overflow: hidden;
    height: 260px;
    background: #0f2b30;
  }
  .hero-banner img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.55;
  }
  .hero-banner .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(115deg, rgba(0,40,45,0.92) 0%, rgba(0,77,86,0.75) 45%, rgba(0,150,166,0.35) 100%);
  }
  .hero-banner .hero-content {
    position: relative;
    z-index: 2;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 40px;
    max-width: 100%;
    overflow: hidden;
  }

  /* Staggered reveal for hero text */
  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hero-content > * {
    opacity: 0;
    animation: heroReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .hero-content .hero-eyebrow { animation-delay: 0.1s; }
  .hero-content h1 { animation-delay: 0.28s; }
  .hero-content .hero-stats { animation-delay: 0.5s; }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #7ee8d8;
    background: rgba(126, 232, 216, 0.12);
    border: 1px solid rgba(126, 232, 216, 0.3);
    padding: 5px 12px;
    border-radius: 99px;
    margin-bottom: 14px;
  }
  .hero-banner h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(18px, 2.6vw, 32px);
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    background: linear-gradient(90deg, #ffffff 0%, #7ee8d8 55%, #00e5ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 12px rgba(0, 229, 255, 0.25));
  }
  .hero-banner p {
    color: rgba(255,255,255,0.78);
    font-size: 14px;
    max-width: 460px;
    line-height: 1.5;
  }
  .hero-stats {
    display: flex;
    gap: 22px;
    margin-top: 20px;
  }
  .hero-stat {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(255,255,255,0.9);
    font-size: 12.5px;
    font-weight: 600;
  }
  .hero-stat svg { color: #7ee8d8; }

  @media (max-width: 768px) {
    .hero-banner { height: 220px; margin: 16px 16px 0; }
    .hero-banner .hero-content { padding: 0 22px; }
    .hero-banner h1 { font-size: clamp(14px, 4.6vw, 24px); }
    .hero-stats { flex-wrap: wrap; row-gap: 8px; }
  }

  /* ---------------------------------------------
     Car card: magnetic tilt + green spotlight glow
     --------------------------------------------- */
  .car-card {
    position: relative;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(0, 188, 212, 0.2);
    cursor: pointer;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 0.35s ease,
                border-color 0.35s ease,
                background 0.35s ease;
  }
  .car-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: radial-gradient(circle 220px at var(--mx, 50%) var(--my, 50%), rgba(34, 197, 94, 0.28), transparent 70%);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
    z-index: 1;
  }
  .car-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0);
    transition: box-shadow 0.35s ease;
    pointer-events: none;
    z-index: 1;
  }
  .car-card.is-hovering {
    box-shadow: 0 28px 50px rgba(34, 197, 94, 0.16), 0 4px 18px rgba(0, 188, 212, 0.1);
    border-color: rgba(34, 197, 94, 0.45);
    background: rgba(255, 255, 255, 0.97);
  }
  .car-card.is-hovering::before { opacity: 1; }
  .car-card.is-hovering::after { box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.25); }

  .car-image {
    position: relative;
    height: 190px;
    overflow: hidden;
  }
  .car-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .car-card.is-hovering .car-image img {
    transform: scale(1.08);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(0, 188, 212, 0.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  }

  .chip { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; white-space:nowrap; }
  .cg { background:#e0f2f1; color:#00695c; border:1px solid #b2dfdb; }
  .cb { background:#e0f7fa; color:#00838f; border:1px solid #b2ebf2; }
  .cs { background:#e8eaf6; color:#3949ab; border:1px solid #c5cae9; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up {
    animation: fadeUp 0.6s ease forwards;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .ai-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  /* ---------------------------------------------
     "View Details" arrow: green glow that reacts
     to the card hover / cursor position
     --------------------------------------------- */
  .details-row {
    position: relative;
    z-index: 2;
  }
  .details-arrow {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: 999px;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .car-card.is-hovering .details-arrow {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14), 0 0 18px rgba(34, 197, 94, 0.45);
    transform: translateX(2px);
  }
  .details-arrow svg {
    transition: transform 0.3s ease, filter 0.3s ease;
  }
  .car-card.is-hovering .details-arrow svg {
    transform: translateX(4px);
    filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.65));
  }

  /* ---------------------------------------------
     Spotlight buttons: a soft green glow that
     follows the cursor, used for CTA buttons
     --------------------------------------------- */
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

  .filter-sidebar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(0, 188, 212, 0.2);
    padding: 20px;
    position: sticky;
    top: 20px;
    height: fit-content;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  }
  .filter-sidebar .filter-group {
    margin-bottom: 14px;
  }
  .filter-sidebar .filter-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin-bottom: 4px;
  }
  .filter-sidebar select {
    width: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    color: #1e293b;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .filter-sidebar select:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14), 0 0 14px rgba(34, 197, 94, 0.3);
  }
  .filter-sidebar .clear-filter-btn {
    font-size: 12px;
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .filter-sidebar .clear-filter-btn:hover {
    background: #fef2f2;
  }
  .filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    background: #e0f7fa;
    color: #00838f;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
  }
  .filter-tag button {
    background: none;
    border: none;
    color: #00838f;
    cursor: pointer;
    font-size: 12px;
    padding: 0 2px;
  }
  .filter-tag button:hover {
    color: #ef4444;
  }

  .empty-state-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  /* Shared green glow hover, same language as the "View Details" arrow,
     reused across the page (favourite button, footer links/socials, selects) */
  .fav-btn {
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .fav-btn:hover {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.16), 0 0 16px rgba(34, 197, 94, 0.45);
    transform: scale(1.12);
  }

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
`;

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlBrand = searchParams.get("brand") || "";
  const urlModel = searchParams.get("model") || "";
  const urlBodyType = searchParams.get("bodyType") || "";
  const urlFuelType = searchParams.get("fuelType") || "";
  const urlYear = searchParams.get("year") || "";
  const urlColor = searchParams.get("color") || "";
  const urlTransmission = searchParams.get("transmission") || "";
  const isAISearch = searchParams.get("aiSearch") === "true";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("newest");
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [favLoading, setFavLoading] = useState({});

  const [filters, setFilters] = useState({
    brand: urlBrand,
    model: urlModel,
    bodyType: urlBodyType,
    fuelType: urlFuelType,
    year: urlYear,
    color: urlColor,
    transmission: urlTransmission,
  });

  useEffect(() => {
    fetch("/api/public/cars?type=all&limit=100")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCars(data.cars);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user/favourites", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.favourites) {
            setFavouriteIds(new Set(data.favourites.map(f => f._id)));
          }
        })
        .catch(console.error);
    }
  }, []);

  // ---------------------------------------------------------------------
  // Interaction helpers: magnetic tilt on car cards + spotlight on buttons
  // ---------------------------------------------------------------------

  // Card hover: pivots the tilt from whichever corner is nearest the
  // cursor (so the card lifts from that corner, like a page peeling up)
  // and drives the green spotlight glow (via --mx / --my CSS vars).
  const handleCardMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Which corner is the cursor closest to? Pivot the tilt from there.
    const originX = x < centerX ? "0%" : "100%";
    const originY = y < centerY ? "0%" : "100%";
    card.style.transformOrigin = `${originX} ${originY}`;

    // Distance from center, normalized to -1..1, drives how far the
    // opposite corner lifts away from the cursor's corner.
    const nx = (x - centerX) / centerX;
    const ny = (y - centerY) / centerY;

    const rotateX = ny * 10;   // top corners lift back, bottom corners lift forward
    const rotateY = -nx * 12;  // left corners lift back, right corners lift forward

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  }, []);

  const handleCardMouseEnter = useCallback((e) => {
    e.currentTarget.classList.add("is-hovering");
  }, []);

  const handleCardMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    card.classList.remove("is-hovering");
    card.style.transform = "";
    card.style.transformOrigin = "";
  }, []);

  // Generic spotlight tracker for CTA buttons (green glow follows cursor).
  const handleSpotlightMove = useCallback((e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    el.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  }, []);

  // ✅ Step 1: Apply all filters strictly
  let filteredCars = cars.filter(car => {
    // Search - flexible
    const query = search.toLowerCase().trim();
    if (query) {
      const searchableText = `${car.brand || ""} ${car.model || ""} ${car.location || ""}`.toLowerCase();
      const terms = query.split(/\s+/);
      const allTermsMatch = terms.every(term => 
        searchableText.includes(term) ||
        car.brand?.toLowerCase().includes(term) ||
        car.model?.toLowerCase().includes(term) ||
        car.location?.toLowerCase().includes(term)
      );
      if (!allTermsMatch) return false;
    }

    // Brand - exact
    if (filters.brand && car.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Model - flexible contains
    if (filters.model) {
      const modelLower = car.model?.toLowerCase() || "";
      const filterLower = filters.model.toLowerCase();
      if (!modelLower.includes(filterLower) && !filterLower.includes(modelLower)) {
        return false;
      }
    }

    // Body Type - flexible contains
    if (filters.bodyType) {
      const bodyLower = car.bodyType?.toLowerCase() || "";
      const filterLower = filters.bodyType.toLowerCase();
      if (!bodyLower.includes(filterLower) && !filterLower.includes(bodyLower)) {
        return false;
      }
    }

    // Fuel - exact
    if (filters.fuelType && car.fuelType?.toLowerCase() !== filters.fuelType.toLowerCase()) {
      return false;
    }

    // Year - exact
    if (filters.year && car.year !== filters.year) {
      return false;
    }

    // Color - flexible contains
    if (filters.color) {
      const colorLower = car.color?.toLowerCase() || "";
      const filterLower = filters.color.toLowerCase();
      if (!colorLower.includes(filterLower) && !filterLower.includes(colorLower)) {
        return false;
      }
    }

    // Transmission - exact
    if (filters.transmission && car.transmission?.toLowerCase() !== filters.transmission.toLowerCase()) {
      return false;
    }

    return true;
  });

  // ✅ Step 2: If no cars found with strict filters, try brand-only
  if (filteredCars.length === 0 && filters.brand) {
    filteredCars = cars.filter(car => 
      car.brand?.toLowerCase() === filters.brand.toLowerCase()
    );
  }

  // ✅ Step 3: If still no cars, show all cars but keep filters applied
  if (filteredCars.length === 0 && cars.length > 0) {
    // Don't override - keep empty so "No cars found" shows
  }

  if (sortBy === "price-asc") filteredCars.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filteredCars.sort((a, b) => b.price - a.price);
  if (sortBy === "newest") filteredCars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const toggleFavourite = async (carId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setFavLoading(prev => ({ ...prev, [carId]: true }));
    try {
      if (favouriteIds.has(carId)) {
        const res = await fetch(`/api/user/favourites?carId=${carId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setFavouriteIds(prev => { const newSet = new Set(prev); newSet.delete(carId); return newSet; });
      } else {
        const res = await fetch("/api/user/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ carId })
        });
        if (res.ok) setFavouriteIds(prev => new Set([...prev, carId]));
      }
    } catch (error) { console.error(error); }
    finally { setFavLoading(prev => ({ ...prev, [carId]: false })); }
  };

  const clearFilters = () => {
    setFilters({ brand: "", model: "", bodyType: "", fuelType: "", year: "", color: "", transmission: "" });
    setSearch("");
    router.push("/cars");
  };

  const removeFilter = (key) => {
    setFilters({ ...filters, [key]: "" });
  };

  const getUniqueValues = (field) => {
    const values = new Set();
    cars.forEach(car => {
      if (car[field]) values.add(car[field]);
    });
    return Array.from(values).sort();
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || search;

  // ✅ Check if inventory has cars at all
  const hasCarsInInventory = cars.length > 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="cp">
        <Navbar />

        {/* Hero Banner */}
        <div className="hero-banner">
          <img
            src="/car.png"
            alt="Cars lined up in a showroom"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-eyebrow"><ShieldCheck size={12} /> Verified Listings Only</span>
            <h1>Find your next car, without the guesswork</h1>
            <div className="hero-stats">
              <span className="hero-stat"><BadgeCheck size={15} /> {cars.length}+ listings</span>
              <span className="hero-stat"><MapPin size={15} /> Across Pakistan</span>
              <span className="hero-stat"><Clock3 size={15} /> Updated daily</span>
            </div>
          </div>
        </div>

        <div className="pt-10 pb-10 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#0097a7] mb-3">
              Pakistan's Trusted Marketplace
            </span>
            <h1 className="hph text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#00bcd4] to-[#0097a7] bg-clip-text text-transparent">
              Browse All Cars
            </h1>
            <p className="text-gray-500 text-base">
              {cars.length}+ verified listings across Pakistan
            </p>
            {isAISearch && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-sky-100 rounded-full text-sm text-sky-700 ai-pulse">
                <Sparkles size={14} />
                AI Search Results
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="filter-sidebar">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Filter size={16} className="text-[#00bcd4]" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="clear-filter-btn">
                      Clear All
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {search && (
                      <span className="filter-tag">
                        {search}
                        <button onClick={() => setSearch("")}>×</button>
                      </span>
                    )}
                    {filters.brand && (
                      <span className="filter-tag">
                        Brand: {filters.brand}
                        <button onClick={() => removeFilter("brand")}>×</button>
                      </span>
                    )}
                    {filters.model && (
                      <span className="filter-tag">
                        Model: {filters.model}
                        <button onClick={() => removeFilter("model")}>×</button>
                      </span>
                    )}
                    {filters.bodyType && (
                      <span className="filter-tag">
                        Body: {filters.bodyType}
                        <button onClick={() => removeFilter("bodyType")}>×</button>
                      </span>
                    )}
                    {filters.fuelType && (
                      <span className="filter-tag">
                        Fuel: {filters.fuelType}
                        <button onClick={() => removeFilter("fuelType")}>×</button>
                      </span>
                    )}
                    {filters.year && (
                      <span className="filter-tag">
                        Year: {filters.year}
                        <button onClick={() => removeFilter("year")}>×</button>
                      </span>
                    )}
                    {filters.color && (
                      <span className="filter-tag">
                        Color: {filters.color}
                        <button onClick={() => removeFilter("color")}>×</button>
                      </span>
                    )}
                    {filters.transmission && (
                      <span className="filter-tag">
                        Transmission: {filters.transmission}
                        <button onClick={() => removeFilter("transmission")}>×</button>
                      </span>
                    )}
                  </div>
                )}

                <div className="filter-group">
                  <label className="filter-label">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  >
                    <option value="">All Brands</option>
                    {getUniqueValues("brand").map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Model</label>
                  <select
                    value={filters.model}
                    onChange={(e) => setFilters({...filters, model: e.target.value})}
                  >
                    <option value="">All Models</option>
                    {getUniqueValues("model").map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Body Type</label>
                  <select
                    value={filters.bodyType}
                    onChange={(e) => setFilters({...filters, bodyType: e.target.value})}
                  >
                    <option value="">All Types</option>
                    {getUniqueValues("bodyType").map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                  >
                    <option value="">All Fuels</option>
                    {getUniqueValues("fuelType").map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                  >
                    <option value="">All Years</option>
                    {getUniqueValues("year").map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Color</label>
                  <select
                    value={filters.color}
                    onChange={(e) => setFilters({...filters, color: e.target.value})}
                  >
                    <option value="">All Colors</option>
                    {getUniqueValues("color").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({...filters, transmission: e.target.value})}
                  >
                    <option value="">All</option>
                    {getUniqueValues("transmission").map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group mt-4 pt-4 border-t border-gray-200">
                  <label className="filter-label">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                <p className="text-gray-500 text-sm">
                  Showing <span className="font-semibold text-gray-800">{filteredCars.length}</span> cars
                  {search && <span> for "<span className="text-[#0097a7] font-semibold">{search}</span>"</span>}
                  {isAISearch && (
                    <span className="ml-2 text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles size={10} /> AI Match
                    </span>
                  )}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />)}
                </div>
              ) : !hasCarsInInventory ? (
                // ✅ NO CARS IN INVENTORY AT ALL
                <div className="text-center py-20 glass-card">
                  <div className="empty-state-icon">🚗</div>
                  <h3 className="text-xl font-bold text-gray-700">No Cars in Inventory Yet</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    There are no cars available in the inventory right now. 
                    {isAISearch && " Your AI search found no matches because the inventory is empty."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => router.push("/")}
                      onMouseMove={handleSpotlightMove}
                      className="spotlight-btn px-6 py-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white font-semibold transition"
                    >
                      <span>Go to Homepage</span>
                    </button>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        onMouseMove={handleSpotlightMove}
                        className="spotlight-btn px-6 py-2 rounded-xl border border-gray-300 text-gray-600 font-semibold transition"
                      >
                        <span>Clear Filters</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : filteredCars.length === 0 ? (
                // ✅ FILTERS RETURNED NO RESULTS
                <div className="text-center py-20 glass-card">
                  <div className="empty-state-icon">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700">No Cars Found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    {search ? `No results for "${search}"` : "No cars match your filters"}
                    {isAISearch && " Your AI search didn't find any matching cars in the inventory."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        onMouseMove={handleSpotlightMove}
                        className="spotlight-btn px-6 py-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white font-semibold transition"
                      >
                        <span>Clear All Filters</span>
                      </button>
                    )}
                    <button
                      onClick={() => router.push("/")}
                      onMouseMove={handleSpotlightMove}
                      className="spotlight-btn px-6 py-2 rounded-xl border border-gray-300 text-gray-600 font-semibold transition"
                    >
                      <span>Go to Homepage</span>
                    </button>
                  </div>
                  {isAISearch && (
                    <p className="text-xs text-gray-400 mt-4">
                      💡 Try uploading a different car image or adjust the filters
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car, idx) => (
                    <div
                      key={car._id}
                      className="car-card fade-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                      onClick={() => router.push(`/cars/${car._id}`)}
                      onMouseMove={handleCardMouseMove}
                      onMouseEnter={handleCardMouseEnter}
                      onMouseLeave={handleCardMouseLeave}
                    >
                      <div className="car-image">
                        <img src={car.images?.[0] || "/placeholder.png"} alt={`${car.brand} ${car.model}`} />
                        <button
                          onClick={(e) => toggleFavourite(car._id, e)}
                          className="fav-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-10"
                        >
                          {favLoading[car._id] ? (
                            <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Heart size={16} fill={favouriteIds.has(car._id) ? "#ef4444" : "none"} color={favouriteIds.has(car._id) ? "#ef4444" : "#64748b"} />
                          )}
                        </button>
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-bold">
                          PKR {Number(car.price).toLocaleString()}
                        </div>
                        {isAISearch && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                            <Sparkles size={10} /> AI Match
                          </div>
                        )}
                      </div>
                      <div className="p-4" style={{ position: "relative", zIndex: 2 }}>
                        <h3 className="hph font-bold text-gray-800 text-lg truncate">{car.brand} {car.model} <span className="text-gray-400 font-normal">({car.year})</span></h3>
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1 truncate"><MapPin size={14} /> {car.location}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {car.fuelType && <span className="chip cg"><Fuel size={10}/> {car.fuelType}</span>}
                          {car.transmission && <span className="chip cb"><Settings2 size={10}/> {car.transmission}</span>}
                          {car.bodyType && <span className="chip cs"><Car size={10}/> {car.bodyType}</span>}
                        </div>
                        <div className="details-row flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={12}/> {car.views || 0} views</span>
                          <span className="details-arrow text-[#0097a7] text-sm font-semibold">View Details <ArrowRight size={14}/></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <span>support@cruvix.pk</span>
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
      </div>
    </>
  );
}