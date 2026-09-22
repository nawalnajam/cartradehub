// /app/signin/page.jsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function SignInForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Normal Signin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signin failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.user));
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      // ✅ Decode Google credential to get user info
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
      };

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          userInfo: userInfo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("admin", JSON.stringify(data.user));
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login Error
  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND - Same as before */}
      <img
        src="/sign.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* CARD */}
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-semibold text-center text-green-400">
          Welcome back!
        </h1>
        <p className="text-sm text-white/70 text-center mt-2">
          Sign in to access Car Trade Hub
        </p>

        {error && (
          <p className="text-sm text-red-400 text-center mt-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* EMAIL */}
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

          {/* PASSWORD */}
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
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-3 text-white/40 text-sm">
          <div className="flex-1 h-px bg-white/20" />
          Or
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* ✅ GOOGLE BUTTON - NOW FUNCTIONAL */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="pill"
            width="100%"
          />
        </div>

        {/* SIGNUP */}
        <p className="text-sm text-center text-white/70 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-400 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ✅ Main export with GoogleOAuthProvider
export default function SignInPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // ✅ If no Client ID, show normal signin page without Google button
  if (!googleClientId) {
    return <SignInForm />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <SignInForm />
    </GoogleOAuthProvider>
  );
}