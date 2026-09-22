"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Eye, Car, TrendingUp, Calendar, Clock, Trash2, Edit3, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import CountUp from "react-countup";

// ✅ Theme Colors — Green = Active, Light Blue = Pending, Slate = Sold
const STATUS_COLORS = {
  active:  "#22c55e", // green
  pending: "#38bdf8", // light blue
  sold:    "#94a3b8", // neutral slate
};

const STATUS_CONFIG = {
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.15)",  icon: CheckCircle },
  pending:  { label: "Pending",  color: "#38bdf8", bg: "rgba(56,189,248,0.15)", icon: AlertCircle },
  sold:     { label: "Sold",     color: "#94a3b8", bg: "rgba(148,163,184,0.15)", icon: XCircle },
};

export default function MyAdsPage() {
  const router = useRouter();
  const [ads, setAds]           = useState([]);
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [showSlider, setShowSlider]     = useState(false);
  const [activeImages, setActiveImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ─── Fetch Ads ─── */
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const cached = localStorage.getItem("my_ads_cache");
        if (cached) {
          setAds(JSON.parse(cached));
          localStorage.removeItem("my_ads_cache");
          return;
        }

        const res = await fetch(`/api/my-ads?sellerId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setAds(data.cars || []);
      } catch (err) { console.error("Fetch Ads Error:", err); }
    };
    fetchAds();
  }, []);

  /* ─── Fetch Booking Requests ─── */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/test-drive/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) { console.error("Fetch Requests Error:", err); }
    };
    fetchRequests();
  }, []);

  /* ─── Fetch Analytics ─── */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const user  = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !token) return;
        const res = await fetch(`/api/seller/analytics?sellerId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (err) { console.error("Analytics Error:", err); }
    };
    fetchAnalytics();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    const token = localStorage.getItem("token");

    const deletedAd = ads.find((ad) => ad._id === id);
    setAds((prev) => prev.filter((ad) => ad._id !== id));

    if (analytics && deletedAd) {
      setAnalytics((prev) => ({
        ...prev,
        totalAds:  Math.max(0, prev.totalAds - 1),
        activeAds: deletedAd.status === "approved" ? Math.max(0, prev.activeAds - 1) : prev.activeAds,
        soldAds:   deletedAd.status === "sold"     ? Math.max(0, prev.soldAds - 1)   : prev.soldAds,
      }));
    }

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedAds = ads.filter((ad) => ad._id !== id);
        localStorage.setItem("my_ads_cache", JSON.stringify(updatedAds));
      } else {
        setAds((prev) => [...prev, deletedAd]);
        if (analytics && deletedAd) {
          setAnalytics((prev) => ({
            ...prev,
            totalAds:  prev.totalAds + 1,
            activeAds: deletedAd.status === "approved" ? prev.activeAds + 1 : prev.activeAds,
            soldAds:   deletedAd.status === "sold"     ? prev.soldAds + 1   : prev.soldAds,
          }));
        }
        alert("Delete failed. Please try again.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setAds((prev) => [...prev, deletedAd]);
      alert("Network error. Please try again.");
    }
  };

  const handleView = (images) => {
    setActiveImages(images || []);
    setCurrentIndex(0);
    setShowSlider(true);
  };
  const nextImage = () => setCurrentIndex((p) => (p === activeImages.length - 1 ? 0 : p + 1));
  const prevImage = () => setCurrentIndex((p) => (p === 0 ? activeImages.length - 1 : p - 1));

  // ✅ Pie data + matching legend, in a single source of truth so chart & legend never drift apart
  const pieSegments = analytics
    ? [
        { key: "active",  name: "Active Ads",  value: analytics.activeAds, color: STATUS_COLORS.active },
        { key: "pending", name: "Pending Ads", value: analytics.totalAds - analytics.activeAds - analytics.soldAds, color: STATUS_COLORS.pending },
        { key: "sold",    name: "Sold Ads",    value: analytics.soldAds, color: STATUS_COLORS.sold },
      ]
    : [];

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f7fa 100%)"
    }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12">

        {/* ── STAT CARDS ── */}
        {analytics && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              { title: "Total Ads",   value: analytics.totalAds,        icon: Car,          color: "#38bdf8" }, // sky blue
              { title: "Active Ads",  value: analytics.activeAds,       icon: CheckCircle,  color: "#15803d" }, // green-700 (matches navbar)
              { title: "Total Views", value: analytics.totalViews,      icon: Eye,           color: "#38bdf8" }, // sky blue
              { title: "Test Drives", value: analytics.totalTestDrives, icon: TrendingUp,    color: "#15803d" }, // green-700 (matches navbar)
            ].map((card, i) => (
              <StatCard key={i} title={card.title} value={card.value} icon={card.icon} color={card.color} index={i} />
            ))}
          </motion.div>
        )}

        {/* ── MY ADS + PIE CHART ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* My Ads List */}
          <div className="flex-1 min-w-0 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">My Ads</h1>

            {ads.length === 0 ? (
              <div className="glass-card text-center py-16">
                <Car size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No ads found. Post your first car!</p>
                <button
                  onClick={() => router.push("/sell/add-car")}
                  className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#0097a7] text-white font-semibold hover:shadow-lg transition"
                >
                  Post Your First Ad
                </button>
              </div>
            ) : (
              ads.map((ad) => {
                const image = ad.images?.length > 0 ? ad.images[0] : "/placeholder.png";
                const cfg   = STATUS_CONFIG[ad.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={ad._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{
                      y: -2,
                      borderColor: "#16a34a",
                      boxShadow: "0 8px 25px rgba(34,197,94,0.3)",
                    }}
                    className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center rounded-[20px]"
                    style={{
                      background: "#ffffff",
                      border: "2px solid #22c55e",
                      boxShadow: "0 4px 15px rgba(34,197,94,0.08)",
                    }}
                  >
                    {/* Image */}
                    <img
                      src={image}
                      alt="car"
                      className="w-full md:w-36 h-28 md:h-28 object-cover rounded-xl flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h2 className="text-gray-800 font-bold text-lg">{ad.brand} {ad.model} {ad.year}</h2>
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                          <StatusIcon size={11} /> {cfg.label}
                        </span>
                      </div>

                      <p className="text-xl font-bold mb-2 text-[#0097a7]">
                        PKR {ad.price?.toLocaleString() || 0}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Eye size={11} className="text-[#22c55e]" /> {ad.views || 0} views</span>
                        <span className="flex items-center gap-1"><Car size={11} className="text-[#22c55e]" /> {ad.testDriveCount || 0} test drives</span>
                        <span className="flex items-center gap-1"><Calendar size={11} className="text-[#22c55e]" /> {new Date(ad.createdAt).toDateString()}</span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleView(ad.images)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-md"
                          style={{ background: "linear-gradient(135deg, #22c55e, #0097a7)" }}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => router.push(`/sell/add-car?id=${ad._id}`)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.3)" }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Pie Chart */}
          {analytics && (
            <div className="w-72 flex-shrink-0 self-start glass-card p-6">
              <h2 className="text-gray-800 font-bold text-lg mb-4 text-center">Ads Status</h2>
              <div style={{ width: "240px", height: "240px" }} className="mx-auto">
                <PieChart width={240} height={240}>
                  <Pie
                    data={pieSegments}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive
                  >
                    {pieSegments.map((seg, index) => (
                      <Cell key={index} fill={seg.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#ffffff", border: "1px solid #e0f7fa", borderRadius: "12px", color: "#333" }}
                  />
                </PieChart>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                {pieSegments.map(({ key, color, name, value }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-gray-600 text-sm">{name}</span>
                    </div>
                    <span className="text-gray-800 font-bold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BOOKING REQUESTS ── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Booking Requests</h2>

          {requests.length === 0 ? (
            <div className="glass-card text-center py-14">
              <Calendar size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No test drive requests yet.</p>
            </div>
          ) : (
            requests.map((r) => (
              <motion.div
                key={r._id}
                whileHover={{
                  y: -2,
                  borderColor: "#16a34a",
                  boxShadow: "0 8px 25px rgba(34,197,94,0.3)",
                }}
                className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-[20px]"
                style={{
                  background: "#ffffff",
                  border: "2px solid #22c55e",
                  boxShadow: "0 4px 15px rgba(34,197,94,0.08)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: "linear-gradient(135deg, #22c55e, #0097a7)" }}>
                    {r.buyer?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">{r.buyer?.name}</p>
                    <p className="text-gray-500 text-sm">{r.car?.brand} {r.car?.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#16a34a]" style={{ background: "rgba(34,197,94,0.12)" }}>
                    <Calendar size={12} /> {r.date}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0284c7]" style={{ background: "rgba(56,189,248,0.15)" }}>
                    <Clock size={12} /> {r.time}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ── IMAGE SLIDER MODAL ── */}
      {showSlider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
          onClick={() => setShowSlider(false)}
        >
          <div
            className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #e0f7fa" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImages[currentIndex] || "/placeholder.png"}
              alt="car"
              className="w-full h-80 object-cover"
            />

            {/* Close */}
            <button
              onClick={() => setShowSlider(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <X size={16} />
            </button>

            {/* Prev / Next */}
            {activeImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "rgba(0,0,0,0.6)" }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "rgba(0,0,0,0.6)" }}>
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="flex justify-center gap-2 py-3" style={{ background: "rgba(0,0,0,0.4)" }}>
              {activeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ background: i === currentIndex ? "#22c55e" : "rgba(255,255,255,0.3)" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        .glass-card {
          background: #ffffff;
          border-radius: 20px;
          border: 2px solid #22c55e;
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: #ffffff;
          border-color: #16a34a;
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ title, value, icon: Icon, color, index }) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{
        background: color,
        boxShadow: `0 6px 18px ${color}55`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -4,
        background: "#15803d",
        boxShadow: "0 10px 25px rgba(21,128,61,0.45)",
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">{title}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.25)" }}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white">
        <CountUp end={value || 0} duration={1.5} separator="," />
      </h2>
    </motion.div>
  );
}