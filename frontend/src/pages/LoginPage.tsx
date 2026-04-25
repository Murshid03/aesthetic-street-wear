import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { useNavigate, Link, useSearch } from "@tanstack/react-router";
import { Lock, Mail, User, LogIn, ArrowLeft, Shield, Loader2, Eye, EyeOff, ChevronRight, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Mode = "login" | "register" | "forgot" | "otp" | "reset";

const modeConfig = {
  login: { title: "WELCOME BACK", sub: "Please enter your credentials to access your account." },
  register: { title: "CREATE ACCOUNT", sub: "Join our community and start shopping." },
  forgot: { title: "FORGOT PASSWORD", sub: "Enter your email to receive a password reset link." },
  otp: { title: "VERIFY EMAIL", sub: "Enter the code sent to your email address." },
  reset: { title: "RESET PASSWORD", sub: "Choose a new password for your account." },
};

export default function LoginPage() {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" }) as any;
  const isAdminLogin = search.admin === "true";

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (isAdminLogin) setMode("login");
  }, [isAdminLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: isAdminLogin || form.email.includes("admin") ? "/admin" : "/account" });
    }
  }, [isAuthenticated, navigate, isAdminLogin, form.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(form.email.trim().toLowerCase(), form.password);
        toast.success(isAdminLogin ? "Admin Login Successful" : "Welcome back!");
      } else {
        await register(form.name.trim(), form.email.trim().toLowerCase(), form.password);
        toast.success("Account created successfully!");
      }
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Authentication failed";
      toast.error(message);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) return toast.error("Email is required");
    setResetLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMode("otp");
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send code");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Invalid OTP");
    const email = form.email.trim().toLowerCase();
    setResetLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setMode("reset");
      toast.success("OTP verified");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) return toast.error("Password too short");
    const email = form.email.trim().toLowerCase();
    setResetLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setMode("login");
      toast.success("Password reset successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const config = isAdminLogin
    ? { title: "ADMIN LOGIN", sub: "Restricted area. Authorized personnel only." }
    : modeConfig[mode];

  const loading = isLoading || resetLoading;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* ── Visual Side ────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 bg-[#0a0a0a] relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#6d28d9_1.5px,transparent_1.5px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[180px] rounded-full opacity-50" />

        <div className="relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Member Login</span>
            <div className="w-12 h-px bg-white/10" />
          </div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-display)" }}>
            AESTHETIC <br /> <span className="text-primary italic">STREET</span> <br /> WEAR
          </h2>
          <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em] max-w-xs mx-auto">Premium architectural streetwear for the modern individual.</p>
        </div>
      </div>

      {/* ── Form Side ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-6 sm:p-20 relative bg-white min-h-screen overflow-x-hidden">
        <div className="flex items-center justify-between mb-12 lg:mb-20">
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-black/30 group-hover:text-black transition-colors">Back</span>
          </Link>

          <div className="text-right">
            <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Version 2.6.0</p>
            <p className="text-[10px] font-black text-black italic">AESTHETIC-COLLECTIVE</p>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="text-center md:text-left"
              >
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="w-8 h-[2px] bg-primary" />
                  <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Secure Login</span>
                </div>
                <h1 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  {config.title}
                </h1>
                <p className="text-black/40 text-[11px] lg:text-sm font-medium leading-relaxed max-w-sm mx-auto md:mx-0" style={{ fontFamily: "var(--font-secondary)" }}>
                  {config.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {mode === "register" && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full h-14 px-6 bg-black/5 rounded-2xl text-base font-bold border-2 border-transparent focus:border-black transition-all outline-none"
                    />
                  </div>
                )}

                {(mode === "login" || mode === "register" || mode === "forgot") && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full h-14 px-6 bg-black/5 rounded-2xl text-base font-bold border-2 border-transparent focus:border-black transition-all outline-none"
                    />
                  </div>
                )}

                {(mode === "login" || mode === "register") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Password</label>
                      {mode === "login" && !isAdminLogin && (
                        <button type="button" onClick={() => setMode("forgot")} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-black transition-colors">Forgot Password?</button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        className="w-full h-14 pl-6 pr-14 bg-black/5 rounded-2xl text-base font-bold border-2 border-transparent focus:border-black transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-all"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "otp" && (
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000 000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-20 px-4 bg-black/5 rounded-2xl text-center text-2xl sm:text-4xl font-black tracking-[0.5em] focus:border-black border-2 border-transparent transition-all outline-none"
                    />
                  </div>
                )}

                {mode === "reset" && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-14 pl-6 pr-14 bg-black/5 rounded-2xl text-base font-bold border-2 border-transparent focus:border-black transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-all"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pt-6">
              {mode === "login" || mode === "register" ? (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-full bg-primary text-white hover:bg-black transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl group overflow-hidden relative"
                >
                  <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${loading ? "-translate-y-16" : ""}`}>
                    {mode === "login" ? "LOGIN" : "SIGN UP"}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${loading ? "translate-y-0" : "translate-y-16"}`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={mode === "forgot" ? handleForgotPassword : mode === "otp" ? handleVerifyOtp : handleResetPassword}
                  disabled={loading}
                  className="w-full h-16 rounded-full bg-black text-white hover:bg-primary transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.3em]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "forgot" ? "SEND OTP" : mode === "otp" ? "VERIFY OTP" : "RESET PASSWORD"}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-black/5 text-center">
            {!isAdminLogin && (mode === "login" || mode === "register") && (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
                {mode === "login" ? "New customer? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-primary hover:text-black transition-colors"
                >
                  {mode === "login" ? "Create Account" : "Login Now"}
                </button>
              </p>
            )}
            {(mode === "otp" || mode === "reset" || mode === "forgot") && (
              <button
                onClick={() => setMode("login")}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 hover:text-black transition-colors"
              >
                Back to Login
              </button>
            )}
            {isAdminLogin && (
              <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">RESTRICTED ADMIN ACCESS</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
