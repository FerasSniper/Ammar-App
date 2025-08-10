"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, X, Send, Phone, MessageCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    username: "",
    password: "",
    mobile: ""
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRequestPassword, setShowRequestPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestSuccess(false);

    try {
      // Validate form
      if (!requestForm.username || !requestForm.password || !requestForm.mobile) {
        alert("Please fill in all fields");
        setRequestLoading(false);
        return;
      }

      // Create WhatsApp message
      const message = `🔔 *New Account Request*

👤 *Username:* ${requestForm.username}
📱 *Mobile:* ${requestForm.mobile}
🔑 *Password:* ${requestForm.password}

⏰ *Request Time:* ${new Date().toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Please review and add this user to the database.`;

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/966561186674?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Show success message
      setRequestSuccess(true);
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSuccess(false);
        setRequestForm({ username: "", password: "", mobile: "" });
      }, 3000);

    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request. Please try again.');
    } finally {
      setRequestLoading(false);
    }
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
        // Reset password visibility on error
        setShowPassword(false);
        return;
      }

            // On success, store user info and redirect
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      setError("Network error");
      setLoading(false);
      // Reset password visibility on error
      setShowPassword(false);
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
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 bg-white/20 placeholder-white/60 text-white rounded-lg border border-transparent focus:border-[#e2ddc0] focus:bg-white/30 outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white/90 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
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
            <button 
              onClick={() => setShowRequestModal(true)}
              className="text-[#e2ddc0] hover:underline font-semibold"
            >
              Request an account
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-2 left-4 text-xs text-white/60">
          © {new Date().getFullYear()} Ammar Nasser Consultant Eng. All rights reserved.
        </div>
      </div>

      {/* Request Account Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowRequestModal(false);
                setShowRequestPassword(false);
                setRequestForm({ username: "", password: "", mobile: "" });
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Account Access</h2>
              <p className="text-gray-600">Fill in your details and we'll send a request to the manager</p>
            </div>

            {requestSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Sent Successfully!</h3>
                <p className="text-gray-600">WhatsApp message has been sent to the manager. You'll be notified once your account is created.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestAccount} className="space-y-4">
                {/* Username */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    name="username"
                    type="text"
                    value={requestForm.username}
                    onChange={handleRequestFormChange}
                    required
                    placeholder="Desired Username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    name="password"
                    type={showRequestPassword ? "text" : "password"}
                    value={requestForm.password}
                    onChange={handleRequestFormChange}
                    required
                    placeholder="Desired Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRequestPassword(!showRequestPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showRequestPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Mobile */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    name="mobile"
                    type="tel"
                    value={requestForm.mobile}
                    onChange={handleRequestFormChange}
                    required
                    placeholder="Mobile Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How it works:</p>
                      <p>1. Fill in your desired credentials</p>
                      <p>2. Click "Send Request" to open WhatsApp</p>
                      <p>3. Manager will review and create your account</p>
                      <p>4. You'll receive login credentials once approved</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: requestLoading ? 1 : 1.02 }}
                  whileTap={{ scale: requestLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={requestLoading}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {requestLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Request via WhatsApp
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
