"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  MessageCircle, Mail, User, Car, Calendar,
  CheckCircle, XCircle, Clock, Loader2,
  Eye, Trash2, ArrowLeft, ChevronRight,
  Inbox, Send, Filter, AlertCircle
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .msg-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
  }
  .hph { font-family: 'Outfit', sans-serif; }

  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid rgba(0, 188, 212, 0.12);
    transition: all 0.3s ease;
  }
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 188, 212, 0.25);
  }

  .msg-item {
    background: white;
    border-radius: 12px;
    padding: 16px 20px;
    border: 1.5px solid #e2e8f0;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .msg-item:hover {
    border-color: #00bcd4;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 188, 212, 0.06);
  }
  .msg-item.unread {
    border-left: 4px solid #00bcd4;
    background: #f8fafc;
  }
  .msg-item.read {
    border-left: 4px solid #94a3b8;
  }
  .msg-item .sender-badge {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 99px;
    font-weight: 600;
  }
  .msg-item .sender-badge.received {
    background: #dbeafe;
    color: #1d4ed8;
  }
  .msg-item .sender-badge.sent {
    background: #d1fae5;
    color: #065f46;
  }
  .msg-item .contact-badge {
    background: #fef3c7;
    color: #92400e;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up {
    animation: fadeUp 0.3s ease forwards;
  }
