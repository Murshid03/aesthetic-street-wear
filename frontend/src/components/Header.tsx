import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
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
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const queryClient = useQueryClient();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/", search: { q: searchQuery.trim() } });
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-xs"
      data-ocid="header"
    >
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 mr-2"
            aria-label="Aesthetic Street Wear home"
          >
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-foreground leading-tight text-primary italic uppercase">
              Aesthetic
              <br className="hidden sm:block" />
              <span className="hidden sm:inline lowercase text-foreground not-italic font-black"> street wear</span>
              <span className="sm:hidden"> SW</span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 hidden md:flex max-w-md"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search for styles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-border focus:bg-background"
                data-ocid="search-input"
              />
            </div>
          </form>

          <div className="flex-1 md:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                onClick={() => setUserMenuOpen((v) => !v)}
                data-ocid="user-menu-btn"
                className="relative"
              >
                <User className="w-5 h-5" />
              </Button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-lg shadow-elevated z-50 py-1 animate-fade-in overflow-hidden">
                  {!isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 border-b border-border bg-muted/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Guest Terminal</p>
                      </div>
                      <Link
                        to="/login"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted font-bold transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LogIn className="w-4 h-4 text-primary" />
                        Login
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted font-bold transition-colors group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        Admin Panel
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-border bg-muted/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Authorized User</p>
                        <p className="text-xs font-bold text-foreground truncate max-w-[180px]">
                          {user?.name || user?.email}
                        </p>
                      </div>
                      <Link
                        to="/account"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        Order History
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-primary font-bold"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Control Center
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          queryClient.clear();
                          setUserMenuOpen(false);
                          navigate({ to: "/" });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive font-bold"
                        data-ocid="logout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        Deauthorize
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Wishlist (${wishlistCount} items)`}
              asChild
            >
              <Link
                to="/wishlist"
                className="relative"
                data-ocid="wishlist-btn"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground border-0 animate-fade-in">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Cart (${cartCount} items)`}
              asChild
            >
              <Link to="/cart" className="relative" data-ocid="cart-btn">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground border-0 animate-fade-in">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              data-ocid="mobile-menu-btn"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-1 pb-2"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-primary [&.active]:text-primary [&.active]:font-semibold"
              activeOptions={link.to === "/" ? { exact: true } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search for styles…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </form>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-border bg-card px-4 py-3 animate-fade-in"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center justify-between py-3 text-sm font-medium border-b border-border/50 last:border-0 hover:text-primary transition-colors [&.active]:text-primary"
              activeOptions={link.to === "/" ? { exact: true } : undefined}
              data-ocid={`mobile-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {link.label}
              <ChevronDown className="w-4 h-4 rotate-[-90deg] opacity-40" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
