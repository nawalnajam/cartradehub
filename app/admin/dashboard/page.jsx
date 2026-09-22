"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Car, CalendarCheck, Settings, LogOut,
  CheckCircle, XCircle, Trash2, Shield, Search, Upload,
  AlertCircle, Star, Zap, TrendingUp, Activity, Eye,
  User, Mail, Lock, Bell, Database, Server, RefreshCw,
  ChevronRight, Save, Key, Globe
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .adm-root { font-family: 'DM Sans', sans-serif; }
  .adm-heading { font-family: 'Syne', sans-serif; }

  @keyframes fadeSlideUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pulseGlow {
    0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0)}
    50%{box-shadow:0 0 18px 4px rgba(56,189,248,0.2)}
  }
  @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes countUp { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
  @keyframes sidebarIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes toastIn { from{opacity:0;transform:translateY(-12px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes modalFadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }

  .anim-fadeSlideUp  { animation:fadeSlideUp 0.45s ease both; }
  .anim-fadeIn       { animation:fadeIn 0.35s ease both; }
  .anim-pulseGlow    { animation:pulseGlow 2.5s ease-in-out infinite; }
  .anim-rotateSlow   { animation:rotateSlow 8s linear infinite; }
  .anim-countUp      { animation:countUp 0.55s cubic-bezier(.22,1,.36,1) both; }
  .anim-sidebarIn    { animation:sidebarIn 0.4s ease both; }
  .anim-toastIn      { animation:toastIn 0.4s cubic-bezier(.22,1,.36,1) both; }
  .anim-modalIn      { animation:modalFadeIn 0.3s cubic-bezier(.22,1,.36,1) both; }

  .d1{animation-delay:0.05s} .d2{animation-delay:0.1s} .d3{animation-delay:0.15s} .d4{animation-delay:0.2s}

  .glass {
    background: rgba(255,255,255,0.9);
    border: 1px solid rgba(56,189,248,0.2);
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
  }
  .glass:hover {
    background: rgba(255,255,255,0.95);
    border-color: rgba(56,189,248,0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(56,189,248,0.15);
  }

  .stat-card {
    position:relative; overflow:hidden;
    transition:all 0.35s cubic-bezier(.22,1,.36,1);
  }
  .stat-card:hover { transform:translateY(-4px) scale(1.02); }

  .nav-btn {
    position:relative; transition:all 0.25s ease; overflow:hidden;
  }
  .nav-btn::after {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    border-radius:0 2px 2px 0;
    background:linear-gradient(180deg,#38bdf8,#22c55e);
    opacity:0; transition:opacity 0.25s;
  }
  .nav-btn.nav-active::after { opacity:1; }
  .nav-btn:hover { background:rgba(56,189,248,0.1) !important; }

  .upload-zone { transition:all 0.3s ease; cursor:pointer; }
  .upload-zone:hover { transform:scale(1.01); box-shadow:0 8px 32px rgba(56,189,248,0.15); }

  .act-btn { transition:all 0.2s cubic-bezier(.22,1,.36,1); }
  .act-btn:hover { transform:scale(1.18); }

  .tbl-header { display:grid !important; grid-template-columns: 60px 1fr 130px 100px 60px 110px 50px 100px; gap:12px; width:100%; align-items:center; }
  .table-row { display:grid !important; grid-template-columns: 60px 1fr 130px 100px 60px 110px 50px 100px; align-items:center; gap:12px; width:100%; transition:background 0.2s ease; border-bottom:1px solid rgba(56,189,248,0.1); }
  .table-row:hover { background:rgba(56,189,248,0.05); }

  .inp {
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(56,189,248,0.2);
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
  }
  .inp:focus { background: rgba(255,255,255,0.95); border-color: rgba(56,189,248,0.6); box-shadow:0 0 0 3px rgba(56,189,248,0.1); }
  .inp::placeholder { color: rgba(100,116,139,0.5); }

  .sel { background: rgba(255,255,255,0.8); border: 1px solid rgba(56,189,248,0.2); color: #1e293b; outline: none; transition: border 0.2s; }
  .sel:focus { border-color: rgba(56,189,248,0.6); }

  .add-btn {
    background: linear-gradient(135deg, #38bdf8, #22c55e);
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    position:relative; overflow:hidden;
  }
  .add-btn::before {
    content:''; position:absolute; top:0; left:-100%; width:100%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
    transition:left 0.5s;
  }
  .add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(56,189,248,0.4); }
  .add-btn:hover::before { left:100%; }
  .add-btn:disabled { opacity:0.6; }

  .mesh-bg {
    background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #f0f9ff 100%);
  }
  .sidebar-bg {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(56,189,248,0.2);
  }
  .pending-l {
    border-left: 3px solid rgba(255,152,0,0.6) !important;
    transition: transform 0.3s;
  }
  .pending-l:hover { transform:translateX(4px); }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background: #dbeafe; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #38bdf8, #22c55e); border-radius: 10px; }

  .tab-line { transition:all 0.3s cubic-bezier(.22,1,.36,1); }
  
  .modal-overlay {
    position:fixed; top:0; left:0; right:0; bottom:0;
    background:rgba(0,0,0,0.85); backdrop-filter:blur(8px);
    z-index:1000; display:flex; align-items:center; justify-content:center;
    padding:20px;
  }
  .modal-content {
    max-width:900px; width:100%; max-height:85vh; overflow-y:auto;
    border-radius:28px; background:#ffffff;
    border:1px solid rgba(56,189,248,0.3);
    box-shadow:0 25px 50px -12px rgba(0,0,0,0.3);
  }
  .modal-content::-webkit-scrollbar { width:4px; }

  .settings-card {
    background: white;
    border-radius: 16px;
    padding: 20px 24px;
    border: 1px solid rgba(56,189,248,0.12);
    transition: all 0.3s ease;
  }
  .settings-card:hover {
    border-color: rgba(56,189,248,0.3);
    box-shadow: 0 4px 20px rgba(56,189,248,0.08);
  }

  .toggle-on {
    background: linear-gradient(135deg, #38bdf8, #22c55e);
  }
  .toggle-off {
    background: #cbd5e1;
  }
`;

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"cars",      label:"Cars",      icon:Car },
  { id:"testdrives",label:"Test Drives",icon:CalendarCheck },
  { id:"settings",  label:"Settings",  icon:Settings },
];

const SCFG = {
  approved:{ color:"#4caf50", bg:"rgba(76,175,80,0.12)",  label:"Approved" },
  pending: { color:"#ff9800", bg:"rgba(255,152,0,0.12)", label:"Pending"  },
  rejected:{ color:"#f44336", bg:"rgba(244,67,54,0.12)",  label:"Rejected" },
  sold:    { color:"#9e9e9e", bg:"rgba(158,158,158,0.12)",label:"Sold"     },
};

const CHART_COLORS = ["#4caf50", "#ff9800", "#f44336", "#9e9e9e"];

function CountUp({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!to) return;
    let n = 0;
    const step = Math.ceil(to / 28);
    const t = setInterval(() => { n += step; if (n >= to) { setV(to); clearInterval(t); } else setV(n); }, 28);
    return () => clearInterval(t);
  }, [to]);
  return <>{v}</>;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total;
    const percentage = ((payload[0].value / total) * 100).toFixed(1);
    return (
      <div className="rounded-xl px-3 py-2 text-sm" style={{ background: "#ffffff", border: "1px solid rgba(56,189,248,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-[#0ea5e9] font-bold">{payload[0].value} cars</p>
        <p className="text-gray-500 text-xs">{percentage}%</p>
      </div>
    );
  }
  return null;
};


function PreviewModal({ car, onClose, onApprove, onReject }) {
  if (!car) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content anim-modalIn" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-100 bg-white rounded-t-2xl">
          <div>
            <h2 className="adm-heading text-xl font-bold text-gray-800">Ad Preview</h2>
            <p className="text-gray-500 text-sm">Review seller's car ad before approving</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                car.status === "pending" ? "bg-amber-100 text-amber-700" :
                car.status === "approved" ? "bg-green-100 text-green-700" :
                "bg-red-100 text-red-700"
              }`}>
                {car.status?.toUpperCase() || "PENDING"}
              </span>
              {car.featured && (
                <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">⭐ FEATURED</span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Posted by:</p>
              <p className="text-sm text-gray-800 font-medium">{car.seller?.name || "Admin Car"}</p>
            </div>
          </div>
          
          <div>
            <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100">
              <img src={car.images?.[0] || "/hero.png"} alt={car.model} className="w-full h-full object-cover" />
            </div>
            {car.images?.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {car.images.slice(1, 6).map((img, idx) => (
                  <img key={idx} src={img} alt="" className="w-20 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80" />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{car.brand} {car.model} {car.year}</h1>
              <p className="text-gray-500 mt-1">{car.variant} • {car.bodyType}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#0ea5e9]">PKR {Number(car.price).toLocaleString()}</p>
              <p className="text-xs text-gray-500">{car.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50">
            <div><p className="text-xs text-gray-500">Fuel Type</p><p className="text-gray-800 text-sm font-medium">{car.fuelType || "—"}</p></div>
            <div><p className="text-xs text-gray-500">Transmission</p><p className="text-gray-800 text-sm font-medium">{car.transmission || "—"}</p></div>
            <div><p className="text-xs text-gray-500">Condition</p><p className="text-gray-800 text-sm font-medium">{car.condition || "—"}</p></div>
            <div><p className="text-xs text-gray-500">Color</p><p className="text-gray-800 text-sm font-medium">{car.color || "—"}</p></div>
          </div>
          
          {(car.description || car.additionalInfo) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{car.description || car.additionalInfo}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Full Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50">
              <SpecItem label="Brand" value={car.brand} />
              <SpecItem label="Model" value={car.model} />
              <SpecItem label="Year" value={car.year} />
              <SpecItem label="Variant" value={car.variant} />
              <SpecItem label="Body Type" value={car.bodyType} />
              <SpecItem label="Color" value={car.color} />
              <SpecItem label="Fuel Type" value={car.fuelType} />
              <SpecItem label="Transmission" value={car.transmission} />
              <SpecItem label="Engine" value={car.engine} />
              <SpecItem label="Assembly" value={car.assembly} />
              <SpecItem label="Drive Type" value={car.driveType} />
              <SpecItem label="Doors" value={car.doors} />
              <SpecItem label="Wheel Type" value={car.wheelType} />
              <SpecItem label="Headlights" value={car.headlights} />
              <SpecItem label="Seats" value={car.seats} />
            </div>
          </div>
          
          {car.seller && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#38bdf8]/10 to-[#22c55e]/10 border border-[#38bdf8]/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#22c55e] flex items-center justify-center">
                  <span className="text-white font-bold">{car.seller.name?.[0] || "S"}</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{car.seller.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">{car.seller.email || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {car.status === "pending" && (
          <div className="sticky bottom-0 flex justify-end gap-3 p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <button onClick={() => onReject(car._id)} className="px-6 py-2.5 rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all font-medium text-sm">
              <XCircle size={16} className="inline mr-2" /> Reject Ad
            </button>
            <button onClick={() => onApprove(car._id)} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#22c55e] text-white hover:shadow-lg transition-all font-medium text-sm">
              <CheckCircle size={16} className="inline mr-2" /> Approve Ad
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-800 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]           = useState("dashboard");
  const [token, setToken]       = useState(null);
  const [admin, setAdmin]       = useState(null);
  const [cars, setCars]         = useState([]);
  const [drives, setDrives]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [mode, setMode]         = useState("manual");
  const [aiImgs, setAiImgs]     = useState([]);
  const [manImgs, setManImgs]   = useState([]);
  const [aiLoad, setAiLoad]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]       = useState("");
  const [previewCar, setPreviewCar] = useState(null);
  
  const [settings, setSettings] = useState({
    name: "Administrator",
    email: "admin@cartradehub.pk",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    emailAlerts: true,
    systemAlerts: false,
  });
  
  const [form, setForm]         = useState({
    brand:"",model:"",year:"",bodyType:"",color:"",fuelType:"",
    transmission:"",seats:"",driveType:"",headlights:"",condition:"",
    description:"",additionalInfo:"",price:"",location:"",featured:false,
  });

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    const a = JSON.parse(localStorage.getItem("admin") || "null");
    if (!t || !a) { router.push("/signin"); return; }
    setToken(t); setAdmin(a);
    if (a?.email) {
      setSettings(prev => ({ ...prev, email: a.email }));
    }
  }, []);

  const loadCars = async (t) => {
    try { 
      setLoading(true); 
      const r = await fetch("/api/admin/cars", { headers: { Authorization: `Bearer ${t}` } }); 
      const d = await r.json(); 
      if (d.success) {
        setCars(d.cars || []);
      }
    } catch(e){ 
      console.error("Error loading cars:", e);
      setCars([]); 
    } 
    finally { setLoading(false); }
  };
  
  const loadDrives = async (t) => {
    try { 
      const r = await fetch("/api/admin/testdrives", { headers: { Authorization: `Bearer ${t}` } }); 
      const d = await r.json(); 
      if (d.success) {
        setDrives(d.drives || []); 
      } else {
        setDrives([]);
      }
    } catch(e) { 
      console.error("Error loading drives:", e);
      setDrives([]);
    }
  };

  useEffect(() => { 
    if (!token) return; 
    loadCars(token); 
    loadDrives(token); 
  }, [token]);

  const patchCar = async (id, body) => {
    const r = await fetch(`/api/admin/cars/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    if (d.success) {
      setCars(p => p.map(c => c._id === id ? { ...c, ...body } : c));
      setPreviewCar(null);
    }
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car?")) return;
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setCars(p => p.filter(c => c._id !== id));
  };

  const toB64 = f => new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.readAsDataURL(f);
  });

  const runAI = async (files) => {
    try {
      setAiLoad(true);
      const imgs = await Promise.all(files.map(toB64));
      const r = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imgs })
      });
      const d = await r.json();
      if (d.success) {
        const data = d.data;
        const autoDesc = `${data.year || ""} ${data.brand || ""} ${data.model || ""} ${data.variant || ""} — ${data.color || ""} color, ${data.bodyType || ""}, ${data.fuelType || ""} engine, ${data.transmission || ""} transmission. Condition: ${data.condition || "Good"}.`.replace(/\s+/g, " ").trim();
        setForm(p => ({ ...p, ...data, description: p.description || autoDesc }));
      }
    } catch {} 
    finally { setAiLoad(false); }
  };

  const upload = async (files) => {
    const urls = [];
    for (let f of files) {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("upload_preset", "cartradehub");
      fd.append("cloud_name", "dwlmg5ycn");
      const r = await fetch("https://api.cloudinary.com/v1_1/dwlmg5ycn/image/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (d.secure_url) urls.push(d.secure_url);
    }
    return urls;
  };

  const addCar = async () => {
    if (!form.price || !form.location) { alert("Price and Location required"); return; }
    try {
      setUploading(true);
      const files = mode === "ai" ? aiImgs : manImgs;
      const imgUrls = files.length > 0 ? await upload(files) : [];
      const r = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: String(form.price).replace(/,/g, ""),
          images: imgUrls,
          status: "approved",
          featured: form.featured || false
        })
      });
      const d = await r.json();
      if (d.success) {
        setCars(p => [d.car, ...p]);
        setForm({
          brand: "", model: "", year: "", bodyType: "", color: "", fuelType: "",
          transmission: "", seats: "", driveType: "", headlights: "", condition: "",
          description: "", additionalInfo: "", price: "", location: "", featured: false
        });
        setAiImgs([]);
        setManImgs([]);
        setToast("✅ Car added to inventory!");
        setTimeout(() => setToast(""), 3500);
      } else { alert("❌ " + (d.message || "Error")); }
    } catch(e) { alert("❌ " + e.message); } 
    finally { setUploading(false); }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    router.push("/signin");
  };

  const filtered = cars.filter(c => {
    const ms = filter === "all" || c.status === filter;
    const mq = !search || `${c.brand} ${c.model} ${c.location}`.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  // Pie Chart Data
  const pieChartData = [
    { name: "Approved", value: cars.filter(c => c.status === "approved").length },
    { name: "Pending", value: cars.filter(c => c.status === "pending").length },
    { name: "Rejected", value: cars.filter(c => c.status === "rejected").length },
    { name: "Sold", value: cars.filter(c => c.status === "sold").length }
  ].filter(d => d.value > 0);

  const totalCars = cars.length;
  const pieDataWithTotal = pieChartData.map(d => ({ ...d, total: totalCars }));

  const stats = { 
    total: totalCars, 
    pending: cars.filter(c => c.status === "pending").length, 
    approved: cars.filter(c => c.status === "approved").length, 
    drives: drives.length 
  };

  const handleSettingsUpdate = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (settings.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    alert("✅ Password updated successfully!");
    setSettings(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const handleProfileUpdate = () => {
    alert("✅ Profile updated successfully!");
  };

  if (!token) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="adm-root flex min-h-screen mesh-bg" style={{ color: "#1e293b" }}>

        {/* PREVIEW MODAL */}
        {previewCar && (
          <PreviewModal
            car={previewCar}
            onClose={() => setPreviewCar(null)}
            onApprove={(id) => patchCar(id, { status: "approved" })}
            onReject={(id) => patchCar(id, { status: "rejected" })}
          />
        )}

        {/* SIDEBAR */}
        <aside className="sidebar-bg w-64 flex-shrink-0 flex flex-col" style={{ position: "sticky", top: 0, height: "100vh" }}>
          <div className="p-6 anim-fadeIn" style={{ borderBottom: "1px solid rgba(56,189,248,0.15)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center anim-pulseGlow"
                style={{ background: "linear-gradient(135deg,#38bdf8,#22c55e)" }}>
                <Shield size={19} className="text-white" />
              </div>
              <div>
                <p className="adm-heading text-gray-800 font-bold text-sm tracking-wide">Car Trade Hub</p>
                <p style={{ color: "#64748b", fontSize: "11px" }}>Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 pt-4">
            {NAV.map(({ id, label, icon: Icon }, i) => (
              <button key={id} onClick={() => setTab(id)}
                className={`anim-sidebarIn nav-btn d${i + 1} w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left ${tab === id ? "nav-active" : ""}`}
                style={tab === id
                  ? { background: "linear-gradient(135deg,rgba(56,189,248,0.1),rgba(34,197,94,0.1))", color: "#0ea5e9", border: "1px solid rgba(56,189,248,0.3)" }
                  : { color: "#64748b", border: "1px solid transparent" }}>
                <Icon size={16} />
                {label}
                {id === "cars" && stats.pending > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold anim-pulseGlow"
                    style={{ background: "rgba(255,152,0,0.15)", color: "#ff9800" }}>{stats.pending}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4" style={{ borderTop: "1px solid rgba(56,189,248,0.15)" }}>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: "rgba(56,189,248,0.08)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm adm-heading"
                style={{ background: "linear-gradient(135deg,#38bdf8,#22c55e)" }}>A</div>
              <div>
                <p className="text-gray-800 text-xs font-semibold">Admin</p>
                <p style={{ color: "#64748b", fontSize: "11px" }}>{admin?.email}</p>
              </div>
            </div>
            <button onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
              style={{ background: "rgba(244,67,54,0.1)", color: "#f44336", border: "1px solid rgba(244,67,54,0.2)" }}>
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-auto">

          {/* Toast */}
          {toast && (
            <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold text-white anim-toastIn"
              style={{ background: "linear-gradient(135deg,#38bdf8,#22c55e)", boxShadow: "0 8px 32px rgba(56,189,248,0.35)" }}>
              {toast}
            </div>
          )}

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && (
            <div className="p-8 anim-fadeIn">
              <div className="mb-8">
                <h1 className="adm-heading text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
                <p style={{ color: "#64748b" }}>Welcome Back, Admin</p>
              </div>

              {/* ✅ Stats Cards - FULL COLOR FILL */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {[
                  { label: "Total Cars", val: stats.total, Icon: Car, bg: "#38bdf8", d: "d1" },
                  { label: "Pending", val: stats.pending, Icon: AlertCircle, bg: "#ff9800", d: "d2" },
                  { label: "Approved", val: stats.approved, Icon: CheckCircle, bg: "#4caf50", d: "d3" },
                  { label: "Test Drives", val: stats.drives, Icon: CalendarCheck, bg: "#9c27b0", d: "d4" },
                ].map(({ label, val, Icon, bg, d }) => (
                  <div 
                    key={label} 
                    className={`stat-card rounded-2xl p-5 anim-fadeSlideUp ${d}`}
                    style={{ 
                      background: bg, 
                      color: "#ffffff", 
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                        <Icon size={18} style={{ color: "#ffffff" }} />
                      </div>
                      <TrendingUp size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
                    </div>
                    <p className="adm-heading text-3xl font-bold mb-1 anim-countUp" style={{ color: "#ffffff" }}>
                      <CountUp to={val} />
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      {label}
                    </p>
                    <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min((val / Math.max(stats.total, 1)) * 100, 100)}%`, background: "rgba(255,255,255,0.6)", transition: "width 1.2s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Pie Chart Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#38bdf8,#22c55e)" }} />
                  <h2 className="adm-heading text-gray-800 font-bold text-lg">Inventory Distribution</h2>
                  <span className="text-xs text-gray-500">Status-wise breakdown</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6 flex justify-center items-center" style={{ minHeight: "280px" }}>
                    {totalCars > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={pieDataWithTotal}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                          >
                            {pieDataWithTotal.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8">
                        <Car size={48} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No cars in inventory</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: "rgba(76,175,80,0.12)" }}>
                        <CheckCircle size={18} style={{ color: "#4caf50" }} />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
                      <p className="text-xs text-gray-500">Approved</p>
                      <div className="mt-2 h-1 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-green-500" style={{ width: `${(stats.approved / Math.max(totalCars, 1)) * 100}%` }} />
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: "rgba(255,152,0,0.12)" }}>
                        <AlertCircle size={18} style={{ color: "#ff9800" }} />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                      <p className="text-xs text-gray-500">Pending</p>
                      <div className="mt-2 h-1 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${(stats.pending / Math.max(totalCars, 1)) * 100}%` }} />
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: "rgba(244,67,54,0.12)" }}>
                        <XCircle size={18} style={{ color: "#f44336" }} />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{cars.filter(c => c.status === "rejected").length}</p>
                      <p className="text-xs text-gray-500">Rejected</p>
                      <div className="mt-2 h-1 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${(cars.filter(c => c.status === "rejected").length / Math.max(totalCars, 1)) * 100}%` }} />
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: "rgba(158,158,158,0.12)" }}>
                        <Activity size={18} style={{ color: "#9e9e9e" }} />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{cars.filter(c => c.status === "sold").length}</p>
                      <p className="text-xs text-gray-500">Sold</p>
                      <div className="mt-2 h-1 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-gray-500" style={{ width: `${(cars.filter(c => c.status === "sold").length / Math.max(totalCars, 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Approvals Section */}
              <div className="anim-fadeSlideUp d4">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#ff9800,#f44336)" }} />
                  <h2 className="adm-heading text-gray-800 font-bold text-lg">Pending Approvals</h2>
                  {stats.pending > 0 && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,152,0,0.15)", color: "#ff9800" }}>{stats.pending}</span>}
                </div>
                {cars.filter(c => c.status === "pending").length === 0 ? (
                  <div className="py-14 text-center rounded-2xl glass" style={{ border: "1px dashed rgba(76,175,80,0.3)" }}>
                    <CheckCircle size={36} className="mx-auto mb-3" style={{ color: "#4caf50" }} />
                    <p className="text-gray-800 font-semibold">All caught up!</p>
                    <p style={{ color: "#64748b", fontSize: "13px" }}>No pending ads to review.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cars.filter(c => c.status === "pending").map((car, i) => (
                      <div key={car._id} className={`pending-l glass rounded-2xl p-4 flex items-center gap-4 anim-fadeSlideUp`}
                        style={{ animationDelay: `${i * 0.05}s` }}>
                        <img src={car.images?.[0] || "/placeholder.png"} alt="car"
                          className="w-16 h-12 object-cover rounded-xl flex-shrink-0"
                          style={{ border: "1px solid rgba(56,189,248,0.15)" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-semibold text-sm">{car.brand} {car.model} {car.year}</p>
                          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>PKR {Number(car.price).toLocaleString()} · {car.location} · by {car.seller?.name || "User"}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setPreviewCar(car)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: "rgba(56,189,248,0.12)", color: "#0ea5e9", border: "1px solid rgba(56,189,248,0.25)" }}>
                            <Eye size={13} /> Preview
                          </button>
                          <button onClick={() => patchCar(car._id, { status: "approved" })}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: "rgba(76,175,80,0.12)", color: "#4caf50", border: "1px solid rgba(76,175,80,0.25)" }}>
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button onClick={() => patchCar(car._id, { status: "rejected" })}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: "rgba(244,67,54,0.12)", color: "#f44336", border: "1px solid rgba(244,67,54,0.2)" }}>
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CARS TAB ── */}
          {tab === "cars" && (
            <div className="p-8 anim-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="adm-heading text-3xl font-bold text-gray-800 mb-1">Cars Inventory</h1>
                  <p className="text-gray-500">Manage all car listings</p>
                </div>
                <button onClick={() => setMode(mode === "manual" ? "ai" : "manual")}
                  className="add-btn px-5 py-2 rounded-xl text-sm font-semibold">
                  {mode === "manual" ? "🤖 AI Auto-Fill" : "✏️ Manual Entry"}
                </button>
              </div>

              {/* Add Car Form */}
              <div className="glass rounded-2xl p-6 mb-8">
                <h2 className="adm-heading text-xl font-bold text-gray-800 mb-4">
                  {mode === "manual" ? "Add New Car (Manual)" : "Add New Car (AI Auto-Fill)"}
                </h2>
                
                {mode === "ai" && (
                  <div className="mb-6">
                    <label className="upload-zone flex flex-col items-center justify-center p-8 rounded-2xl"
                      style={{ border: "2px dashed rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.03)" }}>
                      {aiLoad ? (
                        <><div className="w-10 h-10 rounded-full border-2 border-transparent border-t-[#38bdf8] anim-rotateSlow mb-3" />
                          <p className="text-[#0ea5e9] font-semibold text-sm">🤖 Analyzing images...</p></>
                      ) : (
                        <><div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(56,189,248,0.1)" }}>
                          <Zap size={22} style={{ color: "#38bdf8" }} /></div>
                          <p className="text-gray-800 font-semibold text-sm mb-1">Click to upload car images</p>
                          <p className="text-gray-500 text-sm">AI will extract details and fill the form</p>
                          {aiImgs.length > 0 && <p className="text-[#0ea5e9] text-xs mt-2 font-semibold">✅ {aiImgs.length} image(s) ready</p>}</>
                      )}
                      <input type="file" hidden multiple accept="image/*"
                        onChange={e => { const f = Array.from(e.target.files); setAiImgs(f); runAI(f); }} />
                    </label>
                    {aiImgs.length > 0 && (
                      <div className="flex gap-3 mt-4 flex-wrap">
                        {aiImgs.map((f, i) => (
                          <div key={i} className="relative group">
                            <img src={URL.createObjectURL(f)} alt="p" className="w-20 h-16 object-cover rounded-xl"
                              style={{ border: "2px solid rgba(56,189,248,0.3)" }} />
                            <button onClick={() => setAiImgs(aiImgs.filter((_, j) => j !== i))}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all font-bold">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {mode === "manual" && (
                  <div className="mb-6">
                    <label className="upload-zone flex flex-col items-center justify-center p-6 rounded-2xl mb-3"
                      style={{ border: "2px dashed rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.03)" }}>
                      <Upload size={24} style={{ color: "#38bdf8" }} />
                      <p className="text-gray-800 font-semibold text-sm my-2">Upload Car Images</p>
                      <p className="text-gray-500 text-xs">Unlimited images (JPG, PNG, WEBP)</p>
                      {manImgs.length > 0 && <p className="text-[#0ea5e9] text-xs mt-2 font-semibold">✅ {manImgs.length} image(s) selected</p>}
                      <input type="file" hidden multiple accept="image/*"
                        onChange={e => setManImgs(Array.from(e.target.files))} />
                    </label>
                    {manImgs.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {manImgs.map((f, i) => (
                          <div key={i} className="relative group">
                            <img src={URL.createObjectURL(f)} alt="p" className="w-20 h-16 object-cover rounded-xl"
                              style={{ border: "2px solid rgba(56,189,248,0.3)" }} />
                            <button onClick={() => setManImgs(manImgs.filter((_, j) => j !== i))}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all font-bold">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {[["brand", "Brand*"], ["model", "Model*"], ["year", "Year"], ["color", "Color"], ["bodyType", "Body Type"], ["fuelType", "Fuel Type"], ["transmission", "Transmission"], ["condition", "Condition"], ["price", "Price (PKR)*"], ["location", "Location*"]].map(([k, l]) => (
                    <div key={k}>
                      <label className="text-gray-500 text-xs font-semibold">{l}</label>
                      <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="inp w-full px-3 py-2 rounded-xl text-sm mt-1" />
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="text-gray-500 text-xs font-semibold">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} className="inp w-full px-3 py-2 rounded-xl text-sm mt-1 resize-none" />
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl mb-4" style={{ background: "rgba(56,189,248,0.05)" }}>
                  <button onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`w-10 h-5 rounded-full relative transition-all ${form.featured ? "bg-[#38bdf8]" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.featured ? "right-0.5" : "left-0.5"}`} />
                  </button>
                  <p className="text-gray-700 text-sm font-semibold flex items-center gap-1"><Star size={14} className="text-yellow-500" /> Featured Car</p>
                </div>

                <button onClick={addCar} disabled={uploading} className="add-btn w-full py-3 rounded-xl text-white font-semibold">
                  {uploading ? "⏳ Uploading..." : "➕ Add to Inventory"}
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex gap-2">
                  {["all", "pending", "approved", "rejected", "sold"].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === s ? "add-btn text-white" : "glass text-gray-600"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Search cars..." value={search} onChange={e => setSearch(e.target.value)} className="inp pl-9 pr-4 py-2 rounded-xl text-sm w-56" />
                </div>
              </div>

              {/* Cars Table */}
              {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#38bdf8] border-t-transparent" /></div>
              ) : filtered.length === 0 ? (
                <div className="glass text-center py-16"><Car size={48} className="mx-auto text-gray-400 mb-3" /><p className="text-gray-500">No cars found</p></div>
              ) : (
                <div className="glass overflow-x-auto">
                  <div className="tbl-header px-5 py-3 border-b border-[rgba(56,189,248,0.1)]">
                    <span className="text-xs font-bold text-gray-500">IMG</span>
                    <span className="text-xs font-bold text-gray-500">CAR</span>
                    <span className="text-xs font-bold text-gray-500">PRICE</span>
                    <span className="text-xs font-bold text-gray-500">LOCATION</span>
                    <span className="text-xs font-bold text-gray-500">VIEWS</span>
                    <span className="text-xs font-bold text-gray-500">STATUS</span>
                    <span className="text-xs font-bold text-gray-500">FEAT</span>
                    <span className="text-xs font-bold text-gray-500 text-right">ACTIONS</span>
                  </div>
                  {filtered.map((car, i) => {
                    const cfg = SCFG[car.status] || SCFG.pending;
                    return (
                      <div key={car._id} className="table-row px-5 py-3" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div><img src={car.images?.[0] || "/placeholder.png"} className="w-10 h-8 rounded-lg object-cover" /></div>
                        <div><p className="text-gray-800 font-semibold text-sm">{car.brand} {car.model}</p><p className="text-gray-400 text-xs">{car.year} · {car.fuelType}</p></div>
                        <div><p className="text-[#0ea5e9] font-bold text-sm">PKR {Number(car.price).toLocaleString()}</p></div>
                        <div><p className="text-gray-500 text-xs">{car.location || "—"}</p></div>
                        <div><p className="text-gray-500 text-xs">{car.views || 0}</p></div>
                        <div>
                          {!car.seller ? (
                            <button onClick={() => patchCar(car._id, { availabilityStatus: car.availabilityStatus === "available" ? "unavailable" : "available" })}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold ${car.availabilityStatus === "available" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                              {car.availabilityStatus === "available" ? "Available" : "Unavailable"}
                            </button>
                          ) : (
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                          )}
                        </div>
                        <div><button onClick={() => patchCar(car._id, { featured: !car.featured })} className="text-lg">{car.featured ? "⭐" : "☆"}</button></div>
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setPreviewCar(car)} className="act-btn p-1.5 rounded-lg bg-sky-50 text-sky-600"><Eye size={14} /></button>
                          {car.status === "pending" && (<><button onClick={() => patchCar(car._id, { status: "approved" })} className="act-btn p-1.5 rounded-lg bg-green-50 text-green-600"><CheckCircle size={14} /></button><button onClick={() => patchCar(car._id, { status: "rejected" })} className="act-btn p-1.5 rounded-lg bg-red-50 text-red-600"><XCircle size={14} /></button></>)}
                          <button onClick={() => deleteCar(car._id)} className="act-btn p-1.5 rounded-lg bg-red-50 text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── TEST DRIVES TAB ── */}
          {tab === "testdrives" && (
            <div className="p-8 anim-fadeIn">
              <div className="mb-6">
                <h1 className="adm-heading text-3xl font-bold text-gray-800 mb-1">Test Drives</h1>
                <p className="text-gray-500">{drives?.length || 0} total bookings</p>
              </div>
              <div className="space-y-3">
                {drives?.length === 0 ? (
                  <div className="py-16 text-center glass">
                    <CalendarCheck size={48} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500">No test drives yet</p>
                  </div>
                ) : (
                  drives.map((d, i) => (
                    <div key={d._id} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4" style={{ animationDelay: `${i * 0.04}s` }}>
                      <img src={d.car?.images?.[0] || "/placeholder.png"} alt="car" className="w-16 h-12 object-cover rounded-xl" />
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold">{d.car?.brand} {d.car?.model}</p>
                        <p className="text-gray-500 text-sm">{d.buyer?.name} · {d.buyer?.email}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-gray-500">📅 {d.date ? new Date(d.date).toLocaleDateString() : "N/A"}</span>
                          <span className="text-xs text-gray-500">🕐 {d.timeSlot}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          d.status === "approved" ? "bg-green-100 text-green-700" :
                          d.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{d.status}</span>
                        {d.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              const res = await fetch("/api/admin/testdrives", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ requestId: d._id, status: "approved", adminNotes: "Your test drive has been approved!" })
                              });
                              if (res.ok) loadDrives(token);
                            }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-600 hover:bg-green-200">Approve</button>
                            <button onClick={async () => {
                              const res = await fetch("/api/admin/testdrives", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ requestId: d._id, status: "rejected", adminNotes: "Sorry, this time slot is not available." })
                              });
                              if (res.ok) loadDrives(token);
                            }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div className="p-8 anim-fadeIn">
              <div className="mb-8">
                <h1 className="adm-heading text-3xl font-bold text-gray-800 mb-1">⚙️ Settings</h1>
                <p className="text-gray-500">Manage your admin profile, security, and system preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  
                  {/* Admin Profile */}
                  <div className="settings-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#22c55e] flex items-center justify-center text-white text-lg font-bold">A</div>
                      <div>
                        <h3 className="adm-heading text-gray-800 font-bold text-lg">Admin Profile</h3>
                        <p className="text-gray-400 text-xs">Manage your account information</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-500 text-xs font-semibold flex items-center gap-2"><User size={14} /> Full Name</label>
                        <input type="text" value={settings.name} onChange={(e) => handleSettingsUpdate("name", e.target.value)}
                          className="inp w-full px-3 py-2 rounded-xl text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-semibold flex items-center gap-2"><Mail size={14} /> Email Address</label>
                        <input type="email" value={settings.email} onChange={(e) => handleSettingsUpdate("email", e.target.value)}
                          className="inp w-full px-3 py-2 rounded-xl text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-semibold flex items-center gap-2"><Shield size={14} /> Role</label>
                        <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-sm">Administrator</div>
                      </div>
                      <button onClick={handleProfileUpdate}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#22c55e] text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Save size={16} /> Save Profile
                      </button>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="settings-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Key size={18} className="text-amber-500" /></div>
                      <div>
                        <h3 className="adm-heading text-gray-800 font-bold text-lg">Security</h3>
                        <p className="text-gray-400 text-xs">Change your admin password</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-500 text-xs font-semibold">Current Password</label>
                        <input type="password" value={settings.currentPassword} onChange={(e) => handleSettingsUpdate("currentPassword", e.target.value)}
                          placeholder="Enter current password" className="inp w-full px-3 py-2 rounded-xl text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-semibold">New Password</label>
                        <input type="password" value={settings.newPassword} onChange={(e) => handleSettingsUpdate("newPassword", e.target.value)}
                          placeholder="Enter new password (min 6 chars)" className="inp w-full px-3 py-2 rounded-xl text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-semibold">Confirm New Password</label>
                        <input type="password" value={settings.confirmPassword} onChange={(e) => handleSettingsUpdate("confirmPassword", e.target.value)}
                          placeholder="Confirm new password" className="inp w-full px-3 py-2 rounded-xl text-sm mt-1" />
                      </div>
                      <button onClick={handlePasswordChange}
                        className="w-full py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
                        <Lock size={16} /> Update Password
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  {/* Notifications */}
                  <div className="settings-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Bell size={18} className="text-blue-500" /></div>
                      <div>
                        <h3 className="adm-heading text-gray-800 font-bold text-lg">Notifications</h3>
                        <p className="text-gray-400 text-xs">Manage your notification preferences</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-all">
                        <div>
                          <p className="text-gray-700 font-medium text-sm">Email Notifications</p>
                          <p className="text-gray-400 text-xs">Receive system updates via email</p>
                        </div>
                        <button onClick={() => handleSettingsUpdate("emailAlerts", !settings.emailAlerts)}
                          className={`w-10 h-5 rounded-full relative transition-all ${settings.emailAlerts ? "toggle-on" : "toggle-off"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.emailAlerts ? "right-0.5" : "left-0.5"}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-all">
                        <div>
                          <p className="text-gray-700 font-medium text-sm">System Alerts</p>
                          <p className="text-gray-400 text-xs">Critical system notifications</p>
                        </div>
                        <button onClick={() => handleSettingsUpdate("systemAlerts", !settings.systemAlerts)}
                          className={`w-10 h-5 rounded-full relative transition-all ${settings.systemAlerts ? "toggle-on" : "toggle-off"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.systemAlerts ? "right-0.5" : "left-0.5"}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="settings-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Server size={18} className="text-green-500" /></div>
                      <div>
                        <h3 className="adm-heading text-gray-800 font-bold text-lg">System Status</h3>
                        <p className="text-gray-400 text-xs">Current system health and configuration</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                        <span className="text-gray-600 text-sm">API Status</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                        <span className="text-gray-600 text-sm">Database</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Connected
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                        <span className="text-gray-600 text-sm">Cache</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                        <span className="text-gray-600 text-sm">Admin Credentials</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">.env.local</span>
                      </div>
                      <button className="w-full py-1.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <RefreshCw size={12} /> Refresh Status
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="settings-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Globe size={18} className="text-purple-500" /></div>
                      <div>
                        <h3 className="adm-heading text-gray-800 font-bold text-lg">Quick Actions</h3>
                        <p className="text-gray-400 text-xs">Useful admin utilities</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-3 rounded-xl bg-sky-50 text-sky-600 text-xs font-semibold hover:bg-sky-100 transition-all flex flex-col items-center gap-1">
                        <RefreshCw size={16} /> Clear Cache
                      </button>
                      <button className="p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-all flex flex-col items-center gap-1">
                        <Database size={16} /> Backup
                      </button>
                      <button className="p-3 rounded-xl bg-amber-50 text-amber-600 text-xs font-semibold hover:bg-amber-100 transition-all flex flex-col items-center gap-1">
                        <Server size={16} /> System Logs
                      </button>
                      <button className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all flex flex-col items-center gap-1">
                        <Shield size={16} /> Security Audit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Warning */}
              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-amber-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>Admin credentials are managed in <code className="px-1.5 py-0.5 bg-amber-100 rounded text-amber-800 font-mono text-xs">.env.local</code>. Changes require server restart.</span>
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}