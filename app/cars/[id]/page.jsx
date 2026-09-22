"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import EMICalculator from "@/components/EMICalculator";
import {
  MapPin, Fuel, Settings2, Eye, Heart, Share2,
  CalendarDays, Gauge, Car, Shield, ChevronLeft,
  ChevronRight, CheckCircle, Phone, MessageCircle,
  Calculator, HelpCircle, Star, Zap, ArrowLeft, X,
  Clock, Calendar, User, Mail, FileText, Loader2,
  DollarSign, Percent, Wallet, Send
} from "lucide-react";

// ✅ Custom WhatsApp Icon
function WhatsAppIcon({ size = 20, color = "#25D366" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12C2 14.099 2.625 16.048 3.717 17.642L2.067 21.833C1.963 22.089 2.073 22.38 2.316 22.504C2.403 22.548 2.5 22.57 2.598 22.57C2.724 22.57 2.848 22.527 2.95 22.443L6.866 19.359C8.264 20.184 9.923 20.665 11.701 20.76L11.714 20.76C11.812 20.765 11.91 20.768 12.008 20.768C17.523 20.768 22 16.291 22 10.776C22 8.274 20.963 5.974 19.064 4.233C17.234 2.541 14.84 1.683 12.222 1.683L12 2ZM12 2.693C16.556 2.693 20.297 6.434 20.297 10.991C20.297 15.548 16.556 19.289 12 19.289C10.986 19.289 9.996 19.116 9.066 18.771L8.625 18.599L5.493 20.843L6.414 17.689L6.218 17.222C5.729 16.269 5.461 15.203 5.461 14.083C5.461 9.526 9.444 5.693 12 5.693Z"
        fill={color}
      />
      <path
        d="M9.274 7.874C9.082 7.874 8.776 7.925 8.521 8.18C8.267 8.435 7.5 9.157 7.5 10.632C7.5 12.107 8.583 13.523 8.736 13.724C8.889 13.925 10.203 15.917 12.167 16.699C12.936 16.999 13.538 17.169 14.012 17.294C14.773 17.5 15.474 17.462 16.031 17.354C16.647 17.236 17.949 16.593 18.172 15.897C18.395 15.201 18.395 14.601 18.314 14.434C18.233 14.267 18.027 14.157 17.718 14.028C17.409 13.899 16.43 13.439 16.158 13.323C15.887 13.207 15.67 13.207 15.497 13.381L15.274 13.604C15.126 13.752 14.791 14.084 14.658 14.246C14.525 14.408 14.382 14.437 14.111 14.308C13.84 14.179 12.939 13.868 11.82 12.88C10.701 11.892 10.367 11.117 10.293 10.927C10.219 10.737 10.302 10.625 10.414 10.493C10.526 10.361 10.659 10.186 10.717 10.078C10.775 9.97 10.782 9.869 10.739 9.788C10.696 9.707 10.554 9.352 10.467 9.133C10.381 8.914 10.19 8.803 10.029 8.793C9.898 8.785 9.695 8.78 9.538 8.776C9.381 8.772 9.208 8.745 9.064 8.745C8.921 8.745 8.754 8.826 8.631 8.949L9.274 7.874Z"
        fill={color}
      />
    </svg>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  .dp  { font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; background:#f0f7ff; }
  .hph { font-family:'Outfit',sans-serif; }

  .thumb { width:88px; height:64px; object-fit:cover; border-radius:10px; cursor:pointer; transition:all .2s ease; border:2px solid transparent; flex-shrink:0; }
  .thumb:hover { border-color:#0284c7; }
  .thumb.active { border-color:#0369a1; box-shadow:0 0 0 2px rgba(3,105,161,.25); }

  .main-img { width:100%; height:100%; object-fit:cover; transition:opacity .3s ease; display:block; }

  .ichip { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:12px; font-size:13px; font-weight:600; background:#fff; border:1.5px solid #e2e8f0; color:#374151; }

  .spec-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f1f5f9; }
  .spec-row:last-child { border-bottom:none; }

  .save-btn { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; transition:all .25s ease; border:1.5px solid #e2e8f0; background:#fff; color:#374151; }
  .save-btn:hover { border-color:#7dd3fc; color:#0284c7; }
  .save-btn.saved { background:#fef2f2; border-color:#fca5a5; color:#ef4444; }

  .book-btn { width:100%; padding:14px; border-radius:14px; font-size:15px; font-weight:700; color:#fff; border:none; cursor:pointer; background:linear-gradient(135deg,#0369a1,#0ea5e9); transition:all .3s ease; display:flex; align-items:center; justify-content:center; gap:8px; }
  .book-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(3,105,161,.35); }

  .req-btn { width:100%; padding:12px; border-radius:14px; font-size:14px; font-weight:600; color:#0369a1; border:1.5px solid #bae6fd; cursor:pointer; background:#fff; transition:all .3s ease; display:flex; align-items:center; justify-content:center; gap:8px; }
  .req-btn:hover { background:#e0f2fe; }

  .dcard { background:#fff; border:1.5px solid #e2e8f0; border-radius:16px; padding:20px 24px; margin-bottom:16px; }

  .badge { display:inline-flex; align-items:center; padding:4px 12px; border-radius:8px; font-size:12px; font-weight:700; background:#0f172a; color:#fff; }

  @keyframes sk { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  .skel { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:600px 100%; animation:sk 1.5s infinite; border-radius:16px; }

  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .fadein { animation:fadeIn .4s ease both; }

  @keyframes modalSlideIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  .modal-content {
    background: #fff;
    border-radius: 24px;
    max-width: 600px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .time-slot {
    padding: 10px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
  .time-slot:hover { border-color:#0369a1; background:#f0f9ff; }
  .time-slot.selected { background:linear-gradient(135deg,#0369a1,#0ea5e9); border-color:#0369a1; color:#fff; }

  .request-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1.5px solid #e2e8f0;
    background: #fff;
  }
  .request-option:hover {
    border-color: #0369a1;
    background: #f0f9ff;
    transform: translateY(-2px);
  }
  .request-option .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

export default function CarDetailPage() {
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // ✅ EMI Calculator States - Will be updated from EMICalculator component
  const [emiValues, setEmiValues] = useState({
    emi: 0,
    downPayment: 0,
    interestRate: 12,
    loanTerm: 3,
    totalPayment: 0,
    totalInterest: 0,
    loanAmount: 0,
  });

  // Booking form state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  const timeSlots = [
    "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00",
    "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    if (!id) return;
    fetch(`/api/public/cars/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setCar(d.car); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ✅ Update EMI values when calculator changes
  const handleEMIUpdate = (values) => {
    setEmiValues(values);
  };

  // ✅ Request Info - WhatsApp
  const handleWhatsAppRequest = () => {
    const phone = car?.seller?.phone || "923001234567";
    const message = encodeURIComponent(
      `Hello! I'm interested in your ${car?.brand} ${car?.model} (${car?.year}) listed on Car Trade Hub. PKR ${Number(car?.price).toLocaleString()}. Can you share more details?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // ✅ Send Message
  const handleSendMessage = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    if (!requestMessage || !requestMessage.trim()) {
      alert("Please write a message to the seller.");
      return;
    }

    if (!car || !car._id) {
      alert("Error: Car information not found. Please refresh the page.");
      return;
    }

    if (!car.seller || !car.seller._id) {
      alert("This car is listed by Car Trade Hub Admin. Please call our support team at +92 300 1234567 or email support@cartradehub.pk");
      return;
    }

    setRequestLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: car._id,
          sellerId: car.seller._id,
          message: requestMessage.trim(),
          subject: `Inquiry about ${car.brand} ${car.model}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Your message has been sent to the seller. They will contact you soon!");
        setShowRequestModal(false);
        setRequestMessage("");
      } else {
        alert("❌ " + (data.message || "Failed to send message. Please try again."));
      }
    } catch (error) {
      console.error("❌ Send message error:", error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const bookTestDrive = async () => {
    const token = localStorage.getItem("token");
    if (!token) { 
      router.push("/signin"); 
      return; 
    }
    
    if (!bookingDate || !bookingTime) {
      alert("Please select date and time for your test drive");
      return;
    }
    
    setBooking(true);
    try {
      const r = await fetch("/api/test-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          carId: car._id,
          date: bookingDate,
          timeSlot: bookingTime,
          notes: bookingNotes
        }),
      });
      const d = await r.json();
      if (d.success) {
        setBooked(true);
        setShowBookingModal(false);
        alert("Test drive booked successfully! The seller will contact you soon.");
        setBookingDate("");
        setBookingTime("");
        setBookingNotes("");
      } else {
        alert(d.message || "Could not book test drive");
      }
    } catch(e) { 
      alert("Something went wrong"); 
    }
    finally { setBooking(false); }
  };

  const prevImg = () => setActiveImg(i => (i - 1 + (car?.images?.length || 1)) % (car?.images?.length || 1));
  const nextImg = () => setActiveImg(i => (i + 1) % (car?.images?.length || 1));

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="dp"><Navbar />
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="skel" style={{ height: "420px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="skel" style={{ height: "40px", width: "60%" }} />
            <div className="skel" style={{ height: "50px", width: "80%" }} />
            <div className="skel" style={{ height: "200px" }} />
          </div>
        </div>
      </div>
    </>
  );

  if (!car) return (
    <>
      <style>{STYLES}</style>
      <div className="dp"><Navbar />
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <Car size={52} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#374151" }}>Car not found</p>
          <button onClick={() => router.push("/cars")}
            style={{ marginTop: "16px", background: "linear-gradient(135deg,#0369a1,#0ea5e9)", color: "#fff", border: "none", borderRadius: "12px", padding: "11px 22px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Back to Listings
          </button>
        </div>
      </div>
    </>
  );

  const imgs = car.images?.length ? car.images : ["/placeholder.png"];
  const isAdminCar = !car.seller || !car.seller._id;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="dp">
        <Navbar />

        {/* ✅ EMI Modal with EMICalculator Component */}
        {showEMIModal && (
          <div className="modal-overlay" onClick={() => setShowEMIModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "20px 24px", 
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0369a1, #0ea5e9)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calculator size={20} style={{ color: "#fff" }} />
                  </div>
                  <h2 className="hph" style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Car Loan EMI Calculator</h2>
                </div>
                <button onClick={() => setShowEMIModal(false)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  <X size={18} style={{ color: "#64748b" }} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                {/* ✅ Use the EMICalculator component */}
                <EMICalculator 
                  carPrice={parseInt(car.price)} 
                  onUpdate={handleEMIUpdate}
                />
              </div>
            </div>
          </div>
        )}

        {/* Request Info Modal */}
        {showRequestModal && (
          <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "20px 24px", 
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0369a1, #0ea5e9)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageCircle size={20} style={{ color: "#fff" }} />
                  </div>
                  <h2 className="hph" style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Contact Seller</h2>
                </div>
                <button onClick={() => setShowRequestModal(false)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  <X size={18} style={{ color: "#64748b" }} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
                  {isAdminCar ? (
                    <>This car is listed by <strong>Car Trade Hub Admin</strong></>
                  ) : (
                    <>Contact seller about <strong>{car.brand} {car.model} ({car.year})</strong></>
                  )}
                </p>

                <div className="request-option" onClick={handleWhatsAppRequest} style={{ marginBottom: "12px" }}>
                  <div className="icon" style={{ background: "#25D36620" }}>
                    <WhatsAppIcon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: "#0f172a" }}>WhatsApp</p>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>
                      {isAdminCar ? "Contact Admin on WhatsApp" : "Message seller on WhatsApp"}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: "#94a3b8" }} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div className="request-option" onClick={() => {}} style={{ cursor: "default" }}>
                    <div className="icon" style={{ background: "#0369a120" }}>
                      <Mail size={20} style={{ color: "#0369a1" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: "#0f172a" }}>
                        {isAdminCar ? "Contact Admin" : "Send Message"}
                      </p>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>
                        {isAdminCar ? "Email or message the admin team" : "Send a message to the seller"}
                      </p>
                    </div>
                  </div>

                  {isAdminCar ? (
                    <div style={{ 
                      background: "#f0f9ff", 
                      padding: "16px", 
                      borderRadius: "12px", 
                      border: "1px solid #bae6fd",
                      marginTop: "12px"
                    }}>
                      <p style={{ fontSize: "14px", color: "#0369a1", fontWeight: 600, marginBottom: "8px" }}>
                        📧 Email: support@cartradehub.pk
                      </p>
                      <p style={{ fontSize: "14px", color: "#0369a1", fontWeight: 600 }}>
                        📞 Phone: +92 300 1234567
                      </p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: "12px",
                          fontSize: "14px",
                          marginTop: "12px",
                          resize: "vertical",
                          outline: "none",
                          fontFamily: "inherit"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#0369a1"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={requestLoading || !requestMessage.trim()}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          marginTop: "12px",
                          background: requestMessage.trim() && !requestLoading ? "linear-gradient(135deg, #0369a1, #0ea5e9)" : "#94a3b8",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                      >
                        {requestLoading ? (
                          <><Loader2 size={16} className="animate-spin" /> Sending...</>
                        ) : (
                          <><Send size={16} /> Send Message</>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Drive Booking Modal */}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "20px 24px", 
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0369a1, #0ea5e9)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CalendarDays size={20} style={{ color: "#fff" }} />
                  </div>
                  <h2 className="hph" style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Book a Test Drive</h2>
                </div>
                <button onClick={() => setShowBookingModal(false)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  <X size={18} style={{ color: "#64748b" }} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)", borderRadius: "16px", padding: "16px", marginBottom: "24px", border: "1px solid #bae6fd" }}>
                  <h3 className="hph" style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Car Details</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <div>
                      <p style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{car.year} {car.brand} {car.model}</p>
                      <p style={{ fontSize: "20px", fontWeight: 700, color: "#0369a1" }}>PKR {Number(car.price).toLocaleString()}</p>
                    </div>
                    {car.images?.[0] && <img src={car.images[0]} alt="car" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />}
                  </div>
                </div>
                <div>
                  <h3 className="hph" style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Schedule Your Test Drive</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}><Calendar size={16} style={{ color: "#0369a1" }} /> Select a Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={getMinDate()} max={getMaxDate()} style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "all 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#0369a1"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}><Clock size={16} style={{ color: "#0369a1" }} /> Select a Time Slot</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {timeSlots.map((slot) => (
                        <div key={slot} className={`time-slot ${bookingTime === slot ? "selected" : ""}`} onClick={() => setBookingTime(slot)}>{slot}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}><FileText size={16} style={{ color: "#0369a1" }} /> Additional Notes (Optional)</label>
                    <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Any specific questions or preferences about the car..." rows="3" style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none" }} onFocus={(e) => e.target.style.borderColor = "#0369a1"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <button className="book-btn" onClick={bookTestDrive} disabled={booking || !bookingDate || !bookingTime} style={{ width: "100%", opacity: (!bookingDate || !bookingTime) ? 0.5 : 1, marginTop: "8px" }}>
                    {booking ? (<>⏳ Booking...</>) : (<><CalendarDays size={18} /> Confirm Test Drive</>)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <button onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "#0284c7", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            <ArrowLeft size={16} /> Back to listings
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 fadein">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* ── LEFT: Images ── */}
            <div>
              <div style={{ position: "relative", height: "400px", borderRadius: "20px", overflow: "hidden", background: "#e2e8f0", marginBottom: "12px", boxShadow: "0 4px 24px rgba(0,0,0,.1)" }}>
                <img src={imgs[activeImg]} alt={`${car.brand} ${car.model}`} className="main-img" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.2) 0%,transparent 40%)" }} />
                {imgs.length > 1 && (
                  <>
                    <button onClick={prevImg} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                      <ChevronLeft size={18} style={{ color: "#0f172a" }} />
                    </button>
                    <button onClick={nextImg} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                      <ChevronRight size={18} style={{ color: "#0f172a" }} />
                    </button>
                  </>
                )}
                <span style={{ position: "absolute", bottom: "12px", right: "12px", padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, background: "rgba(0,0,0,.5)", color: "#fff", backdropFilter: "blur(6px)" }}>
                  {activeImg + 1}/{imgs.length}
                </span>
              </div>
              {imgs.length > 1 && (
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                  {imgs.map((img, i) => (<img key={i} src={img} alt={`thumb ${i + 1}`} className={`thumb${activeImg === i ? " active" : ""}`} onClick={() => setActiveImg(i)} />))}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button className={`save-btn${saved ? " saved" : ""}`} onClick={() => setSaved(!saved)}>
                  <Heart size={16} style={{ fill: saved ? "#ef4444" : "none", color: saved ? "#ef4444" : "currentColor" }} />
                  {saved ? "Saved" : "Save"}
                </button>
                <button className="save-btn" onClick={() => navigator.share?.({ title: `${car.brand} ${car.model}`, url: window.location.href })}>
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* ── RIGHT: Details ── */}
            <div>
              <div style={{ marginBottom: "16px" }}>
                {car.bodyType && <span className="badge" style={{ marginBottom: "10px", display: "inline-block" }}>{car.bodyType}</span>}
                <h1 className="hph" style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.2, margin: "8px 0" }}>{car.year} {car.brand} {car.model}</h1>
                {car.variant && <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>{car.variant}</p>}
              </div>
              <p className="hph" style={{ fontSize: "32px", fontWeight: 900, color: "#0369a1", marginBottom: "16px" }}>PKR {Number(car.price).toLocaleString()}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {car.mileage && <span className="ichip"><Gauge size={14} style={{ color: "#0284c7" }} />{car.mileage} km</span>}
                {car.fuelType && <span className="ichip"><Fuel size={14} style={{ color: "#22c55e" }} />{car.fuelType}</span>}
                {car.transmission && <span className="ichip"><Settings2 size={14} style={{ color: "#8b5cf6" }} />{car.transmission}</span>}
                {car.location && <span className="ichip"><MapPin size={14} style={{ color: "#ef4444" }} />{car.location}</span>}
              </div>

              {/* ✅ EMI CARD - Shows values from EMICalculator */}
              <div 
                className="dcard" 
                onClick={() => setShowEMIModal(true)}
                style={{ 
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  marginBottom: "16px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(3,105,161,0.10)";
                  e.currentTarget.style.borderColor = "#0369a1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Header */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  marginBottom: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calculator size={18} style={{ color: "#0369a1" }} />
                    <p className="hph" style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>
                      Car Loan EMI Calculator
                    </p>
                  </div>
                  <span style={{ 
                    fontSize: "11px", 
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    Click to calculate →
                  </span>
                </div>

                {/* Price Row */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Vehicle Price</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                    PKR {parseInt(car.price).toLocaleString()}
                  </span>
                </div>

                {/* Down Payment Row - Shows current value */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Down Payment</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                    PKR {emiValues.downPayment.toLocaleString()}
                  </span>
                </div>

                {/* Down Payment Percentage */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "flex-end",
                  padding: "4px 0 8px 0",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Down payment: {car.price ? ((emiValues.downPayment / parseInt(car.price)) * 100).toFixed(1) : 0}% of vehicle price
                  </span>
                </div>

                {/* Interest Rate & Loan Term */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Interest Rate</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                    {emiValues.interestRate}% • {emiValues.loanTerm * 12} Months
                  </span>
                </div>

                {/* Monthly Payment - HIGHLIGHTED - Shows calculated EMI */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "12px 0 4px 0"
                }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#64748b" }}>Monthly Payment</span>
                  <span style={{ 
                    fontSize: "22px", 
                    fontWeight: 900, 
                    color: "#0369a1"
                  }}>
                    PKR {Math.round(emiValues.emi).toLocaleString()}
                  </span>
                </div>

                <p style={{ 
                  fontSize: "10px", 
                  color: "#94a3b8", 
                  marginTop: "6px",
                  textAlign: "right",
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "8px"
                }}>
                  *Adjust down payment, interest rate & term in calculator
                </p>
              </div>

              {/* Have Questions Card */}
              <div className="dcard">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <MessageCircle size={18} style={{ color: "#0369a1" }} />
                  <p className="hph" style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>Have Questions?</p>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>
                  {isAdminCar ? "Contact Car Trade Hub Admin directly." : "Contact the seller directly via WhatsApp or send a message."}
                </p>
                <button className="req-btn" onClick={() => setShowRequestModal(true)} style={{ marginBottom: "10px" }}>
                  <MessageCircle size={15} /> Request Info
                </button>
                <button className="book-btn" onClick={() => setShowBookingModal(true)} disabled={booked} style={{ opacity: booked ? 0.7 : 1 }}>
                  {booked ? (<><CheckCircle size={17} /> Test Drive Booked!</>) : (<><CalendarDays size={17} /> Book Test Drive</>)}
                </button>
              </div>

              <p style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                <Eye size={13} /> {car.views || 0} people viewed this listing
              </p>
            </div>
          </div>

          {/* ── BOTTOM: Full specs + Description ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            <div className="lg:col-span-2">
              <div className="dcard">
                <h2 className="hph" style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", marginBottom: "20px" }}>Vehicle Specifications</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                  {[["Brand", car.brand], ["Model", car.model], ["Year", car.year], ["Variant", car.variant], ["Body Type", car.bodyType], ["Color", car.color], ["Fuel Type", car.fuelType], ["Transmission", car.transmission], ["Engine", car.engine], ["Drive Type", car.driveType], ["Seats", car.seats], ["Mileage", car.mileage ? `${car.mileage} km` : null], ["Assembly", car.assembly], ["Condition", car.condition], ["Headlights", car.headlights], ["Wheel Type", car.wheelType], ["Location", car.location], ["Status", car.availabilityStatus]].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label} className="spec-row">
                      <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600, textAlign: "right" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              {(car.description || car.additionalInfo) && (
                <div className="dcard">
                  <h2 className="hph" style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", marginBottom: "14px" }}>Description</h2>
                  {car.description && <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.75", marginBottom: "12px" }}>{car.description}</p>}
                  {car.additionalInfo && <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.75" }}>{car.additionalInfo}</p>}
                </div>
              )}
            </div>
            <div>
              {!isAdminCar && car.seller && (
                <div className="dcard">
                  <h3 className="hph" style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a", marginBottom: "14px" }}>Seller Info</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#0369a1,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "18px", fontFamily: "Outfit,sans-serif" }}>
                      {car.seller?.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>{car.seller?.name || "Verified Seller"}</p>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>{car.seller?.email || ""}</p>
                      {car.seller?.phone && <p style={{ fontSize: "12px", color: "#64748b" }}>📱 {car.seller.phone}</p>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <Shield size={14} style={{ color: "#22c55e" }} />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#15803d" }}>Admin Verified Seller</span>
                  </div>
                </div>
              )}

              {isAdminCar && (
                <div className="dcard">
                  <h3 className="hph" style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a", marginBottom: "14px" }}>Listed By</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#0369a1,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "18px", fontFamily: "Outfit,sans-serif" }}>
                      <Shield size={20} style={{ color: "#fff" }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>Car Trade Hub Admin</p>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>Verified & Trusted</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <Shield size={14} style={{ color: "#22c55e" }} />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#15803d" }}>Admin Verified Listing</span>
                  </div>
                </div>
              )}

              <div className="dcard">
                <h3 className="hph" style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a", marginBottom: "14px" }}>Why Buy With Us?</h3>
                {[{ Icon: Shield, text: "Admin verified listing", color: "#22c55e" }, { Icon: CheckCircle, text: "Secure transaction process", color: "#0284c7" }, { Icon: Star, text: "Trusted by 5,000+ buyers", color: "#f59e0b" }, { Icon: Zap, text: "AI-powered car details", color: "#8b5cf6" }].map(({ Icon, text, color }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}