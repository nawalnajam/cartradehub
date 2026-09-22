"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Settings,
  User,
  Mail,
  Lock,
  Bell,
  Save,
  LogOut,
  Shield,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Globe,
  Smartphone,
  CreditCard,
  Trash2
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .settings-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
  }
  .hph { font-family: 'Outfit', sans-serif; }

  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid rgba(14, 165, 233, 0.12);
    transition: all 0.3s ease;
  }
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(14, 165, 233, 0.25);
    box-shadow: 0 4px 20px rgba(14, 165, 233, 0.08);
  }

  .setting-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .setting-item:hover {
    background: rgba(14, 165, 233, 0.05);
    border-color: rgba(14, 165, 233, 0.15);
  }
  .setting-item .icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "buyer",
  });
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    systemAlerts: true,
    marketingEmails: false,
  });
  
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          role: data.user.role || "buyer",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✅ Profile updated successfully!", "success");
        setIsEditing(false);
        // Update localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.name = profile.name;
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      showToast("Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("❌ Passwords do not match!", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("❌ Password must be at least 6 characters!", "error");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✅ Password changed successfully!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(data.message || "Failed to change password", "error");
      }
    } catch (error) {
      showToast("Error changing password", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    router.push("/signin");
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="settings-page">
        <Navbar />

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg animate-slide-down"
            style={{
              background: toast.type === "success"
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #ef4444, #dc2626)"
            }}
          >
            {toast.message}
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Settings size={28} className="text-white" />
            </div>
            <h1 className="hph text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-500">Manage your account preferences</p>
          </div>

          <div className="space-y-6">
            
            {/* Profile Section */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                    <User size={20} className="text-sky-600" />
                  </div>
                  <div>
                    <h2 className="hph font-bold text-gray-800 text-lg">Profile Information</h2>
                    <p className="text-gray-400 text-xs">Update your personal details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm text-sky-600 font-semibold hover:text-sky-700 transition"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-sm font-medium flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                      isEditing
                        ? "border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium flex items-center gap-2">
                    <Mail size={14} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium flex items-center gap-2">
                    <Smartphone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                      isEditing
                        ? "border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium flex items-center gap-2">
                    <Shield size={14} /> Role
                  </label>
                  <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 capitalize">
                    {profile.role}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Lock size={20} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="hph font-bold text-gray-800 text-lg">Security</h2>
                  <p className="text-gray-400 text-xs">Change your password</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                  />
                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <p className={`text-xs mt-1 ${
                      passwordData.newPassword === passwordData.confirmPassword
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {passwordData.newPassword === passwordData.confirmPassword
                        ? "✅ Passwords match"
                        : "❌ Passwords do not match"}
                    </p>
                  )}
                </div>
                <button
                  onClick={changePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock size={18} /> Update Password
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Bell size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="hph font-bold text-gray-800 text-lg">Notifications</h2>
                  <p className="text-gray-400 text-xs">Manage your notification preferences</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                  <div>
                    <p className="text-gray-700 font-medium text-sm">Email Alerts</p>
                    <p className="text-gray-400 text-xs">Receive email notifications</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                    className={`w-10 h-5 rounded-full relative transition-all ${
                      notifications.emailAlerts ? "bg-sky-500" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      notifications.emailAlerts ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                  <div>
                    <p className="text-gray-700 font-medium text-sm">System Alerts</p>
                    <p className="text-gray-400 text-xs">Critical system notifications</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, systemAlerts: !notifications.systemAlerts })}
                    className={`w-10 h-5 rounded-full relative transition-all ${
                      notifications.systemAlerts ? "bg-sky-500" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      notifications.systemAlerts ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                  <div>
                    <p className="text-gray-700 font-medium text-sm">Marketing Emails</p>
                    <p className="text-gray-400 text-xs">Updates and offers</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
                    className={`w-10 h-5 rounded-full relative transition-all ${
                      notifications.marketingEmails ? "bg-sky-500" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      notifications.marketingEmails ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <LogOut size={20} className="text-red-600" />
                </div>
                <div>
                  <h2 className="hph font-bold text-gray-800 text-lg">Account</h2>
                  <p className="text-gray-400 text-xs">Manage your account settings</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="setting-item">
                  <div className="icon-wrapper bg-red-50">
                    <LogOut size={18} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">Sign Out</p>
                    <p className="text-gray-400 text-xs">Logout from your account</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-1.5 rounded-lg bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="setting-item opacity-50 cursor-not-allowed">
                  <div className="icon-wrapper bg-gray-100">
                    <Trash2 size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">Delete Account</p>
                    <p className="text-gray-400 text-xs">Permanently delete your account</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}