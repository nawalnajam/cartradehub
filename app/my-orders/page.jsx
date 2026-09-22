"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CalendarDays, Clock, Car, CheckCircle, XCircle, ClockIcon, Calendar } from "lucide-react";

export default function MyOrdersPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching bookings...");
      const res = await fetch("/api/test-drive", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("📡 Response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📦 Data received:", data);
      
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setError(data.message || "Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      setError(error.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700", icon: ClockIcon, label: "Pending" };
      case "approved":
        return { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle, label: "Approved" };
      case "rejected":
        return { bg: "bg-rose-100", text: "text-rose-700", icon: XCircle, label: "Rejected" };
      case "completed":
        return { bg: "bg-sky-100", text: "text-sky-700", icon: CheckCircle, label: "Completed" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: ClockIcon, label: status };
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{
          background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f7fa 100%)"
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00bcd4]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12" style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f7fa 100%)"
      }}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00bcd4] to-[#0097a7] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calendar size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Test Drive Bookings</h1>
            <p className="text-gray-500">Track your test drive requests and their status</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-rose-700">
              <p className="font-semibold">Error loading bookings:</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => fetchBookings(localStorage.getItem("token"))}
                className="mt-2 text-sm text-rose-600 underline hover:text-rose-800"
              >
                Try again
              </button>
            </div>
          )}

          {bookings.length === 0 && !error ? (
            <div className="glass-card text-center py-16">
              <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings yet</h3>
              <p className="text-gray-500">Browse cars and book a test drive to get started</p>
              <button
                onClick={() => router.push("/cars")}
                className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white font-semibold hover:shadow-lg transition"
              >
                Browse Cars
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusConfig = getStatusBadge(booking.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={booking._id} className="glass-card p-6 hover:shadow-md transition">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00bcd4]/10 to-[#0097a7]/10 flex items-center justify-center">
                            <Car className="w-5 h-5 text-[#0097a7]" />
                          </div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {booking.car?.brand} {booking.car?.model} {booking.car?.year}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon size={12} />
                            {statusConfig.label}
                          </span>
                        </div>

                        {booking.car?.price && (
                          <p className="text-2xl font-bold text-[#0097a7] mb-3">
                            PKR {Number(booking.car.price).toLocaleString()}
                          </p>
                        )}

                        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-[#00bcd4]" />
                            <span>{new Date(booking.date).toLocaleDateString('en-PK')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#00bcd4]" />
                            <span>{booking.timeSlot}</span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-2 p-3 rounded-lg bg-white/50 text-sm text-gray-600 border border-gray-100">
                            <span className="font-medium text-gray-700">📝 Your notes:</span> {booking.notes}
                          </div>
                        )}

                        {(booking.adminNotes || booking.sellerNotes) && (
                          <div className={`mt-3 p-3 rounded-lg text-sm ${
                            booking.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                            booking.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                            'bg-sky-50 text-sky-700 border border-sky-100'
                          }`}>
                            <span className="font-medium">💬 Seller Response:</span> {booking.adminNotes || booking.sellerNotes}
                          </div>
                        )}
                      </div>

                      <div className="text-right text-xs text-gray-400">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Global Styles for glass card */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(0, 188, 212, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 188, 212, 0.4);
          box-shadow: 0 8px 25px rgba(0, 188, 212, 0.1);
        }
      `}</style>
    </>
  );
}