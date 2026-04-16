import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  X,
  Shield,
  LogIn,
  Sparkles,
  Bell,
} from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "New Arrivals", to: "/" },
  { label: "Shirts", to: "/shirts" },
  { label: "T-Shirts", to: "/tshirts" },
  { label: "Pants", to: "/pants" },
  { label: "Accessories", to: "/accessories" },
];

export function Header() {
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/", search: { q: searchQuery.trim() } });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    setUserMenuOpen(false);
    navigate({ to: "/" });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-border"
          : "bg-white border-b border-border"
          }`}
        data-ocid="header"
      >
        {/* Announcement bar */}
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs font-medium tracking-wide">
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" />
            Free shipping on orders above ₹999 · New drops every week
            <Sparkles className="w-3 h-3" />
          </span>
        </div>

        <div className="container mx-auto container-px">
          <div className="flex items-center h-16 gap-3">
            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center gap-2 mr-2 group" aria-label="Aesthetic Street Wear home">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="hidden sm:block leading-none">
                <span className="block text-sm font-bold text-foreground tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                  Aesthetic
                </span>
                <span className="block text-[10px] font-semibold text-primary tracking-widest uppercase">
                  Street Wear
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 ml-4" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3.5 py-2 text-sm font-medium rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground [&.active]:text-primary [&.active]:bg-accent [&.active]:font-semibold"
                  activeOptions={link.to === "/" ? { exact: true } : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex-1 lg:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="btn-ghost w-9 h-9 flex items-center justify-center rounded-xl p-0"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Notifications */}
              {isAuthenticated && <NotificationCenter />}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="btn-ghost w-9 h-9 flex items-center justify-center rounded-xl p-0 relative"
                aria-label={`Wishlist (${wishlistCount} items)`}
                data-ocid="wishlist-btn"
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="btn-ghost w-9 h-9 flex items-center justify-center rounded-xl p-0 relative"
                aria-label={`Cart (${cartCount} items)`}
                data-ocid="cart-btn"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  data-ocid="user-menu-btn"
                  className={`btn-ghost w-9 h-9 flex items-center justify-center rounded-xl p-0 ${isAuthenticated ? "text-primary bg-accent" : ""}`}
                >
                  <User className="w-4.5 h-4.5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 card-elevated rounded-2xl z-50 py-2 animate-scale-in overflow-hidden">
                    {!isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-xs font-semibold text-muted-foreground">Welcome, Guest</p>
                          <p className="text-sm font-bold text-foreground mt-0.5">Sign in to continue</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                          <Link
                            to="/login"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl hover:bg-secondary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LogIn className="w-4 h-4 text-primary" />
                            Sign In
                          </Link>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-border bg-secondary/50">
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider">My Account</p>
                          <p className="text-sm font-bold text-foreground truncate mt-0.5">{user?.name || user?.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                          <Link
                            to="/account"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            My Orders
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary transition-colors text-primary"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <div className="pt-1 border-t border-border mt-1">
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                              data-ocid="logout-btn"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="btn-ghost w-9 h-9 flex items-center justify-center rounded-xl p-0 lg:hidden ml-1"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((v) => !v)}
                data-ocid="mobile-menu-btn"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Nav Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Aesthetic</p>
              <p className="text-[10px] text-primary font-semibold tracking-widest uppercase">Street Wear</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg p-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center py-3 px-4 text-sm font-semibold rounded-xl text-muted-foreground transition-all hover:bg-secondary hover:text-foreground [&.active]:bg-accent [&.active]:text-primary"
              activeOptions={link.to === "/" ? { exact: true } : undefined}
              onClick={() => setMobileOpen(false)}
              data-ocid={`mobile-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="p-4 border-t border-border space-y-2">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="btn-primary w-full flex items-center justify-center gap-2 h-11"
              onClick={() => setMobileOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          ) : (
            <div className="space-y-2">
              <div className="px-2 py-2">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              </div>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="btn-ghost w-full flex items-center justify-center gap-2 h-10 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-full max-w-xl card-elevated rounded-2xl p-4 animate-scale-in">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search for shirts, pants, accessories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
                data-ocid="search-input"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg p-0"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
