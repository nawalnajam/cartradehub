"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "assistant", 
      text: "👋 Welcome to CarTradeHub! How can I help you find your dream car today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null); 
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  
  useEffect(() => {
    if (pendingRedirect) {
      const timer = setTimeout(() => {
        router.push(pendingRedirect);
        setIsOpen(false);
        setPendingRedirect(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pendingRedirect, router]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();

   
      setMessages(prev => [
        ...prev,
        { from: "assistant", text: data.reply || "Sorry, I didn't understand that." }
      ]);

   
      if (data.redirectUrl) {
        console.log("🔀 Redirecting to:", data.redirectUrl); 
        setPendingRedirect(data.redirectUrl);
      }

    } catch (error) {
      console.error("❌ Chat error:", error);
      setMessages(prev => [
        ...prev,
        { from: "assistant", text: "⚠️ Network error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
<button
  onClick={() => setIsOpen(true)}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
>
  <Bot size={24} className="group-hover:rotate-12 transition-transform" />
  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
</button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">🚗</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">CarTradeHub AI</h3>
                <p className="text-[10px] opacity-90">Online • Car Expert</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1.5 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                {msg.from === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                    AI
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.from === "user"
                    ? "bg-sky-500 text-white rounded-br-none shadow-md"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}>
                  {msg.text}
                </div>
                {msg.from === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold ml-2 flex-shrink-0 mt-1">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Redirect Notice */}
            {pendingRedirect && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  AI
                </div>
                <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm text-sm text-blue-700">
                  ⏳ Redirecting you to the page...
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && !pendingRedirect && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  AI
                </div>
                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-gray-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about cars... (e.g., BMW, EMI, sell)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-sm transition-all"
              disabled={loading || pendingRedirect !== null}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || pendingRedirect !== null}
              className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-none flex-shrink-0"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </>
  );
}