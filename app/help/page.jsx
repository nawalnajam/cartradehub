"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, Search, FileText, Shield, CreditCard, Car, Users } from "lucide-react";

const faqs = [
  { q: "How do I list my car for sale?", a: "Click on 'Sell' button in the navbar, fill in your car details, upload photos, and submit. Your listing will be reviewed by our admin team within 24 hours." },
  { q: "How does AI image search work?", a: "Click the camera icon in search bar, upload a photo of any car, and our AI will identify similar cars available in our inventory." },
  { q: "How can I book a test drive?", a: "Go to any car detail page, click 'Book Test Drive', select your preferred date and time, and submit the request. The seller will contact you to confirm." },
  { q: "Is my payment information secure?", a: "Yes, we use 256-bit SSL encryption and never store your full payment details on our servers." },
  { q: "How long does it take to approve my ad?", a: "Ads are typically approved within 2-4 hours during business hours. You'll receive an email notification once approved." },
  { q: "Can I edit my listing after posting?", a: "Yes, go to 'My Ads' in your dashboard, click edit icon, make changes and save. Edited ads will be reviewed again." },
];

const categories = [
  { icon: Car, title: "Buying", desc: "How to buy cars on Car Trade Hub" },
  { icon: Users, title: "Selling", desc: "Guide to selling your car quickly" },
  { icon: CreditCard, title: "Payments", desc: "Secure payment methods" },
  { icon: Shield, title: "Safety", desc: "Safety tips and guidelines" },
];

export default function HelpPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f7fa 100%)"
    }}>
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00bcd4] to-[#0097a7] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HelpCircle size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">How can we help you?</h1>
          <p className="text-gray-500">Find answers to commonly asked questions</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search for help..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#00bcd4] focus:outline-none bg-white/80" />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.title} className="glass-card p-4 text-center hover:scale-105 transition cursor-pointer">
              <cat.icon size={24} className="mx-auto text-[#0097a7] mb-2" />
              <p className="font-semibold text-gray-800 text-sm">{cat.title}</p>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="glass-card overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex justify-between items-center p-5 text-left">
                <span className="font-semibold text-gray-800">{faq.q}</span>
                {openIndex === idx ? <ChevronUp size={18} className="text-[#0097a7]" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              {openIndex === idx && <div className="px-5 pb-5 text-gray-500 text-sm border-t border-gray-100 pt-3">{faq.a}</div>}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="glass-card p-8 text-center">
          <MessageCircle size={32} className="mx-auto text-[#0097a7] mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-5">Our support team is here to help you</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary flex items-center gap-2"><Mail size={16} /> support@cartradehub.pk</button>
            <button className="btn-outline flex items-center gap-2"><Phone size={16} /> +92 300 1234567</button>
          </div>
        </div>
      </div>
    </div>
  );
}