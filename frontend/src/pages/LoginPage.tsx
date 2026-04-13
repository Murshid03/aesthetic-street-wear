import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, Link, useSearch } from "@tanstack/react-router";
import { Lock, Mail, User, LogIn, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Mode = "login" | "register";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const navigate = useNavigate();
  // We use any because @tanstack/react-router search types can be tricky with lazy loading
  const search = useSearch({ from: '/login' }) as any;
  const isAdminLogin = search.admin === "true";

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isAdminLogin) {
      setMode("login");
    }
  }, [isAdminLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdminLogin || form.email.includes("admin")) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/account" });
      }
    }
  }, [isAuthenticated, navigate, isAdminLogin, form.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success(isAdminLogin ? "Access Granted" : "Identity Verified", {
          description: isAdminLogin ? "Administrative privileges authorized." : "Welcome back to the aesthetic ecosystem."
        });
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Account Authorized", {
          description: "You are now part of the street-wear collective."
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Authentication Failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${isAdminLogin ? 'bg-primary/30' : 'bg-primary/20'} blur-[120px] rounded-full animate-pulse`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-8 left-8 z-10">
        <Link to="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Control Center
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-[2rem] ${isAdminLogin ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'} mb-6 shadow-2xl`}
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.h1
            className="font-display text-4xl lg:text-5xl font-black tracking-tighter italic uppercase text-foreground leading-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isAdminLogin ? "Admin Auth" : (mode === "login" ? "Identity" : "Enlist")} <span className="text-primary not-italic lowercase">.</span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isAdminLogin ? "Root Access Initialized" : (mode === "login" ? "Authorized Access Only" : "Initialize Protocol")}
          </motion.p>
        </div>

        <div className={`bg-card/40 backdrop-blur-3xl border ${isAdminLogin ? 'border-primary/30' : 'border-white/10'} rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === "register" && !isAdminLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Alias</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. USER-01"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full h-14 pl-12 pr-4 bg-muted/20 border border-border/40 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">{isAdminLogin ? 'Admin Identification' : 'Universal ID'}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="email"
                  required
                  placeholder={isAdminLogin ? "admin@aesthetic.com" : "your@system.com"}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-14 pl-12 pr-4 bg-muted/20 border border-border/40 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Secret Key</Label>
                {mode === "login" && !isAdminLogin && (
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Recover</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full h-14 pl-12 pr-4 bg-muted/20 border border-border/40 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-16 text-[10px] font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all group overflow-hidden relative"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {isAdminLogin ? "Verify Authority" : (mode === "login" ? "Verify Identity" : "Authorize Access")}
                </span>
              )}
            </Button>
          </form>

          {!isAdminLogin && (
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 w-full opacity-30">
                <div className="h-[1px] flex-1 bg-border" />
                <span className="text-[9px] font-black uppercase tracking-widest">Protocol</span>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                {mode === "login" ? "Switch to Enrollment" : "Revert to Identity Verification"}
              </button>
            </div>
          )}

          {isAdminLogin && (
            <div className="mt-8 text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60">Privileged Session Request detected</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic">
        Season 03 // Aesthetic Ecosystem
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`block text-xs font-semibold mb-1.5 ${className}`}>{children}</label>
}
