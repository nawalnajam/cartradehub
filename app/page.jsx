"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CTText from "@/components/CTText";
import HeroSearch from "@/components/HeroSearch";
import {
  Star, MapPin, Fuel, Settings2, ArrowRight, ChevronRight,
  Shield, Zap, HeartHandshake, Car, Users, TrendingUp, Eye,
  Phone, Mail, Instagram, Facebook, Twitter, Youtube, CheckCircle2, Heart, X, Loader2
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  .hp  { font-family:'Plus Jakarta Sans', sans-serif; }
  .hph { font-family:'Outfit', sans-serif; }

  /* ── SCROLL ANIMATIONS ──────────────────── */
  [data-anim] {
    opacity: 0;
    will-change: opacity, transform;
  }
  [data-anim="fade-up"]    { transform: translateY(52px); }
  [data-anim="fade-left"]  { transform: translateX(-52px); }
  [data-anim="fade-right"] { transform: translateX(52px); }
  [data-anim="fade-scale"] { transform: scale(0.88); }
  [data-anim="fade-in"]    { transform: none; }

  [data-anim].in-view {
    opacity: 1 !important;
    transform: none !important;
    transition:
      opacity  0.75s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  }

  [data-delay="0"]  { transition-delay: 0s; }
  [data-delay="1"]  { transition-delay: 0.08s; }
  [data-delay="2"]  { transition-delay: 0.16s; }
  [data-delay="3"]  { transition-delay: 0.24s; }
  [data-delay="4"]  { transition-delay: 0.32s; }
  [data-delay="5"]  { transition-delay: 0.40s; }
  [data-delay="6"]  { transition-delay: 0.48s; }
  [data-delay="7"]  { transition-delay: 0.56s; }
  [data-delay="8"]  { transition-delay: 0.64s; }

  .dot-bg { position: relative; }
  .dot-bg::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(14,165,233,.10) 1.2px, transparent 1.2px);
    background-size: 26px 26px;
    mask-image: radial-gradient(ellipse 90% 85% at 50% 50%, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 90% 85% at 50% 50%, black 30%, transparent 100%);
  }
  .dot-bg > * { position: relative; z-index: 1; }

  .glass-panel {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid rgba(14,165,233,.12);
    border-bottom: 1px solid rgba(14,165,233,.12);
  }

  .snum {
    font-family:'Syne',sans-serif; font-size:28px; font-weight:800;
    background:linear-gradient(135deg,#0ea5e9,#22c55e);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; line-height:1.2;
  }

  .slabel {
    display:inline-flex; align-items:center; gap:7px;
    padding:5px 14px; border-radius:99px;
    font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
    background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(34,197,94,.1));
    color:#0284c7; border:1px solid rgba(14,165,233,.22);
    margin-bottom:12px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .cc {
    background:rgba(255,255,255,.88);
    border:1.5px solid rgba(14,165,233,.12);
    border-radius:20px; overflow:hidden; cursor:pointer;
    transition:all .38s cubic-bezier(.22,1,.36,1);
    box-shadow:0 2px 16px rgba(14,165,233,.07);
    display:flex; flex-direction:column;
    backdrop-filter:blur(8px);
  }
  .cc:hover {
    transform:translateY(-8px);
    box-shadow:0 28px 56px rgba(14,165,233,.17);
    border-color:#7dd3fc;
    background:rgba(255,255,255,.97);
  }
  .cc.fc { border-color:rgba(252,211,77,.75); }
  .cc.fc:hover { box-shadow:0 28px 56px rgba(251,191,36,.22); border-color:#f59e0b; }

  .ci { position:relative; height:196px; overflow:hidden; flex-shrink:0; }
  .ci img { width:100%; height:100%; object-fit:cover; transition:transform .6s ease; display:block; }
  .cc:hover .ci img { transform:scale(1.09); }

  .chip { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; white-space:nowrap; }
  .cg { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
  .cb { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
  .cs { background:#f8fafc; color:#475569; border:1px solid #e2e8f0; }

  .bprimary {
    background:linear-gradient(135deg,#0ea5e9,#22c55e); color:#fff;
    font-weight:700; border-radius:14px; padding:13px 28px; font-size:14px;
    border:none; cursor:pointer; display:inline-flex; align-items:center; gap:8px;
    transition:all .3s ease; box-shadow:0 4px 14px rgba(14,165,233,.3); white-space:nowrap;
  }
  .bprimary:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(14,165,233,.42); }

  .bghost {
    background:rgba(255,255,255,.12); border:1.5px solid rgba(255,255,255,.3);
    color:#fff; font-weight:600; border-radius:14px; padding:13px 28px; font-size:14px;
    cursor:pointer; display:inline-flex; align-items:center; gap:8px;
    transition:all .3s ease; backdrop-filter:blur(6px); white-space:nowrap;
  }
  .bghost:hover { background:rgba(255,255,255,.24); }

  .fpill {
    padding:8px 18px; border-radius:99px; font-size:13px; font-weight:600;
    cursor:pointer; transition:all .25s ease;
    border:1.5px solid rgba(14,165,233,.18); background:rgba(255,255,255,.7); color:#64748b;
    white-space:nowrap; backdrop-filter:blur(6px);
  }
  .fpill.act {
    background:linear-gradient(135deg,#0ea5e9,#22c55e); color:#fff;
    border-color:transparent; box-shadow:0 4px 12px rgba(14,165,233,.3);
  }
  .fpill:not(.act):hover { border-color:#7dd3fc; color:#0284c7; background:rgba(255,255,255,.9); }

  @keyframes sk { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  .skel {
    background:linear-gradient(90deg,rgba(241,245,249,.9) 25%,rgba(226,232,240,.9) 50%,rgba(241,245,249,.9) 75%);
    background-size:600px 100%; animation:sk 1.6s infinite; border-radius:20px;
  }

  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
  .bob { animation:bob 1.9s ease-in-out infinite; }

  .fl { color:#94a3b8; font-size:14px; transition:color .2s; cursor:pointer; text-decoration:none; display:block; margin-bottom:10px; }
  .fl:hover { color:#38bdf8; }

  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .marquee-track { display:flex; width:max-content; animation:marquee 22s linear infinite; }
  .marquee-track:hover { animation-play-state:paused; }

  /* ✅ Hero Slider Animations (only for images) */
  @keyframes fadeInOut {
    0% { opacity: 0; transform: scale(1.05); }
    10% { opacity: 1; transform: scale(1); }
    85% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.02); }
  }
  .hero-slide {
    animation: fadeInOut 5s ease-in-out forwards;
  }

  /* ✅ Skyblue Background for Page Content */
  .page-bg {
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);
    position: relative;
    overflow: hidden;
  }

  /* ✅ Moving Text Marquee INSIDE Why Choose Us */
  .why-bg-marquee {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    opacity: 0.08;
    white-space: nowrap;
  }
  .why-bg-marquee .why-marquee-track {
    display: flex;
    width: max-content;
    animation: whyMarquee 28s linear infinite;
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    font-size: clamp(40px, 8vw, 80px);
    letter-spacing: 0.1em;
    color: #0f172a;
    text-shadow: 0 0 30px rgba(14,165,233,0.2);
  }
  .why-bg-marquee .why-marquee-track span {
    padding: 0 30px;
    display: inline-block;
  }
  @keyframes whyMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @media (max-width: 768px) {
    .why-bg-marquee .why-marquee-track {
      font-size: 28px;
    }
  }

  /* ✅ Footer with Wave Lines */
  .site-footer {
    position: relative;
    background: #0f172a;
    color: #94a3b8;
    padding: 60px 24px 24px;
    border-top: 1px solid rgba(255,255,255,.07);
    overflow: hidden;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,.08);
  }

  .footer-brand {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #fff;
    margin-bottom: 12px;
  }

  .footer-brand .dot {
    color: #22c55e;
  }

  .footer-desc {
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 20px;
    max-width: 300px;
  }

  .footer-social {
    display: flex;
    gap: 12px;
  }

  .footer-social a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.08);
    color: #94a3b8;
    transition: all .2s;
  }

  .footer-social a:hover {
    border-color: #38bdf8;
    color: #38bdf8;
  }

  .footer-heading {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #fff;
    margin-bottom: 18px;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-links li a {
    color: #94a3b8;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    transition: color .2s;
  }

  .footer-links li a:hover {
    color: #38bdf8;
  }

  .footer-contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .footer-contact-item svg {
    color: #0ea5e9;
    flex-shrink: 0;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 22px;
    font-size: 13px;
    color: #475569;
  }

  .footer-bottom-links {
    display: flex;
    gap: 24px;
  }

  .footer-bottom-links a {
    color: #475569;
    cursor: pointer;
    transition: color .2s;
  }

  .footer-bottom-links a:hover {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .footer-desc {
      max-width: 100%;
    }
  }

  /* ✅ Wave lines background */
  .footer-wave-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.12;
  }

  .footer-wave-bg svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .footer-wave-bg .wave-line {
    stroke: #22c55e;
    stroke-width: 0.6;
    transition: transform 0.1s ease;
  }
`;

function setupReveal() {
  if (typeof window === "undefined") return null;
  const els = document.querySelectorAll("[data-anim]");
  const io  = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
  return io;
}

function CarCard({ car, featured = false, router, isFavourite = false, onFavouriteToggle }) {
  const [isFav, setIsFav] = useState(isFavourite);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavourite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    
    setFavLoading(true);
    try {
      if (isFav) {
        const res = await fetch(`/api/user/favourites?carId=${car._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setIsFav(false);
          if (onFavouriteToggle) onFavouriteToggle(car._id, false);
        }
      } else {
        const res = await fetch("/api/user/favourites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ carId: car._id })
        });
        const data = await res.json();
        if (data.success) {
          setIsFav(true);
          if (onFavouriteToggle) onFavouriteToggle(car._id, true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div onClick={() => router.push(`/cars/${car._id}`)} className={`cc${featured ? " fc" : ""}`}>
      <div className="ci">
        <img src={car.images?.[0] || "/placeholder.png"} alt={`${car.brand} ${car.model}`}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 55%)" }}/>
        
        <button
          onClick={handleFavourite}
          disabled={favLoading}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            transition: "all 0.2s ease",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {favLoading ? (
            <div style={{ width: "16px", height: "16px", border: "2px solid #ef4444", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <Heart size={18} style={{ fill: isFav ? "#ef4444" : "none", color: isFav ? "#ef4444" : "#64748b", transition: "all 0.2s ease" }} />
          )}
        </button>
        
        {featured && (
          <span style={{ position: "absolute", top: "12px", left: "12px", display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, background: "rgba(253,224,71,.95)", color: "#78350f" }}>
            <Star size={10} style={{ fill: "#78350f" }}/> Featured
          </span>
        )}
        
        <span style={{ position: "absolute", bottom: "12px", left: "12px" }}>
          <span style={{ padding: "6px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,rgba(14,165,233,.92),rgba(34,197,94,.92))", backdropFilter: "blur(6px)" }}>
            PKR {Number(car.price).toLocaleString()}
          </span>
        </span>
      </div>

      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 className="hph" style={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {car.brand} {car.model} {car.year}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
          {car.fuelType && <span className="chip cg"><Fuel size={10}/>{car.fuelType}</span>}
          {car.transmission && <span className="chip cb"><Settings2 size={10}/>{car.transmission}</span>}
          {car.location && <span className="chip cs"><MapPin size={10}/>{car.location}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(14,165,233,.08)", marginTop: "auto" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
            <Eye size={12}/> {car.views || 0} views
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: "#0284c7" }}>
            View Details <ArrowRight size={12}/>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  
  // Hero Banner Images
  const heroImages = [
    "/hero1.png",
    "/hero2.png",
    "/hero3.png",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user/favourites", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.favourites) {
            setFavouriteIds(new Set(data.favourites.map(f => f._id)));
          }
        })
        .catch(console.error);
    }
  }, []);

  const updateFavouriteStatus = (carId, isFav) => {
    setFavouriteIds(prev => {
      const newSet = new Set(prev);
      if (isFav) newSet.add(carId);
      else newSet.delete(carId);
      return newSet;
    });
  };

  useEffect(() => {
    const io = setupReveal();
    return () => io?.disconnect();
  }, []);

  useEffect(() => {
    if (loading) return;
    const io = setupReveal();
    return () => io?.disconnect();
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        const [fR, aR] = await Promise.all([
          fetch("/api/public/cars?type=featured&limit=6"),
          fetch("/api/public/cars?type=all&limit=24"),
        ]);
        const fD = await fR.json(), aD = await aR.json();
        if (fD.success) setFeatured(fD.cars);
        if (aD.success) setAll(aD.cars);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filters = ["all","Petrol","Diesel","Hybrid","Electric","CNG"];
  const filtered = filter === "all" ? all : all.filter(c => c.fuelType === filter);
  const brands = ["Toyota","Honda","Suzuki","KIA","Hyundai","BMW","Mercedes","Audi","Nissan","Toyota","Honda","Suzuki","KIA","Hyundai","BMW","Mercedes","Audi","Nissan","MG"];

  // ✅ Footer Wave Animation (useRef + useEffect)
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const svg = footer.querySelector('.footer-wave-bg svg');
    if (!svg) return;

    const lines = svg.querySelectorAll('.wave-line');
    if (!lines.length) return;

    let mouseX = 0.5, mouseY = 0.5;

    const updateLines = () => {
      lines.forEach((line) => {
        const baseY = parseFloat(line.getAttribute('data-base-y'));
        const idx = parseInt(line.getAttribute('data-index'));
        const offset = (idx / lines.length) * 2 - 1;
        const wave = Math.sin(Date.now() / 2000 + idx * 0.5) * 3 + mouseX * 8 + offset * 4;
        const dy = wave * (0.5 + mouseY * 0.5);
        line.setAttribute('transform', `translate(0, ${dy})`);
      });
      requestAnimationFrame(updateLines);
    };

    const handleMouseMove = (e) => {
      const rect = footer.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };

    footer.addEventListener('mousemove', handleMouseMove);
    updateLines();

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // ✅ Video hover play/pause
  const [isVideoHovering, setIsVideoHovering] = useState(false);
  const videoRef = useRef(null);

  const handleVideoHover = () => {
    setIsVideoHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Play error:", e));
    }
  };

  const handleVideoLeave = () => {
    setIsVideoHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="hp">
        <Navbar />

        {/* HERO SECTION */}
        <section className="relative w-full h-[100vh]">
          
          {/* Sliding Background Images */}
          <div className="absolute inset-0 w-full h-full">
            {heroImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Hero ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 backdrop-blur-[1px]" />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentImageIndex
                    ? "w-8 h-2.5 bg-white"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 -translate-y-16 lg:-translate-y-20">
            <h1 className="font-extrabold leading-tight flex flex-col items-center">
              <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-sky-400 via-emerald-400 to-green-700 bg-clip-text text-transparent">
                Find Your Dream Car With
              </span>
              <CTText />
            </h1>
            <p className="mt-6 text-white/90 max-w-xl animate-slide-up delay-150">
              Advanced AI car search and test drives from thousands of vehicles
            </p>
            <HeroSearch />
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
            <span className="text-white/35 tracking-widest" style={{fontSize:"10px",textTransform:"uppercase"}}>Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-white/55 bob" />
            </div>
          </div>
        </section>

        {/* CONTENT AREA WITH SKYBLUE BACKGROUND */}
        <div className="page-bg">
          <div className="relative z-10">
            {/* STATS BAR */}
            <div className="glass-panel">
              <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    {v:"10,000+", l:"Cars Listed",    Icon:Car},
                    {v:"5,000+",  l:"Happy Buyers",   Icon:Users},
                    {v:"50+",     l:"Cities Covered", Icon:MapPin},
                    {v:"25,000+", l:"Daily Visitors", Icon:TrendingUp},
                  ].map(({v,l,Icon},i)=>(
                    <div key={l} data-anim="fade-up" data-delay={String(i)} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:"linear-gradient(135deg,rgba(14,165,233,.12),rgba(34,197,94,.12))"}}>
                        <Icon size={22} style={{color:"#0ea5e9"}}/>
                      </div>
                      <div>
                        <p className="snum">{v}</p>
                        <p style={{color:"#64748b",fontSize:"12px",fontWeight:600}}>{l}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 🎬 VIDEO SECTION - Hover to Play */}
            <section className="py-16 px-6">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 to-emerald-500/10 text-sky-600 text-sm font-semibold mb-3">
                    🎬 Watch Our Story
                  </span>
                  <h2 className="hph text-3xl md:text-4xl font-bold text-gray-800">
                    Experience the <span className="text-sky-600">Future of Car Trading</span>
                  </h2>
                  <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                    Hover on the video to play • Move out to pause
                  </p>
                </div>
                
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900"
                  onMouseEnter={handleVideoHover}
                  onMouseLeave={handleVideoLeave}
                >
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    poster="/promo.png"
                  >
                    <source src="/homevideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Play Icon Overlay - fades out on hover */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                    style={{ opacity: isVideoHovering ? 0 : 1 }}
                  >
                    <div className="play-icon w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl transition-all duration-300">
                      <svg className="w-10 h-10 text-sky-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  🖱️ Hover on video to play • 1:30 min
                </p>
              </div>
            </section>

            {/* BRAND MARQUEE */}
            <div style={{overflow:"hidden",padding:"20px 0",borderBottom:"1px solid rgba(14,165,233,.08)"}}>
              <div className="marquee-track">
                {brands.map((b,i)=>(
                  <div key={i} style={{
                    display:"inline-flex", alignItems:"center", gap:"8px",
                    padding:"8px 28px", marginRight:"8px",
                    background:"rgba(255,255,255,.65)", borderRadius:"99px",
                    border:"1px solid rgba(14,165,233,.12)", backdropFilter:"blur(6px)",
                    fontSize:"13px", fontWeight:700, color:"#475569", whiteSpace:"nowrap"
                  }}>
                    <Car size={9} style={{color:"#0ea5e9"}}/> {b}
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED CARS */}
            {(loading || featured.length > 0) && (
              <section className="dot-bg" style={{padding:"80px 0"}}>
                <div className="max-w-7xl mx-auto px-6">
                  <div data-anim="fade-up" data-delay="0" style={{display:"flex",flexWrap:"wrap",alignItems:"flex-end",justifyContent:"space-between",gap:"16px",marginBottom:"48px"}}>
                    <div>
                      <span className="slabel"><Star size={11} style={{fill:"currentColor"}}/> Featured</span>
                      <h2 className="hph" style={{fontSize:"clamp(26px,4vw,36px)",fontWeight:800,color:"#0f172a",margin:0}}>Top Featured Cars</h2>
                      <p style={{color:"#64748b",fontSize:"14px",marginTop:"6px"}}>Handpicked premium listings — admin & seller verified</p>
                    </div>
                    <button onClick={()=>document.getElementById("listings")?.scrollIntoView({behavior:"smooth"})} style={{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"14px",fontWeight:700,color:"#0284c7",background:"none",border:"none",cursor:"pointer"}}>
                      See all <ChevronRight size={15}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {loading ? [1,2,3].map(i=><div key={i} className="skel" style={{height:"300px"}}/>)
                      : featured.map((car,i)=>(
                        <div key={car._id} data-anim="fade-up" data-delay={String(i % 4)}>
                          <CarCard car={car} featured={true} router={router} isFavourite={favouriteIds.has(car._id)} onFavouriteToggle={updateFavouriteStatus} />
                        </div>
                      ))}
                  </div>
                </div>
              </section>
            )}

            {/* WHY CHOOSE US - WITH MOVING MARQUEE INSIDE */}
            <WhyChooseUs />

            {/* HOW IT WORKS */}
            <section className="dot-bg" style={{padding:"80px 0"}}>
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center" style={{marginBottom:"56px"}}>
                  <div data-anim="fade-up" data-delay="0">
                    <span className="slabel">Simple Process</span>
                    <h2 className="hph" style={{fontSize:"clamp(26px,4vw,36px)",fontWeight:800,color:"#0f172a"}}>How It Works</h2>
                    <p style={{color:"#64748b",marginTop:"10px",fontSize:"14px"}}>Buy or sell — just a few easy steps</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div data-anim="fade-left" data-delay="0">
                      <p className="slabel" style={{marginBottom:"20px"}}>For Buyers</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                      {[
                        {n:"01",t:"Browse & Search",  d:"Find your dream car using AI search or filters — by make, city, or fuel type."},
                        {n:"02",t:"View Full Details", d:"Check complete specifications, multiple photos, price, and seller contact."},
                        {n:"03",t:"Book Test Drive",   d:"Book a test drive directly from the car page — choose your preferred date and time."},
                      ].map(({n,t,d},i)=>(
                        <div key={n} data-anim="fade-left" data-delay={String(i+1)} className="step">
                          <div className="hph" style={{width:"40px",height:"40px",borderRadius:"12px",background:"linear-gradient(135deg,#0ea5e9,#22c55e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0,minWidth:"40px"}}>{n}</div>
                          <div>
                            <p className="hph" style={{fontWeight:700,color:"#0f172a",fontSize:"14px",marginBottom:"4px"}}>{t}</p>
                            <p style={{color:"#64748b",fontSize:"13px",lineHeight:"1.6"}}>{d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div data-anim="fade-right" data-delay="0">
                      <p className="slabel" style={{marginBottom:"20px"}}>For Sellers</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                      {[
                        {n:"01",t:"Sign Up & Upload",  d:"Create a free account and upload car photos — AI will auto-fill all details."},
                        {n:"02",t:"Admin Review",       d:"Your listing gets reviewed and approved within a few hours."},
                        {n:"03",t:"Get Real Buyers",    d:"Receive booking requests, schedule test drives, and close the deal."},
                      ].map(({n,t,d},i)=>(
                        <div key={n} data-anim="fade-right" data-delay={String(i+1)} className="step">
                          <div className="hph" style={{width:"40px",height:"40px",borderRadius:"12px",background:"linear-gradient(135deg,#22c55e,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0,minWidth:"40px"}}>{n}</div>
                          <div>
                            <p className="hph" style={{fontWeight:700,color:"#0f172a",fontSize:"14px",marginBottom:"4px"}}>{t}</p>
                            <p style={{color:"#64748b",fontSize:"13px",lineHeight:"1.6"}}>{d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ALL LISTINGS */}
            <section id="listings" className="glass-panel">
              <div className="max-w-7xl mx-auto px-6 py-20">
                <div data-anim="fade-up" data-delay="0" style={{display:"flex",flexWrap:"wrap",alignItems:"flex-end",justifyContent:"space-between",gap:"20px",marginBottom:"36px"}}>
                  <div>
                    <span className="slabel"><Car size={11}/> All Cars</span>
                    <h2 className="hph" style={{fontSize:"clamp(26px,4vw,36px)",fontWeight:800,color:"#0f172a"}}>Latest Listings</h2>
                    {!loading && <p style={{color:"#64748b",fontSize:"14px",marginTop:"4px"}}>{all.length} cars available right now</p>}
                  </div>
                  <div data-anim="fade-up" data-delay="1" style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                    {filters.map(f=>(
                      <button key={f} onClick={()=>setFilter(f)} className={`fpill${filter===f?" act":""}`}>
                        {f==="all"?"All Types":f}
                      </button>
                    ))}
                  </div>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[1,2,3,4,5,6,7,8].map(i=><div key={i} className="skel" style={{height:"260px"}}/>)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{padding:"80px 0",textAlign:"center"}}>
                    <Car size={52} style={{color:"#cbd5e1",margin:"0 auto 16px"}}/>
                    <p style={{color:"#64748b",fontSize:"18px",fontWeight:600}}>No cars found</p>
                    <p style={{color:"#94a3b8",fontSize:"14px",marginTop:"4px"}}>Try a different filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((car,i)=>(
                      <div key={car._id} data-anim="fade-up" data-delay={String(i % 6)}>
                        <CarCard car={car} router={router} isFavourite={favouriteIds.has(car._id)} onFavouriteToggle={updateFavouriteStatus} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* CTA BANNER */}
            <section style={{background:"linear-gradient(135deg,#0369a1,#0284c7)", padding:"80px 24px", textAlign:"center", position:"relative", overflow:"hidden"}}>
              <div style={{position:"absolute",top:"-60px",right:"-60px",width:"300px",height:"300px",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,.08),transparent)",filter:"blur(44px)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",bottom:"-50px",left:"-50px",width:"240px",height:"240px",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,.06),transparent)",filter:"blur(36px)",pointerEvents:"none"}}/>
              <div style={{position:"relative",zIndex:1,maxWidth:"700px",margin:"0 auto"}}>
                <span className="slabel" style={{color:"#bbf7d0",borderColor:"rgba(187,247,208,.3)",background:"rgba(255,255,255,.1)"}}>Get Started</span>
                <h2 className="hph" style={{fontSize:"clamp(28px,5vw,50px)",fontWeight:800,color:"#fff",margin:"10px 0 14px"}}>Ready to Sell Your Car?</h2>
                <p style={{color:"rgba(255,255,255,.7)",fontSize:"15px",maxWidth:"420px",margin:"0 auto 32px"}}>List for free — AI fills the details, admin verifies, buyers will come to you.</p>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"16px"}}>
                  <button onClick={()=>router.push("/sell/add-car")} className="bprimary">List Your Car — Free <ChevronRight size={16}/></button>
                  <button onClick={()=>router.push("/signup")} className="bghost">Create Account</button>
                </div>
              </div>
            </section>

            {/* ✅ FOOTER WITH YOUR DESIGN + 10 WAVE LINES + ALL WORKING LINKS */}
            <footer ref={footerRef} className="site-footer">
              {/* Wave lines background (10 horizontal thin lines) */}
              <div className="footer-wave-bg">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const y = (i / 9) * 100;
                    return (
                      <line
                        key={i}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        className="wave-line"
                        data-index={i}
                        data-base-y={y}
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="footer-inner">
                <div className="footer-grid">
                  <div>
                    <div className="footer-brand">CarTradeHub<span className="dot">.</span></div>
                    <p className="footer-desc">
                      Pakistan's trusted car marketplace. Every listing is checked for accuracy so buyers and sellers can deal with confidence.
                    </p>
                    <div className="footer-social">
                      <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://facebook.com', '_blank'); }} aria-label="Facebook"><Facebook size={15} /></a>
                      <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://instagram.com', '_blank'); }} aria-label="Instagram"><Instagram size={15} /></a>
                      <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://twitter.com', '_blank'); }} aria-label="Twitter"><Twitter size={15} /></a>
                      <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://youtube.com', '_blank'); }} aria-label="YouTube"><Youtube size={15} /></a>
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
                      <li><a onClick={() => router.push("/help")}>Help Center</a></li>
                      <li><a onClick={() => router.push("/how-it-works")}>How Buying Works</a></li>
                      <li><a onClick={() => router.push("/how-it-works")}>How Selling Works</a></li>
                      <li><a onClick={() => router.push("/privacy")}>Terms & Privacy</a></li>
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
                <div className="footer-bottom">
                  <span>© {new Date().getFullYear()} CarTradeHub. All rights reserved.</span>
                  <div className="footer-bottom-links">
                    <a onClick={() => router.push("/privacy")}>Privacy Policy</a>
                    <a onClick={() => router.push("/terms")}>Terms of Service</a>
                    <a onClick={() => router.push("/sitemap")}>Sitemap</a>
                  </div>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   WHY CHOOSE US - FULLY RESPONSIVE WITH 3D CAR
═══════════════════════════════════════════ */
function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .why-wrap {
          perspective: 1200px;
          perspective-origin: 50% 100%;
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
          border-radius: 40px;
          position: relative;
          overflow: hidden;
        }
        .why-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(14,165,233,0.1), transparent 70%);
          pointer-events: none;
        }

        .car-3d {
          transform: translateZ(-5000px) translateY(220px) scale(0.02);
          opacity: 0;
          transform-origin: bottom center;
          transition: all 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .car-3d.go {
          transform: translateZ(320px) translateY(-20px) scale(1.25);
          opacity: 1;
        }

        .car-shadow-w {
          transform: translateX(-50%) scaleX(0.04);
          opacity: 0;
          transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
        }
        .car-shadow-w.go {
          transform: translateX(-50%) scaleX(1.2);
          opacity: 0.55;
        }

        .why-feat {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .why-feat.go {
          opacity: 1;
          transform: translateY(0);
        }
        .why-feat:nth-child(1) { transition-delay: 0.7s; }
        .why-feat:nth-child(2) { transition-delay: 0.85s; }
        .why-feat:nth-child(3) { transition-delay: 1.0s; }
        .why-feat:nth-child(4) { transition-delay: 1.15s; }
        
        .why-feat-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: default;
          border: 1px solid rgba(14,165,233,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          height: 100%;
        }
        .why-feat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 16px 40px rgba(14,165,233,0.1);
        }
        
        @media (max-width: 768px) {
          .why-wrap {
            border-radius: 24px;
            height: 320px !important;
          }
          .car-3d.go {
            transform: translateZ(200px) translateY(-10px) scale(0.9);
          }
          .why-feat-card {
            padding: 18px 12px;
          }
          .why-feat-card .text-2xl {
            font-size: 24px;
          }
          .hph.text-3xl {
            font-size: 24px;
          }
        }
        @media (max-width: 640px) {
          .why-wrap {
            height: 260px !important;
          }
          .car-3d.go {
            transform: translateZ(150px) translateY(-5px) scale(0.7);
          }
          .why-feat-card {
            padding: 14px 10px;
          }
          .why-feat-card .w-14 {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>

      <section ref={sectionRef} className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto relative">
          
          {/* MOVING MARQUEE INSIDE WHY CHOOSE US */}
          <div className="why-bg-marquee">
            <div className="why-marquee-track">
              <span>🚗 CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>🚗 CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>🚗 CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>🚗 CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>🚗 CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>🚗 CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
              <span>CarTradeHub</span>
              <span>✦ CarTradeHub ✦</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12 relative z-10">
            <p className="text-xs md:text-sm font-semibold tracking-wider text-sky-600 uppercase mb-2 md:mb-3">
              ✨ Why Choose Us
            </p>
            <h2 className="hph text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              The Smarter Way to <span className="text-sky-600">Buy & Sell</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-2 md:mt-3 max-w-2xl mx-auto px-4">
              We're redefining the car marketplace with cutting-edge technology and exceptional service
            </p>
          </div>

          {/* 3D Car Stage */}
          <div className="why-wrap mb-8 md:mb-12 relative z-10" style={{
            position: "relative",
            height: "min(420px, 60vw)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.15) 2px, transparent 2px)",
              backgroundSize: "min(28px, 4vw) min(28px, 4vw)",
              maskImage: "radial-gradient(ellipse 88% 82% at 58% 58%, black 20%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 88% 82% at 58% 58%, black 20%, transparent 100%)",
            }}/>

            <div className={`car-shadow-w${triggered ? " go" : ""}`} style={{
              position: "absolute",
              bottom: "min(20px, 5%)",
              left: "50%",
              width: "min(520px, 80vw)",
              height: "min(28px, 4vw)",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              zIndex: 1,
            }}/>

            <div className={`car-3d${triggered ? " go" : ""}`} style={{
              position: "relative",
              zIndex: 2,
              width: "min(580px, 85vw)",
              maxWidth: "85vw",
            }}>
              <img
                src="/banner2.png"
                alt="Luxury Car"
                style={{
                  width: "100%",
                  objectFit: "contain",
                  display: "block",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))"
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `<svg viewBox="0 0 580 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.2))">
                    <defs>
                      <linearGradient id="carBody" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#0ea5e9"/>
                        <stop offset="100%" stop-color="#22c55e"/>
                      </linearGradient>
                      <linearGradient id="carRoof" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#0284c7"/>
                        <stop offset="100%" stop-color="#0369a1"/>
                      </linearGradient>
                    </defs>
                    <rect x="60" y="120" width="460" height="72" rx="18" fill="url(#carBody)"/>
                    <path d="M170 118 Q195 62 250 56 L350 56 Q395 60 410 118Z" fill="url(#carRoof)"/>
                    <path d="M190 116 L202 58 L294 56 L294 116Z" fill="rgba(186,230,253,0.7)"/>
                    <path d="M304 116 L304 56 L350 56 Q388 62 398 116Z" fill="rgba(186,230,253,0.7)"/>
                    <rect x="295" y="56" width="9" height="60" fill="#0369a1"/>
                    <path d="M204 84 Q290 70 376 78" stroke="rgba(255,255,255,0.4)" stroke-width="5" fill="none"/>
                    <ellipse cx="88" cy="145" rx="24" ry="12" fill="#fde68a" opacity="0.95"/>
                    <ellipse cx="500" cy="145" rx="16" ry="10" fill="#fca5a5" opacity="0.85"/>
                    <rect x="62" y="155" width="70" height="26" rx="8" fill="#0284c7" opacity="0.7"/>
                    <rect x="452" y="155" width="66" height="26" rx="8" fill="#0284c7" opacity="0.7"/>
                    <circle cx="174" cy="190" r="34" fill="#0f172a"/>
                    <circle cx="174" cy="190" r="22" fill="#334155"/>
                    <circle cx="174" cy="190" r="10" fill="#94a3b8"/>
                    <circle cx="416" cy="190" r="34" fill="#0f172a"/>
                    <circle cx="416" cy="190" r="22" fill="#334155"/>
                    <circle cx="416" cy="190" r="10" fill="#94a3b8"/>
                    <path d="M135 183 Q174 150 213 183" stroke="#0284c7" stroke-width="5" fill="none"/>
                    <path d="M377 183 Q416 150 455 183" stroke="#0284c7" stroke-width="5" fill="none"/>
                    <circle cx="290" cy="100" r="3" fill="#fff" opacity="0.6"/>
                  </svg>`;
                }}
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 relative z-10">
            {[
              {
                title: "Best Prices",
                sub: "Most competitive rates — no hidden charges.",
                icon: "💰",
                gradient: "from-sky-100 to-sky-50"
              },
              {
                title: "Fast & Efficient",
                sub: "List and sell your car within 24 hours.",
                icon: "⚡",
                gradient: "from-emerald-100 to-emerald-50"
              },
              {
                title: "Secure Deals",
                sub: "Admin verified buyers and sellers — 100% safe.",
                icon: "🛡️",
                gradient: "from-sky-100 to-sky-50"
              },
              {
                title: "5-Star Service",
                sub: "Trusted by thousands of satisfied customers.",
                icon: "⭐",
                gradient: "from-emerald-100 to-emerald-50"
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`why-feat${triggered ? " go" : ""} why-feat-card`}
                style={{ animationDelay: `${0.7 + i * 0.15}s` }}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-2 md:mb-3 text-xl md:text-2xl`}>
                  {feature.icon}
                </div>
                <p className="hph font-bold text-gray-800 text-xs sm:text-sm md:text-base">{feature.title}</p>
                <p className="text-gray-500 text-[10px] sm:text-xs md:text-xs mt-1 md:mt-2 leading-relaxed px-1">
                  {feature.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}