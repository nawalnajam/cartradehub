"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SellButton from "@/components/SellButton";
import SignInButton from "@/components/SignInButton";
import {
  Menu, X, Bell, MessageCircle, ShoppingCart,
  Heart, FileText, CreditCard, BookOpen,
  HelpCircle, Settings, LogOut, Package,
  LayoutDashboard, Shield, Users, Car,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [user, setUser]         = useState(null);
  const [admin, setAdmin]       = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname(); // ✅ current route

  useEffect(() => {
    const storedUser  = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");
    if (storedUser)  setUser(JSON.parse(storedUser));
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

    if (storedUser || storedAdmin) {
      fetchUnreadCount();
    }
  }, []);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/messages?type=received&limit=1", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const text = await res.text();
      if (!text || text.trim() === "") return;

      const data = JSON.parse(text);
      if (data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.warn("Could not fetch unread count:", error.message);
    }
  };

  useEffect(() => {
    if (!user && !admin) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, admin]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setUser(null);
    setAdmin(null);
    setUserMenu(false);
    router.push("/");
  };

  const isAdmin = admin && admin.role === "admin";

  // ✅ helper: check karta hai ke ye link currently active hai ya nahi
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  
  const navLinkClass = (href) =>
    `relative pb-1 transition-colors ${
      isActive(href)
        ? "text-green-700 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-green-600"
        : "text-green-700 hover:text-sky-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

     
        <Link href="/" className="relative h-76 w-56 flex items-center mt-7">
          <Image
            src="/car-Photoroom.png"
            alt="Car Trade Hub"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-10 text-sm font-bold tracking-wide">
          <Link href="/"        className={navLinkClass("/")}>HOME</Link>
          <Link href="/cars"    className={navLinkClass("/cars")}>CAR LISTING</Link>
          <Link href="/about"   className={navLinkClass("/about")}>ABOUT US</Link>
          <Link href="/contact" className={navLinkClass("/contact")}>CONTACT US</Link>
          <Link href="/blogs"   className={navLinkClass("/blogs")}>BLOG</Link>
        </div>

        <div className="hidden md:flex items-center gap-5">

          {!user && !isAdmin && (
            <>
              <SignInButton />
              <SellButton />
            </>
          )}

          {user && !isAdmin && (
            <>
              <Link
                href="/messages"
                className="relative text-gray-700 hover:text-sky-400 transition"
                title="Messages"
              >
                <MessageCircle size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1.5 animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <div
                  onClick={() => setUserMenu(!userMenu)}
                  className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {userMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border overflow-hidden text-sm z-50">

                    <div className="p-4 flex items-center gap-3 border-b">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name?.toLowerCase()}</p>
                        <button
                          onClick={() => router.push("/profile")}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Public Profile
                        </button>
                      </div>
                    </div>

                    <div className="m-3 p-3 rounded-lg bg-emerald-50 border flex gap-3">
                      <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-700">Buy Discounted Packages</p>
                        <p className="text-xs text-emerald-600">More Credits, More Savings</p>
                      </div>
                    </div>

                    <div className="py-2">
                      <MenuItem
                        icon={<MessageCircle size={16}/>}
                        text="Messages"
                        onClick={() => { router.push("/messages"); setUserMenu(false); }}
                        badge={unreadCount}
                      />
                      <MenuItem icon={<FileText size={16}/>}   text="My Ads"          onClick={() => { router.push("/dashboard/seller"); setUserMenu(false); }} />
                      <MenuItem icon={<Heart size={16}/>}      text="Favourites"       onClick={() => { router.push("/favourites"); setUserMenu(false); }} />
                      <MenuItem icon={<FileText size={16}/>}   text="My Bookings"        onClick={() => { router.push("/my-orders"); setUserMenu(false); }} />
                      <MenuItem icon={<CreditCard size={16}/>} text="Payment Options"  onClick={() => { router.push("/payment-options"); setUserMenu(false); }} />
                      <Divider />
                      <MenuItem icon={<BookOpen size={16}/>}   text="Blogs"            onClick={() => { router.push("/blogs"); setUserMenu(false); }} />
                      <MenuItem icon={<HelpCircle size={16}/>} text="Help"             onClick={() => { router.push("/help"); setUserMenu(false); }} />
                      <MenuItem icon={<Settings size={16}/>}   text="Settings"         onClick={() => { router.push("/settings"); setUserMenu(false); }} />
                      <Divider />
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <SellButton />
            </>
          )}

          {isAdmin && (
            <>
              <div className="relative">
                <div
                  onClick={() => setUserMenu(!userMenu)}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold cursor-pointer text-white"
                  style={{ background: "linear-gradient(135deg,#0369a1,#0ea5e9)" }}
                >
                  A
                </div>

                {userMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border overflow-hidden text-sm z-50">

                    <div className="p-4 flex items-center gap-3 border-b"
                      style={{ background: "linear-gradient(135deg,rgba(3,105,161,.08),rgba(14,165,233,.08))" }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                        style={{ background: "linear-gradient(135deg,#0369a1,#0ea5e9)" }}>
                        A
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Administrator</p>
                        <p className="text-xs text-sky-600">{admin.email}</p>
                      </div>
                    </div>

                    <div className="mx-3 mt-3 mb-1 p-2.5 rounded-lg flex items-center gap-3"
                      style={{ background: "rgba(3,105,161,.06)", border: "1px solid rgba(3,105,161,.15)" }}>
                      <Shield size={16} style={{ color: "#0369a1" }} />
                      <p className="text-xs font-bold text-sky-700">Admin Access Enabled</p>
                    </div>

                    <div className="py-2">
                      <MenuItem
                        icon={<LayoutDashboard size={16} style={{ color: "#0369a1" }}/>}
                        text="Admin Dashboard"
                        onClick={() => { router.push("/admin/dashboard"); setUserMenu(false); }}
                      />
                      <MenuItem
                        icon={<Car size={16} style={{ color: "#0369a1" }}/>}
                        text="Manage Cars"
                        onClick={() => { router.push("/admin/dashboard"); setUserMenu(false); }}
                      />
                      <MenuItem
                        icon={<Users size={16} style={{ color: "#0369a1" }}/>}
                        text="Manage Users"
                        onClick={() => { router.push("/admin/dashboard"); setUserMenu(false); }}
                      />
                      <MenuItem
                        icon={<FileText size={16} style={{ color: "#0369a1" }}/>}
                        text="Test Drive Requests"
                        onClick={() => { router.push("/admin/dashboard"); setUserMenu(false); }}
                      />
                      <MenuItem
                        icon={<Settings size={16} style={{ color: "#0369a1" }}/>}
                        text="Settings"
                        onClick={() => { router.push("/admin/dashboard"); setUserMenu(false); }}
                      />
                      <Divider />
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white/95 backdrop-blur-md">
          <Link href="/"        className={`block font-medium ${isActive("/") ? "text-green-700 underline decoration-2 underline-offset-4" : ""}`}>Home</Link>
          <Link href="/cars"    className={`block font-medium ${isActive("/cars") ? "text-green-700 underline decoration-2 underline-offset-4" : ""}`}>Car Listing</Link>
          <Link href="/about"   className={`block font-medium ${isActive("/about") ? "text-green-700 underline decoration-2 underline-offset-4" : ""}`}>About Us</Link>
          <Link href="/contact" className={`block font-medium ${isActive("/contact") ? "text-green-700 underline decoration-2 underline-offset-4" : ""}`}>Contact Us</Link>
          <Link href="/blogs"   className={`block font-medium ${isActive("/blogs") ? "text-green-700 underline decoration-2 underline-offset-4" : ""}`}>Blog</Link>

          {isAdmin ? (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#0369a1,#0ea5e9)" }}
              >
                Admin Dashboard
              </button>
              <button onClick={logout} className="px-4 py-2 rounded-lg text-sm font-bold text-red-600 border border-red-200">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <SellButton />
              {!user && <SignInButton />}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function MenuItem({ icon, text, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-left"
    >
      {icon}
      <span className="flex-1">{text}</span>
      {badge > 0 && (
        <span className="min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1.5">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="my-2 border-t" />;
}