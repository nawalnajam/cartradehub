"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  CreditCard, Plus, Trash2, Star, Wallet, Building,
  CheckCircle, XCircle, Loader2
} from "lucide-react";

export default function PaymentOptionsPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    type: "card",
    accountNo: "",
    nameOnAccount: "",
    last4: "",
    brand: "",
    expMonth: "",
    expYear: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/user/payment-methods", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods([data.paymentMethod, ...paymentMethods]);
        setShowAddModal(false);
        setForm({
          type: "card",
          accountNo: "",
          nameOnAccount: "",
          last4: "",
          brand: "",
          expMonth: "",
          expYear: "",
        });
      } else {
        alert(data.message || "Failed to add payment method");
      }
    } catch (error) {
      alert("Error adding payment method");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePaymentMethod = async (id) => {
    if (!confirm("Delete this payment method?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/user/payment-methods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(paymentMethods.filter(pm => pm._id !== id));
      }
    } catch (error) {
      alert("Error deleting payment method");
    }
  };

  const setDefault = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/user/payment-methods/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(paymentMethods.map(pm => ({
          ...pm,
          isDefault: pm._id === id
        })));
      }
    } catch (error) {
      alert("Error setting default");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "card": return <CreditCard size={20} />;
      case "jazzcash": return <Wallet size={20} />;
      case "easypaisa": return <Building size={20} />;
      case "bank": return <Building size={20} />;
      default: return <CreditCard size={20} />;
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case "card": return "Card";
      case "jazzcash": return "JazzCash";
      case "easypaisa": return "EasyPaisa";
      case "bank": return "Bank Account";
      default: return type;
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payment Methods</h1>
            <p className="text-gray-500">Manage your saved payment methods</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus size={18} /> Add Method
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="animate-spin text-sky-500" />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No payment methods saved</p>
            <p className="text-gray-400 text-sm mt-1">Add your first payment method</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((pm) => (
              <div
                key={pm._id}
                className={`bg-white rounded-2xl p-5 border-2 transition-all ${
                  pm.isDefault
                    ? "border-sky-400 shadow-md shadow-sky-100"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      pm.isDefault ? "bg-sky-100 text-sky-600" : "bg-gray-100 text-gray-600"
                    }`}>
                      {getIcon(pm.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{getLabel(pm.type)}</p>
                        {pm.isDefault && (
                          <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <CheckCircle size={12} /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {pm.type === "card"
                          ? `${pm.brand} •••• ${pm.last4}`
                          : `${pm.nameOnAccount} - ${pm.accountNo}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!pm.isDefault && (
                      <button
                        onClick={() => setDefault(pm._id)}
                        className="text-sm text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deletePaymentMethod(pm._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <XCircle size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-600 text-sm font-semibold">Method Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                  >
                    <option value="card">Card</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>

                {form.type === "card" ? (
                  <>
                    <div>
                      <label className="text-gray-600 text-sm font-semibold">Card Brand</label>
                      <input
                        type="text"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        placeholder="e.g., Visa, Mastercard"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-semibold">Last 4 Digits</label>
                      <input
                        type="text"
                        value={form.last4}
                        onChange={(e) => setForm({ ...form, last4: e.target.value })}
                        placeholder="1234"
                        maxLength="4"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-600 text-sm font-semibold">Expiry Month</label>
                        <input
                          type="number"
                          value={form.expMonth}
                          onChange={(e) => setForm({ ...form, expMonth: e.target.value })}
                          placeholder="MM"
                          min="1"
                          max="12"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm font-semibold">Expiry Year</label>
                        <input
                          type="number"
                          value={form.expYear}
                          onChange={(e) => setForm({ ...form, expYear: e.target.value })}
                          placeholder="YYYY"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-gray-600 text-sm font-semibold">Account Number</label>
                      <input
                        type="text"
                        value={form.accountNo}
                        onChange={(e) => setForm({ ...form, accountNo: e.target.value })}
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-semibold">Name on Account</label>
                      <input
                        type="text"
                        value={form.nameOnAccount}
                        onChange={(e) => setForm({ ...form, nameOnAccount: e.target.value })}
                        placeholder="Full name"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={addPaymentMethod}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Add Payment Method"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}