import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { Lock, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Your identity is cryptographically secured. No passwords or email required.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description:
      "Authenticate in one click — fast, frictionless, no sign-up forms.",
  },
  {
    icon: Lock,
    title: "You Own Your Data",
    description:
      "Orders and wishlists are tied to your identity, not a third-party account.",
  },
];

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/account" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center">
        <a
          href="/"
          className="font-display font-bold text-xl tracking-tight text-foreground"
        >
          Aesthetic Street Wear
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-muted/20">
        <div className="w-full max-w-xl">
          {/* Hero intro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Passwordless Login
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              Access your cart, wishlist, and order history with Internet
              Identity — a secure, passwordless authentication system.
            </p>
          </motion.div>

          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="card-elevated p-8 sm:p-10 mb-6"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth rounded-xl"
              onClick={login}
              disabled={isLoading}
              data-ocid="login-btn"
            >
              {isLoading ? (
                <span className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/60 border-t-primary-foreground animate-spin" />
                  Connecting to Internet Identity…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Sign in with Internet Identity
                </span>
              )}
            </Button>

            <div className="mt-5 flex items-start gap-3 bg-muted/60 rounded-xl p-4">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Internet Identity is a secure, blockchain-based authentication
                system. No passwords, no email — just a cryptographic key pair
                stored on your device.
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By signing in, you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">
                terms of service
              </span>
              .
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="space-y-3"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 bg-card border border-border rounded-xl px-5 py-4"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {f.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-5 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aesthetic Street Wear. Built with love
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
