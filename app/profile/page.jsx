"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { User, Mail, Phone, MapPin, Car, Calendar, Edit2, Save, X, Loader2, CheckCircle, Camera, TrendingUp } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .pp { font-family: 'Plus Jakarta Sans', sans-serif; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%); min-height: 100vh; }
  .hph { font-family: 'Outfit', sans-serif; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  .float-anim { animation: float 5s ease-in-out infinite; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slideUp 0.6s ease forwards; }

  .profile-card {
    background: white;
    border-radius: 24px;
    padding: 28px;
    transition: all 0.4s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .stat-card {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(14, 165, 233, 0.1);
  }
`;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [userCars, setUserCars] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalViews: 0,
    activeListings: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/signin");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      city: parsedUser.city || "",
    });
    
    fetchUserCars(token);
  }, []);

  const fetchUserCars = async (token) => {
    try {
      const res = await fetch("/api/my-ads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserCars(data.cars || []);
        setStats({
          totalListings: data.cars?.length || 0,
          totalViews: data.cars?.reduce((sum, car) => sum + (car.views || 0), 0) || 0,
          activeListings: data.cars?.filter(car => car.status === "approved").length || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess("Profile updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
    setEditing(false);
    setSaving(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="pp">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="pp">
        <Navbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden pt-20 pb-16">
          <div className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />

          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="float-anim">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center shadow-2xl">
                  <User size={48} className="text-white" />
                </div>
              </div>
            </div>

            <h1 className="hph text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent animate-on-scroll">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-on-scroll">
              Manage your account settings and track your listings
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="md:col-span-2">
              <div className="profile-card animate-on-scroll">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="hph text-xl font-bold text-gray-800">Personal Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-600 font-semibold text-sm hover:bg-sky-100 transition"
                    >
                      <Edit2 size={16} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                {success && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> {success}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Full Name</p>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:border-sky-400 outline-none"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{user?.name || "—"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Email Address</p>
                      <p className="text-gray-800 font-medium">{user?.email || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Phone Number</p>
                      {editing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:border-sky-400 outline-none"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{formData.phone || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">City</p>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:border-sky-400 outline-none"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{formData.city || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* My Listings */}
              <div className="profile-card animate-on-scroll mt-6">
                <h2 className="hph text-xl font-bold text-gray-800 mb-4">My Listings</h2>
                {userCars.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No listings yet. Click "Sell" to post your first ad!</p>
                ) : (
                  <div className="space-y-3">
                    {userCars.slice(0, 3).map((car) => (
                      <div
                        key={car._id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => router.push(`/cars/${car._id}`)}
                      >
                        <img
                          src={car.images?.[0] || "/placeholder.png"}
                          alt={car.model}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-500">PKR {parseInt(car.price).toLocaleString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          car.status === "approved" ? "bg-green-100 text-green-600" :
                          car.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {car.status || "pending"}
                        </span>
                      </div>
                    ))}
                    {userCars.length > 3 && (
                      <button
                        onClick={() => router.push("/dashboard/seller")}
                        className="text-sky-600 text-sm font-semibold hover:underline mt-2"
                      >
                        View all {userCars.length} listings →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div>
              <div className="profile-card animate-on-scroll">
                <h2 className="hph text-xl font-bold text-gray-800 mb-4">Activity Stats</h2>
                <div className="space-y-4">
                  <div className="stat-card">
                    <Car size={24} className="text-sky-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{stats.totalListings}</p>
                    <p className="text-gray-500 text-sm">Total Listings</p>
                  </div>
                  <div className="stat-card">
                    <Eye size={24} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm">Total Views</p>
                  </div>
                  <div className="stat-card">
                    <TrendingUp size={24} className="text-sky-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{stats.activeListings}</p>
                    <p className="text-gray-500 text-sm">Active Listings</p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="profile-card animate-on-scroll mt-6 text-center">
                <Calendar size={20} className="text-sky-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Member since</p>
                <p className="font-semibold text-gray-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2024"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}