`;

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // ✅ Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // ✅ Redirect to signin if no token
      router.push("/signin");
      return;
    }
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUserId(user?.id || null);
    
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/messages?type=${filter}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ✅ Handle 401 Unauthorized
      if (res.status === 401) {
        // Token expired or invalid – logout and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        router.push("/signin");
        return;
      }

      if (!res.ok) {
        let errorMsg = "Failed to load messages";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          errorMsg = res.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        setError(data.message || "Failed to load messages");
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      setError(error.message || "Something went wrong loading messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ messageId, status: "read" }),
      });
      setMessages(prev => prev.map(m => 
        m._id === messageId ? { ...m, status: "read" } : m
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteMessage = async (messageId, e) => {
    e.stopPropagation();
    if (!confirm("Delete this message?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`/api/messages?id=${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.filter(m => m._id !== messageId));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      markAsRead(message._id);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageType = (msg) => {
    if (!msg.car && !msg.buyer && msg.buyerEmail) {
      return { type: "contact", label: "Contact", badge: "contact-badge" };
    }
    if (msg.buyer?._id === currentUserId) {
      return { type: "sent", label: "Sent", badge: "sent" };
    }
    if (msg.seller?._id === currentUserId) {
      return { type: "received", label: "Received", badge: "received" };
    }
    return { type: "unknown", label: "Message", badge: "" };
  };

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="msg-page">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 size={40} className="animate-spin text-[#00bcd4]" />
          </div>
        </div>
      </>
    );
  }

  const totalMessages = messages.length;
  const hasUnread = messages.some(m => m.status === "unread");

  return (
    <>
      <style>{STYLES}</style>
      <div className="msg-page">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00bcd4] to-[#0097a7] flex items-center justify-center shadow-md">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <h1 className="hph text-2xl font-bold text-gray-800">Messages</h1>
                <p className="text-gray-500 text-sm">
                  {totalMessages} {totalMessages === 1 ? 'message' : 'messages'}
                  {hasUnread && (
                    <span className="ml-2 text-red-500 font-semibold">
                      • {unreadCount} unread
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/cars")}
              className="px-4 py-2 rounded-xl bg-[#00bcd4]/10 text-[#0097a7] text-sm font-semibold hover:bg-[#00bcd4]/20 transition flex items-center gap-2"
            >
              <Car size={16} /> Browse Cars
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
              <button onClick={fetchMessages} className="ml-auto text-sm font-semibold hover:underline">
                Try Again
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "all", label: "📥 All Messages", icon: Inbox },
              { id: "received", label: "📩 Received", icon: Mail },
              { id: "sent", label: "📤 Sent", icon: Send },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-[#00bcd4] text-white shadow-md"
                    : "bg-white/70 text-gray-600 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {messages.length === 0 ? (
            <div className="glass-card p-12 text-center">
              {filter === "received" ? (
                <Mail size={48} className="mx-auto text-gray-300 mb-4" />
              ) : filter === "sent" ? (
                <Send size={48} className="mx-auto text-gray-300 mb-4" />
              ) : (
                <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
              )}
              <h3 className="text-lg font-semibold text-gray-700">
                {filter === "received" 
                  ? "No messages received yet"
                  : filter === "sent"
                  ? "No messages sent yet"
                  : "Your inbox is empty"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {filter === "received" 
                  ? "When someone messages you, it will appear here"
                  : filter === "sent"
                  ? "When you message someone, it will appear here"
                  : "Start browsing cars and contact sellers"}
              </p>
              <button
                onClick={() => router.push("/cars")}
                className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white font-semibold hover:shadow-lg transition"
              >
                Browse Cars
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {messages.map((msg, idx) => {
                  const msgType = getMessageType(msg);
                  const isContact = msgType.type === "contact";
                  const isSent = msgType.type === "sent";
                  const isReceived = msgType.type === "received";
                  
                  let senderName = "User";
                  let senderInitial = "U";
                  
                  if (isContact) {
                    senderName = msg.buyerName || "Unknown";
                    senderInitial = senderName.charAt(0)?.toUpperCase() || "U";
                  } else if (isSent) {
                    senderName = msg.seller?.name || "Seller";
                    senderInitial = senderName.charAt(0)?.toUpperCase() || "S";
                  } else if (isReceived) {
                    senderName = msg.buyer?.name || "User";
                    senderInitial = senderName.charAt(0)?.toUpperCase() || "U";
                  }
                  
                  return (
                    <div
                      key={msg._id}
                      className={`msg-item ${msg.status === "unread" && isReceived ? "unread" : "read"} fade-up`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                      onClick={() => viewMessage(msg)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isContact ? "bg-amber-100" :
                          isSent ? "bg-emerald-100" : "bg-gray-100"
                        }`}>
                          <span className={`font-bold text-sm ${
                            isContact ? "text-amber-600" :
                            isSent ? "text-emerald-600" : "text-gray-600"
                          }`}>
                            {senderInitial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {senderName}
                            </p>
                            <span className={`sender-badge ${
                              isContact ? "contact-badge" :
                              isSent ? "sent" : "received"
                            }`}>
                              {isContact ? "Contact" : isSent ? "Sent" : "Received"}
                            </span>
                            {msg.status === "unread" && isReceived && (
                              <span className="w-2 h-2 rounded-full bg-[#00bcd4] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                            {msg.car && (
                              <span className="text-xs text-[#00bcd4] truncate">
                                {msg.car.brand} {msg.car.model}
                              </span>
                            )}
                            {!msg.car && isContact && (
                              <span className="text-xs text-amber-500">📩 Contact Form</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => deleteMessage(msg._id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !selectedMessage.car && !selectedMessage.buyer && selectedMessage.buyerEmail
                            ? "bg-amber-100" 
                            : selectedMessage.buyer?._id === currentUserId 
                              ? "bg-emerald-100" 
                              : "bg-gradient-to-r from-sky-500 to-emerald-500"
                        }`}>
                          <span className={`font-bold text-sm ${
                            !selectedMessage.car && !selectedMessage.buyer && selectedMessage.buyerEmail
                              ? "text-amber-600"
                              : selectedMessage.buyer?._id === currentUserId 
                                ? "text-emerald-600" 
                                : "text-white"
                          }`}>
                            {!selectedMessage.car && !selectedMessage.buyer && selectedMessage.buyerEmail
                              ? selectedMessage.buyerName?.charAt(0)?.toUpperCase() || "C"
                              : selectedMessage.buyer?._id === currentUserId 
                                ? selectedMessage.seller?.name?.charAt(0)?.toUpperCase() || "S"
                                : selectedMessage.buyer?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {!selectedMessage.car && !selectedMessage.buyer && selectedMessage.buyerEmail
                              ? selectedMessage.buyerName || "Contact Form"
                              : selectedMessage.buyer?._id === currentUserId 
                                ? selectedMessage.seller?.name || "Seller"
                                : selectedMessage.buyer?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedMessage.buyerEmail || selectedMessage.buyer?.email || selectedMessage.seller?.email || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          selectedMessage.status === "unread" && selectedMessage.buyer?._id !== currentUserId
                            ? "bg-[#00bcd4]/10 text-[#0097a7]" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {selectedMessage.status === "unread" && selectedMessage.buyer?._id !== currentUserId 
                            ? "Unread" 
                            : "Read"}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          !selectedMessage.car && !selectedMessage.buyer && selectedMessage.buyerEmail
                            ? "bg-amber-100 text-amber-600"
                            : selectedMessage.buyer?._id === currentUserId 
                              ? "bg-emerald-100 text-emerald-600" 
                              : "bg-blue-100 text-blue-600"
                        }`}>
                          {!selectedMessage.car && !selectedMessage.buyer && selectedMessage.buyerEmail
                            ? "Contact"
                            : selectedMessage.buyer?._id === currentUserId ? "Sent" : "Received"}
                        </span>
                        <button
                          onClick={(e) => deleteMessage(selectedMessage._id, { stopPropagation: () => {} })}
                          className="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">Subject</p>
                        <p className="font-medium text-gray-800">{selectedMessage.subject}</p>
                      </div>

                      {selectedMessage.car ? (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Car size={16} className="text-[#00bcd4]" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {selectedMessage.car.brand} {selectedMessage.car.model}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedMessage.car.year} • PKR {Number(selectedMessage.car.price).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => router.push(`/cars/${selectedMessage.car._id}`)}
                            className="ml-auto px-3 py-1.5 rounded-lg bg-[#00bcd4]/10 text-[#0097a7] text-xs font-semibold hover:bg-[#00bcd4]/20 transition"
                          >
                            View Car
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                          <Mail size={16} className="text-amber-500" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">Contact Form Message</p>
                            <p className="text-xs text-amber-600">
                              From: {selectedMessage.buyerName} • {selectedMessage.buyerEmail}
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-400">Message</p>
                        <div className="mt-2 p-4 bg-gray-50 rounded-xl whitespace-pre-wrap">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        {selectedMessage.buyer?._id !== currentUserId && selectedMessage.buyer?.phone && (
                          <a
                            href={`https://wa.me/${selectedMessage.buyer.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-100 transition flex items-center gap-2"
                          >
                            <MessageCircle size={16} /> Reply on WhatsApp
                          </a>
                        )}
                        {selectedMessage.seller?._id !== currentUserId && selectedMessage.seller?.phone && (
                          <a
                            href={`https://wa.me/${selectedMessage.seller.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-100 transition flex items-center gap-2"
                          >
                            <MessageCircle size={16} /> Reply on WhatsApp
                          </a>
                        )}
                        {selectedMessage.car && (
                          <button
                            onClick={() => router.push(`/cars/${selectedMessage.car._id}`)}
                            className="px-4 py-2 rounded-xl bg-[#00bcd4]/10 text-[#0097a7] text-sm font-semibold hover:bg-[#00bcd4]/20 transition flex items-center gap-2"
                          >
                            <Eye size={16} /> View Car
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center">
                    <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a message to read</p>
                    <p className="text-xs text-gray-400 mt-1">Click on any message from the list</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}