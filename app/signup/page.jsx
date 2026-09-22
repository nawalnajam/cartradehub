"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

  
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess("Account created successfully. Please sign in.");
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

   
      <img
        src="/sign.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 " />

      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-2xl p-8 text-white"
      >

        <h1 className="text-3xl font-semibold text-center text-green-400">
          Create account
        </h1>
        <p className="text-sm text-white/70 text-center mt-2">
          Join <span className="font-medium">Car Trade Hub</span> today
        </p>

        {error && (
          <p className="text-sm text-red-400 text-center mt-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-400 text-center mt-4">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

        
          <div>
            <label className="text-sm text-white/80">Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

         
          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/60"
              >
                👁
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold
              bg-white text-black hover:bg-green-500 hover:text-white
              transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

     
        <div className="my-6 flex items-center gap-3 text-white/40 text-sm">
          <div className="flex-1 h-px bg-white/20" />
          Or
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <button
          className="w-full py-3 rounded-xl border border-white/30
            hover:bg-white/10 transition flex items-center justify-center gap-2"
        >
          <img src="/images.png" className="w-5 h-5" />
          Sign up with Google
        </button>

        <p className="text-sm text-center text-white/70 mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-green-400 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
