import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { useNavigate, Link, useSearch } from "@tanstack/react-router";
import { Lock, Mail, User, LogIn, ArrowLeft, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Mode = "login" | "register" | "forgot" | "otp" | "reset";

const modeConfig = {
  login: { title: "Welcome Back", sub: "Sign in to your account" },
  register: { title: "Create Account", sub: "Join the street-wear collective" },
  forgot: { title: "Forgot Password", sub: "Enter your email to receive an OTP" },
  otp: { title: "Verify Code", sub: "Enter the 6-digit code we sent you" },
  reset: { title: "New Password", sub: "Create a strong new password" },
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

  // ── Login / Register ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(form.email.trim().toLowerCase(), form.password);
        toast.success(isAdminLogin ? "Access Granted" : "Welcome back!", {
          description: isAdminLogin ? "Administrative privileges authorized." : "You're now signed in.",
        });
      } else {
        await register(form.name.trim(), form.email.trim().toLowerCase(), form.password);
        toast.success("Account Created!", {
          description: "You're now part of the collective.",
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Authentication failed");
    }
  };

  // ── Forgot Password ───────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) return toast.error("Please enter your email address");
    setResetLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP Sent!", { description: "Check your email for the 6-digit code." });
      setMode("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send recovery code");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Please enter the full 6-digit code");
    const email = form.email.trim().toLowerCase();
    setResetLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Code Verified!", { description: "Now set your new password." });
      setMode("reset");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid or expired code");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    const email = form.email.trim().toLowerCase();
    setResetLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success("Password Updated!", { description: "You can now sign in with your new password." });
      setMode("login");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const config = isAdminLogin
    ? { title: "Admin Sign In", sub: "Restricted access — authorized personnel only" }
    : modeConfig[mode];

  const isRecoveryMode = mode === "forgot" || mode === "otp" || mode === "reset";
  const loading = isLoading || resetLoading;

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Top bar */}
      <div className="p-4 sm:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Store
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>Aesthetic</p>
                <p className="text-[10px] text-primary font-semibold tracking-widest uppercase">Street Wear</p>
              </div>
            </Link>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode + String(isAdminLogin)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {isAdminLogin && (
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
                    <Shield className="w-3 h-3 text-primary" />
                    <span className="text-xs font-semibold text-primary">Admin Access</span>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>
                  {config.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{config.sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card */}
          <div className="card-elevated rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── LOGIN / REGISTER form ── */}
                {(mode === "login" || mode === "register") && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full h-11 pl-10 pr-4 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full h-11 pl-10 pr-4 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                        {mode === "login" && !isAdminLogin && (
                          <button
                            type="button"
                            onClick={() => setMode("forgot")}
                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                          className="w-full h-11 pl-10 pr-10 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full h-11 flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          {mode === "login"
                            ? isAdminLogin ? "Sign In as Admin" : "Sign In"
                            : "Create Account"}
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {mode === "forgot" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full h-11 pl-10 pr-4 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="btn-primary w-full h-11 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                    </button>
                  </div>
                )}

                {/* ── OTP VERIFICATION ── */}
                {mode === "otp" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-accent rounded-xl text-center">
                      <p className="text-xs text-accent-foreground font-medium">
                        OTP sent to <strong>{form.email}</strong>
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">6-Digit Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full h-14 px-4 bg-secondary border border-border rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="btn-primary w-full h-11 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                    </button>
                  </div>
                )}

                {/* ── NEW PASSWORD ── */}
                {mode === "reset" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-10 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="btn-primary w-full h-11 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer links */}
            <div className="mt-6 pt-5 border-t border-border space-y-3">
              {/* Login ↔ Register toggle */}
              {!isAdminLogin && !isRecoveryMode && (
                <p className="text-center text-sm text-muted-foreground">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); }}
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              )}

              {/* Return to login from recovery modes */}
              {isRecoveryMode && (
                <p className="text-center text-sm text-muted-foreground">
                  <button
                    onClick={() => { setMode("login"); setOtp(""); setNewPassword(""); }}
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </p>
              )}

              {isAdminLogin && (
                <p className="text-center text-xs text-muted-foreground">
                  Privileged session — all activity is logged
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
