"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, Zap, CheckCircle, AlertCircle, 
  Car, MapPin, Camera, Image as ImageIcon,
  Loader2, ChevronRight, Sparkles, Shield, X,
  Info, Plus, Trash2, Eye, Edit3
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  
  .sell-page { 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f7fa 100%);
    min-height: 100vh; 
  }
  .sell-heading { font-family: 'Outfit', sans-serif; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 188, 212, 0.2);
    border-radius: 24px;
    transition: all 0.3s ease;
  }
  .glass-card:hover {
    box-shadow: 0 20px 40px -12px rgba(0, 188, 212, 0.2);
    border-color: rgba(0, 188, 212, 0.4);
    transform: translateY(-2px);
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, #00bcd4 0%, #0097a7 50%, #00bcd4 100%);
  }
  
  .input-field {
    background: rgba(255, 255, 255, 0.8);
    border: 1.5px solid #d1d5db;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    transition: all 0.2s;
    width: 100%;
    outline: none;
  }
  .input-field:focus {
    border-color: #00bcd4;
    box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.15);
    background: white;
  }
  .input-field::placeholder {
    color: #94a3b8;
  }
  
  .input-field.ai-filled {
    border-color: #4ade80;
    background: rgba(74, 222, 128, 0.08);
  }
  .input-field.ai-filled:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
  }
  
  select.input-field {
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }
  
  textarea.input-field {
    resize: vertical;
    min-height: 80px;
  }
  
  .upload-zone {
    background: rgba(255, 255, 255, 0.6);
    border: 2px dashed #00bcd4;
    border-radius: 24px;
    transition: all 0.3s ease;
    cursor: pointer;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .upload-zone:hover {
    border-color: #0097a7;
    background: rgba(0, 188, 212, 0.08);
    transform: scale(1.01);
  }
  .upload-zone.dragging {
    border-color: #0097a7;
    background: rgba(0, 188, 212, 0.15);
    transform: scale(1.02);
  }
  
  .submit-btn {
    background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
    color: white;
    font-weight: 700;
    padding: 14px 32px;
    border-radius: 40px;
    font-size: 15px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 188, 212, 0.4);
  }
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .badge-ai {
    background: rgba(0, 188, 212, 0.15);
    color: #0097a7;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(0, 188, 212, 0.3);
  }
  
  .image-preview {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid rgba(0, 188, 212, 0.2);
    transition: all 0.3s ease;
  }
  .image-preview:hover {
    border-color: #00bcd4;
    transform: scale(1.05);
  }
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .image-preview .remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ef4444;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s ease;
    opacity: 0;
    transform: scale(0.8);
  }
  .image-preview:hover .remove-btn {
    opacity: 1;
    transform: scale(1);
  }
  
  /* Animations */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { text-shadow: 0 0 0px rgba(0, 188, 212, 0); }
    50% { text-shadow: 0 0 20px rgba(0, 188, 212, 0.3); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .animate-fadeSlideUp {
    animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease both;
  }
  .animate-glowPulse {
    animation: glowPulse 2s ease-in-out infinite;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.1s; }
  .delay-3 { animation-delay: 0.15s; }
  .delay-4 { animation-delay: 0.2s; }
  .delay-5 { animation-delay: 0.25s; }
`;

export default function AddCarPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" }}>
        <Loader2 className="w-8 h-8 text-[#00bcd4] animate-spin" />
      </div>
    }>
      <AddCarPage />
    </Suspense>
  );
}

function AddCarPage() {
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [aiFilledFields, setAiFilledFields] = useState([]);


  const [aiStatus, setAiStatus] = useState({
    isAnalyzing: false,
    filledFields: []
  });

  const [form, setForm] = useState({
    brand: "", model: "", year: "", bodyType: "", color: "",
    fuelType: "", transmission: "", seats: "", driveType: "",
    headlights: "", condition: "", additionalInfo: "", 
    description: "", mileage: "", engine: "", assembly: "",
    price: "", location: "",
  });

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    setEditId(id);
    setMounted(true);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) router.push("/signin");
  }, []);

  useEffect(() => {
    if (!editId) return;

    const fetchCar = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/cars/${editId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.car) {
          const c = data.car;
          setForm({
            brand: c.brand || "",
            model: c.model || "",
            year: c.year?.toString() || "",
            bodyType: c.bodyType || "",
            color: c.color || "",
            fuelType: c.fuelType || "",
            transmission: c.transmission || "",
            seats: c.seats?.toString() || "",
            driveType: c.driveType || "",
            headlights: c.headlights || "",
            condition: c.condition || "",
            additionalInfo: c.additionalInfo || "",
            description: c.description || "",
            mileage: c.mileage || "",
            engine: c.engine || "",
            assembly: c.assembly || "",
            price: c.price?.toString() || "",
            location: c.location || "",
          });
          setExistingImages(c.images || []);
        }
      } catch (err) {
        console.error("Prefill error:", err);
      }
    };

    fetchCar();
  }, [editId]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ✅ AI EXTRACT - All fields with default values

const extractAI = async (files) => {
  try {
    setLoading(true);
    setAiStatus({ isAnalyzing: true, filledFields: [] });
    
    const base64Images = await Promise.all(files.map(fileToBase64));
    const res = await fetch("/api/ai/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: base64Images }),
    });
    const data = await res.json();
    
    if (data.success) {
      const aiData = data.data;
      const filled = [];
      
     
      let year = aiData.year || "Unknown";
      let engine = aiData.engine || "Unknown";
      
      if (year === "Unknown" || year === "") {
        const brand = aiData.brand || "";
        const model = aiData.model || "";
        
       
        const yearMap = {
          "Toyota Corolla": "2022",
          "Toyota Yaris": "2022",
          "Honda Civic": "2023",
          "Honda City": "2022",
          "Suzuki Alto": "2023",
          "Suzuki Swift": "2022",
          "KIA Sportage": "2023",
          "Hyundai Tucson": "2023",
          "BMW 3 Series": "2022",
          "Mercedes C-Class": "2022",
          "Audi A4": "2022"
        };
        
        // Check if brand+model matches any known combo
        const key = `${brand} ${model}`.trim();
        if (yearMap[key]) {
          year = yearMap[key];
          console.log("✅ Smart Year from brand/model:", year);
        }
      }
      
  
      if (engine === "Unknown" || engine === "") {
        const brand = aiData.brand || "";
        const model = aiData.model || "";
        
        const engineMap = {
          "Toyota Corolla": "1.8L",
          "Toyota Yaris": "1.3L",
          "Honda Civic": "1.5L Turbo",
          "Honda City": "1.2L",
          "Suzuki Alto": "0.8L",
          "Suzuki Swift": "1.2L",
          "KIA Sportage": "2.0L",
          "Hyundai Tucson": "2.0L",
          "BMW 3 Series": "2.0L Turbo",
          "Mercedes C-Class": "2.0L"
        };
        
        const key = `${brand} ${model}`.trim();
        if (engineMap[key]) {
          engine = engineMap[key];
          console.log("✅ Smart Engine from brand/model:", engine);
        }
      }
      
      const fieldMap = {
        brand: aiData.brand || "Unknown",
        model: aiData.model || "Unknown",
        variant: aiData.variant || "Unknown",
        year: year,
        bodyType: aiData.bodyType || "Unknown",
        color: aiData.color || "Unknown",
        fuelType: aiData.fuelType || "Unknown",
        transmission: aiData.transmission || "Unknown",
        engine: engine,
        assembly: aiData.assembly || "Unknown",
        driveType: aiData.driveType || "Unknown",
        doors: aiData.doors || "Unknown",
        wheelType: aiData.wheelType || "Unknown",
        headlights: aiData.headlights || "Unknown",
        condition: aiData.condition || "Unknown",
        seats: aiData.seats || "Unknown",
        mileage: aiData.mileage || "Unknown",
      };
      
     
      Object.keys(fieldMap).forEach(key => {
        if (fieldMap[key] !== "Unknown" && fieldMap[key] !== "" && !fieldMap[key].includes("No description")) {
          filled.push(key);
        }
      });
      
      setForm(prev => ({
        ...prev,
        ...fieldMap,
        description: aiData.description || 
          `${aiData.brand || "Unknown"} ${aiData.model || "Unknown"} — ${aiData.color || "Unknown"} color, ${engine} engine, ${aiData.transmission || "Unknown"} transmission.`
      }));
      
      setAiStatus({ isAnalyzing: false, filledFields: filled });
      setAiFilledFields(filled);
      
      console.log("✅ AI Filled:", filled.length, "fields:", filled.join(", "));
      
    }
  } catch (err) {
    console.error("AI Extraction error:", err);
    setAiStatus({ isAnalyzing: false, filledFields: [] });
  } finally {
    setLoading(false);
  }
};

  const uploadImages = async () => {
    const urls = [];
    for (let file of images) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "cartradehub");
      data.append("cloud_name", "dwlmg5ycn");
      const res = await fetch("https://api.cloudinary.com/v1_1/dwlmg5ycn/image/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.secure_url) urls.push(result.secure_url);
    }
    return urls;
  };

  const handlePostAd = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/signin"); return; }
    if (!form.price || !form.location) { alert("Price and Location are required"); return; }

    try {
      setUploading(true);
      const imageUrls = images.length > 0 ? await uploadImages() : existingImages;

      const res = await fetch(editId ? `/api/cars/${editId}` : "/api/cars", {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price.replace(/,/g, "")),
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(editId ? "Ad updated successfully!" : "Ad posted successfully!");
        router.push("/dashboard/seller");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Server error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" }}>
        <Loader2 className="w-8 h-8 text-[#00bcd4] animate-spin" />
      </div>
    );
  }

  const isAIFilled = (field) => aiFilledFields.includes(field);

  return (
    <>
      <style>{STYLES}</style>
      <div className="sell-page">
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Header */}
          <div className="text-center mb-10 animate-fadeSlideUp">
            <div className="inline-flex items-center gap-2 gradient-bg text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 animate-float">
              <Sparkles size={14} />
              {editId ? "Edit Your Listing" : "Sell Your Car"}
            </div>
            <h1 className="sell-heading text-4xl md:text-6xl font-black mb-3">
              <span className="bg-gradient-to-r from-[#00bcd4] via-[#0097a7] to-[#4dd0e1] bg-clip-text text-transparent animate-glowPulse">
                {editId ? "Edit Your Ad" : "Post Your Ad"}
              </span>
            </h1>
            <p className="text-gray-600 text-base max-w-md mx-auto">
              {editId 
                ? "Update your car listing details to attract more buyers" 
                : "Sell your car quickly with AI-powered auto-fill (unlimited images)"}
            </p>
          </div>

          {/* Image Upload Card - UNLIMITED */}
          <div className="glass-card p-6 mb-8 animate-fadeSlideUp delay-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center animate-float">
                  <Camera size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="sell-heading font-bold text-gray-800 text-lg">Car Images</h2>
                  <p className="text-gray-500 text-sm">Upload unlimited images for your listing</p>
                </div>
              </div>
              <div className="badge-ai">
                <ImageIcon size={12} />
                {images.length + existingImages.length} images
              </div>
            </div>

            {/* ✅ UNLIMITED IMAGES - NO LIMIT */}
            <div 
              className={`upload-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                  setImages(prev => [...prev, ...files]);
                  extractAI(files);
                }
              }}
            >
              <input 
                type="file" 
                hidden 
                multiple 
                accept="image/*" 
                id="imageUpload"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length > 0) {
                    setImages(prev => [...prev, ...files]); // ✅ Unlimited - just append
                    extractAI(files);
                  }
                }}
              />
              <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center p-8 w-full">
                <Upload size={40} className="text-[#00bcd4] mb-3 animate-float" />
                <p className="text-gray-700 font-medium mb-1">Click or drag images here</p>
                <p className="text-gray-500 text-sm">PNG, JPG, WEBP • No limit on number of images</p>
                <div className="mt-3 px-4 py-2 rounded-full bg-[#00bcd4]/10 text-[#0097a7] text-xs font-semibold">
                  {images.length + existingImages.length} images uploaded
                </div>
              </label>
            </div>

            {/* Image Previews - UNLIMITED */}
            {(images.length > 0 || existingImages.length > 0) && (
              <div className="mt-4 animate-fadeIn">
                <p className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                  <ImageIcon size={14} className="text-[#00bcd4]" />
                  Uploaded Images ({images.length + existingImages.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {/* New Images */}
                  {images.map((img, i) => (
                    <div key={`new-${i}`} className="image-preview group">
                      <img src={URL.createObjectURL(img)} alt="preview" />
                      <button
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="remove-btn group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {/* Existing Images (Edit Mode) */}
                  {editId && existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="image-preview group">
                      <img src={url} alt="existing" />
                      <button
                        onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                        className="remove-btn group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis Status */}
            {aiStatus.isAnalyzing && (
              <div className="mt-4 p-4 rounded-xl bg-[#00bcd4]/10 border border-[#00bcd4]/30 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-[#00bcd4]" />
                  <div>
                    <p className="font-semibold text-[#0097a7]">🤖 AI is analyzing your car...</p>
                    <p className="text-xs text-gray-500">Identifying brand, model, specs, and more</p>
                  </div>
                </div>
              </div>
            )}

          
            {!aiStatus.isAnalyzing && aiStatus.filledFields.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <div>
                    <p className="font-semibold text-green-700">✅ AI filled {aiStatus.filledFields.length} fields</p>
                    <p className="text-xs text-gray-500">
                      Fields: {aiStatus.filledFields.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6 mb-8 animate-fadeSlideUp delay-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00bcd4]/15 flex items-center justify-center">
                  <Car size={18} className="text-[#0097a7]" />
                </div>
                <h2 className="sell-heading font-bold text-gray-800 text-lg">Car Details</h2>
              </div>
              {loading && (
                <div className="badge-ai">
                  <Zap size={12} />
                  AI Detecting...
                </div>
              )}
              {!loading && !aiStatus.isAnalyzing && images.length > 0 && !editId && (
                <div className="badge-ai">
                  <CheckCircle size={12} className="text-green-500" />
                  AI Filled
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Brand" 
                value={form.brand} 
                onChange={(v) => setForm({ ...form, brand: v })}
                isAIFilled={isAIFilled("brand")}
                placeholder="e.g., Toyota"
              />
              <InputField 
                label="Model" 
                value={form.model} 
                onChange={(v) => setForm({ ...form, model: v })}
                isAIFilled={isAIFilled("model")}
                placeholder="e.g., Corolla"
              />
              <InputField 
                label="Year" 
                value={form.year} 
                onChange={(v) => setForm({ ...form, year: v })}
                isAIFilled={isAIFilled("year")}
                placeholder="e.g., 2022"
              />
              <InputField 
                label="Body Type" 
                value={form.bodyType} 
                onChange={(v) => setForm({ ...form, bodyType: v })}
                isAIFilled={isAIFilled("bodyType")}
                placeholder="e.g., Sedan, SUV"
              />
              <InputField 
                label="Color" 
                value={form.color} 
                onChange={(v) => setForm({ ...form, color: v })}
                isAIFilled={isAIFilled("color")}
                placeholder="e.g., White, Black"
              />
              <SelectField 
                label="Fuel Type" 
                value={form.fuelType} 
                options={["Petrol", "Diesel", "Hybrid", "Electric", "CNG"]} 
                onChange={(v) => setForm({ ...form, fuelType: v })}
                isAIFilled={isAIFilled("fuelType")}
              />
              <SelectField 
                label="Transmission" 
                value={form.transmission} 
                options={["Manual", "Automatic", "CVT"]} 
                onChange={(v) => setForm({ ...form, transmission: v })}
                isAIFilled={isAIFilled("transmission")}
              />
              <InputField 
                label="Seats" 
                value={form.seats} 
                onChange={(v) => setForm({ ...form, seats: v })}
                isAIFilled={isAIFilled("seats")}
                placeholder="e.g., 4, 5, 7"
              />
            
              <InputField 
                label="Headlights" 
                value={form.headlights} 
                onChange={(v) => setForm({ ...form, headlights: v })}
                isAIFilled={isAIFilled("headlights")}
                placeholder="e.g., LED, Halogen"
              />
              <SelectField 
                label="Condition" 
                value={form.condition} 
                options={["Excellent", "Good", "Fair", "Poor"]} 
                onChange={(v) => setForm({ ...form, condition: v })}
                isAIFilled={isAIFilled("condition")}
              />
              <InputField 
                label="Mileage" 
                value={form.mileage} 
                onChange={(v) => setForm({ ...form, mileage: v })}
                isAIFilled={isAIFilled("mileage")}
                placeholder="e.g., 50,000 km"
              />
              <InputField 
                label="Engine" 
                value={form.engine} 
                onChange={(v) => setForm({ ...form, engine: v })}
                isAIFilled={isAIFilled("engine")}
                placeholder="e.g., 1.8L, 2.0L"
              />
           
            </div>

            {/* Description Field - AI Generated */}
            <div className="mt-5">
              <label className="block text-gray-600 font-semibold text-sm mb-2 flex items-center gap-2">
                <Info size={14} className="text-[#00bcd4]" />
                Description
                {isAIFilled("description") && (
                  <span className="badge-ai text-xs">
                    <Sparkles size={10} /> AI Generated
                  </span>
                )}
              </label>
              <textarea
                className={`input-field ${isAIFilled("description") ? "ai-filled" : ""}`}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your car in detail..."
              />
            </div>

            <div className="mt-5">
              <label className="block text-gray-600 font-semibold text-sm mb-2 flex items-center gap-2">
                <Edit3 size={14} className="text-[#00bcd4]" />
                Additional Information
                <span className="text-xs text-gray-400 font-normal">(Optional - Add extra details)</span>
              </label>
              <div className="relative">
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  rows={4}
                  value={form.additionalInfo}
                  onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
                  placeholder="Add any extra details about your car..."
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button 
                    type="button"
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-500 text-xs"
                    onClick={() => {
                      const tips = [
                        "Full options, sunroof, leather seats",
                        "Recently serviced, new tires",
                        "One owner, well maintained",
                        "Emergency kit included",
                        "Warranty available"
                      ];
                      const current = form.additionalInfo;
                      const newTip = tips[Math.floor(Math.random() * tips.length)];
                      setForm({ ...form, additionalInfo: current ? `${current}\n• ${newTip}` : `• ${newTip}` });
                    }}
                  >
                    <Plus size={14} /> Add Tip
                  </button>
                </div>
              </div>
              {form.additionalInfo && (
                <div className="mt-3 p-4 rounded-xl bg-[#00bcd4]/5 border border-[#00bcd4]/20">
                  <p className="text-xs text-gray-400 mb-2">📝 Preview</p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {form.additionalInfo.split('\n').map((line, i) => (
                      line.trim() && (
                        <div key={i} className="flex items-start gap-2 py-0.5">
                          <span className="text-[#00bcd4]">•</span>
                          <span>{line}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price & Location Card */}
          <div className="glass-card p-6 mb-10 animate-fadeSlideUp delay-3">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#00bcd4]/15 flex items-center justify-center">
                <span className="text-[#0097a7] font-bold text-lg">₨</span>
              </div>
              <h2 className="sell-heading font-bold text-gray-800 text-lg">Price & Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-600 font-semibold text-sm mb-2">Price (₨ PKR) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold"></span>
                  <input
                    className="input-field pl-8"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder=" e.g RS  2500000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold text-sm mb-2">Location *</label>
                <div className="relative">
                  
                  <input
                    className="input-field pl-10"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="for e.g Karachi, Lahore, Islamabad"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center animate-fadeSlideUp delay-4">
            <button onClick={handlePostAd} disabled={uploading || loading} className="submit-btn">
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  {editId ? "Update Ad" : "Post Now"}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
            <p className="text-gray-500 text-xs mt-4 flex items-center justify-center gap-1">
              <Shield size={12} className="text-[#00bcd4]" />
              Your listing will be reviewed by admin before going live
            </p>
          </div>

        </div>
      </div>
    </>
  );
}


function InputField({ label, value, onChange, isAIFilled, placeholder }) {
  return (
    <div className="animate-fadeIn">
      <label className="block text-gray-600 font-semibold text-sm mb-1.5 flex items-center gap-2">
        {label}
        {isAIFilled && (
          <span className="badge-ai text-xs px-1.5 py-0.5">
            <Sparkles size={8} /> AI
          </span>
        )}
      </label>
      <input 
        className={`input-field ${isAIFilled ? "ai-filled" : ""}`}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange, isAIFilled }) {
  return (
    <div className="animate-fadeIn">
      <label className="block text-gray-600 font-semibold text-sm mb-1.5 flex items-center gap-2">
        {label}
        {isAIFilled && (
          <span className="badge-ai text-xs px-1.5 py-0.5">
            <Sparkles size={8} /> AI
          </span>
        )}
      </label>
      <select 
        className={`input-field ${isAIFilled ? "ai-filled" : ""}`} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}