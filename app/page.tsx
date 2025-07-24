"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: credentials.username,
          password: credentials.password,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || "Login failed");
        setLoading(false);
        return;
      }

            // On success, store user info and redirect
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <div className="relative h-screen w-full flex items-center justify-center bg-[url('/eightimage.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 mx-4"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <a href="https://ano.sa/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/Logo12.png"
                alt="Ammar Nasser Logo"
                width={96} height={96}
                className="rounded-full border-2 border-white/30 shadow-md hover:scale-110 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-semibold text-white mb-4 tracking-wide">
            ANB Management System
          </h2>

          {/* Error Message */}
          {error && (
            <p className="text-center text-red-400 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={20} />
              <input
                name="username"
                id="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-white/20 placeholder-white/60 text-white rounded-lg border border-transparent focus:border-[#e2ddc0] focus:bg-white/30 outline-none transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={20} />
              <input
                name="password"
                id="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-white/20 placeholder-white/60 text-white rounded-lg border border-transparent focus:border-[#e2ddc0] focus:bg-white/30 outline-none transition-all duration-300"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm text-white/70">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/50 bg-white/20 text-[#e2ddc0] focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#656e62] to-[#5a6359] hover:from-[#5a6359] hover:to-[#4f584e] text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Login"}
            </motion.button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{" "}
            <a href="#" className="text-[#e2ddc0] hover:underline font-semibold">
              Request an account
            </a>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-2 left-4 text-xs text-white/60">
          © {new Date().getFullYear()} Ammar Nasser Consultant Eng. All rights reserved.
        </div>
      </div>
    </main>
  );
}
