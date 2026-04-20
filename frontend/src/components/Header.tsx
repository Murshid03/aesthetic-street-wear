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
  Activity,
  HardDrive,
  ShieldCheck,
  Fingerprint,
  Box,
  LayoutDashboard,
  Power
} from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Shirts", to: "/shirts" },
  { label: "T-Shirts", to: "/tshirts" },
  { label: "Accessories", to: "/accessories" },
];

export function Header() {
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
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
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setAdminMenuOpen(false);
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
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-1"
          : "bg-white border-b border-transparent py-2 lg:py-4"
          }`}
        data-ocid="header"
      >
        {!scrolled && (
          <div className="bg-black text-[9px] lg:text-[10px] text-white/70 text-center py-1 px-4 font-bold tracking-[0.2em] uppercase transition-all duration-500 mb-2 lg:mb-4">
            <span>Standard delivery over ₹999 — Standard delivery over ₹999</span>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-2 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center gap-2 lg:gap-3 group mr-auto" aria-label="Aesthetic Street Wear home">
              <div className="relative">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:rotate-[360deg]">
                  <span className="text-white font-black text-sm lg:text-xl italic">A</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 bg-primary rounded-full border-2 border-white shadow-lg" />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="block text-xs lg:text-base font-black text-black tracking-tighter uppercase italic" style={{ fontFamily: "var(--font-display)" }}>
                  Aesthetic
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 lg:mt-1">
                  <div className="w-4 lg:w-5 h-[1.5px] bg-primary rounded-full" />
                  <span className="block text-[7px] lg:text-[8px] font-black text-black/30 tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-accent)" }}>
                    Fragments
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center gap-2 mx-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group/link text-black/40 hover:text-black"
                  style={{ fontFamily: "var(--font-accent)" }}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Actions Grouped in Right Corner */}
            <div className="flex items-center gap-0.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-black" />
              </button>

              <NotificationCenter />

              <Link
                to="/wishlist"
                className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                aria-label={`Wishlist: ${wishlistCount} items`}
              >
                <Heart className="w-4 h-4 text-black" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative flex w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                aria-label={`Cart: ${cartCount} items`}
              >
                <ShoppingCart className="w-4 h-4 text-black" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative flex items-center">
                {isAdmin && (
                  <div className="relative" ref={adminMenuRef}>
                    <button
                      type="button"
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                      aria-expanded={adminMenuOpen}
                      aria-haspopup="true"
                    >
                      <Shield className="w-4 h-4 text-black" />
                    </button>

                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-black/5 shadow-2xl py-1.5 z-[60] animate-fade-up">
                        <div className="px-4 py-2 border-b border-black/5">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Admin . Terminal</p>
                        </div>
                        <div className="p-1 space-y-0.5">
                          {[
                            { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
                            { label: "Inventory", to: "/admin/products", icon: Box },
                            { label: "Manifests", to: "/admin/orders", icon: Activity },
                          ].map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-all group"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              <item.icon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="px-1 pt-1 mt-1 border-t border-black/5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Power className="w-3.5 h-3.5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {isAuthenticated && (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full hover:bg-black/5 transition-all group"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <User className="w-4 h-4 text-black group-hover:text-primary transition-colors" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-black/5 shadow-2xl py-1.5 z-[60] animate-fade-up">
                        <div className="px-4 py-2 border-b border-black/5">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-black/30 mb-0.5">Signature</p>
                          <p className="text-xs font-black text-black truncate uppercase tracking-tighter">{user?.name}</p>
                        </div>
                        <div className="p-1 space-y-0.5">
                          <Link
                            to="/account"
                            className="flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-all group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                            Profile
                          </Link>
                        </div>
                        <div className="px-1 pt-1 mt-1 border-t border-black/5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-primary transition-all duration-300 shadow-lg shadow-black/10"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Enhanced */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl flex flex-col items-stretch animate-drawer-in overflow-y-auto no-scrollbar">
            <div className="p-6 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white z-10">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-sm italic">A</span>
                </div>
                <span className="text-base font-black uppercase italic tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>Aesthetic</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-8 py-10 overflow-x-hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 ml-1">Archive Navigation</p>
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link, idx) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-end gap-3 break-words"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="text-[9px] font-black text-black/10 group-hover:text-primary transition-colors leading-none mb-1.5 shrink-0">0{idx + 1}</span>
                    <span
                      className="text-2xl sm:text-3xl font-black uppercase tracking-normal text-black group-hover:text-primary group-hover:italic transition-all duration-300 break-words"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-16 pt-10 border-t border-black/5">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mb-6 ml-1">User Command</p>
                <div className="grid gap-3">
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between h-14 px-6 bg-black/5 rounded-2xl hover:bg-black hover:text-white transition-all group"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex items-center gap-4">
                      <Heart className="w-4 h-4 text-black/40 group-hover:text-white transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-widest">My Wishlist</span>
                    </div>
                    {wishlistCount > 0 && <span className="text-[10px] font-black px-2 py-0.5 bg-black text-white group-hover:bg-white group-hover:text-black rounded-full">{wishlistCount}</span>}
                  </Link>
                  <Link
                    to="/account"
                    className="flex items-center justify-between h-14 px-6 bg-black/5 rounded-2xl hover:bg-black hover:text-white transition-all group"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex items-center gap-4">
                      <User className="w-4 h-4 text-black/40 group-hover:text-white transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-widest">My Profile</span>
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center justify-between h-14 px-6 bg-primary text-white rounded-2xl hover:bg-black transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <Shield className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Admin Dashboard</span>
                      </div>
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center justify-between h-14 px-6 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all group mt-2"
                    >
                      <div className="flex items-center gap-4">
                        <LogOut className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Protocol Logout</span>
                      </div>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center justify-between h-14 px-6 bg-black text-white rounded-2xl hover:bg-primary transition-all group mt-2 shadow-xl shadow-black/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <LogIn className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Member Login</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-black/2 space-y-4">
              <div className="flex items-center gap-6 justify-center opacity-30">
                <Box className="w-4 h-4" />
                <Settings className="w-4 h-4" />
                <HardDrive className="w-4 h-4" />
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-center text-black/20">ESTD // 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-full max-w-xl bg-white rounded-[3rem] p-8 shadow-2xl animate-scale-in border border-black/5">
            <form onSubmit={handleSearch} className="flex items-center gap-6">
              <Search className="w-6 h-6 text-primary shrink-0" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search signatures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl font-black text-black placeholder:text-black/10 outline-none"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
