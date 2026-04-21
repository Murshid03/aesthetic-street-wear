import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, ShoppingCart, Zap, Package, Star, Heart, Shield, Truck, RefreshCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types";

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Payment", desc: "100% Secure Transaction" },
  { icon: Truck, label: "Fast Delivery", desc: "Express 48h Shipping" },
  { icon: RefreshCcw, label: "Easy Returns", desc: "30-Day Money Back" },
  { icon: Star, label: "Premium Quality", desc: "Certified Streetwear" },
];

const CATEGORIES = [
  { label: "Premium Shirts", to: "/shirts", image: "https://images.unsplash.com/photo-1621072124310-4497e2cc4286?w=800", sub: "Architectural Cuts" },
  { label: "Graphic Tees", to: "/tshirts", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", sub: "Urban Expression" },
  { label: "Utility Pants", to: "/pants", image: "https://images.unsplash.com/photo-1552912817-048704ce32b3?w=800", sub: "Tactical Design" },
  { label: "Accessories", to: "/accessories", image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800", sub: "Final Fragments" },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const pid = product._id || (product as any).id;
  const wished = isInWishlist(pid);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, product.sizes[0] ?? "One Size");
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <div className="group flex flex-col overflow-hidden bg-white transition-all duration-300">
      <div className="relative aspect-[3/4.2] overflow-hidden bg-muted rounded-xl">
        <Link to="/product/$id" params={{ id: String(pid) }} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <button
          onClick={() => wished ? removeFromWishlist(pid) : addToWishlist(product)}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
            ${wished ? "bg-primary text-white" : "bg-white/80 backdrop-blur-sm text-black hover:bg-white"}`}
        >
          <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
        </button>
        <div className="absolute inset-x-3 bottom-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={adding || product.isSoldOut}
            className="w-full bg-white/90 backdrop-blur-md text-black hover:bg-black hover:text-white rounded-lg h-10 lg:h-12 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {adding ? <Package className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{adding ? "Added" : product.isSoldOut ? "Sold Out" : "Add to Cart"}</span>
            <span className="sm:hidden">{adding ? "Added" : "+"}</span>
          </Button>
        </div>
      </div>
      <div className="py-4 space-y-1">
        <Link to="/product/$id" params={{ id: String(pid) }}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-black hover:text-primary transition-colors line-clamp-1" style={{ fontFamily: "var(--font-accent)" }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-black/40 tracking-tighter">₹{product.price.toLocaleString("en-IN")}</span>
          <div className="flex items-center gap-2">
            {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-primary text-white rounded-full">New</span>
            )}
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-black/40">Ltd . Ed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-4">
      <div className="skeleton aspect-[3/4] rounded-2xl" />
      <div className="space-y-2">
        <div className="skeleton h-4 rounded-lg w-2/3" />
        <div className="skeleton h-3 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const sortedProducts = [...products].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const newArrivals = sortedProducts.slice(0, 12);

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-16 lg:pt-24 pb-12 lg:pb-20 overflow-hidden bg-white min-h-[70vh] lg:min-h-[80vh] flex items-center" aria-label="Hero">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Visual Side - Show first on mobile for engagement */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="w-full lg:w-[45%] order-1 lg:order-2"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-muted max-w-[280px] sm:max-w-md lg:max-w-[380px] xl:max-w-md mx-auto lg:ml-auto lg:mr-0">
                <img
                  src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1200&q=90"
                  alt="Aesthetic street wear focus"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 lg:pr-10"
            >
              <div className="flex items-center gap-4 mb-4 lg:mb-6">
                <div className="w-8 h-[2px] bg-primary" />
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Vol . 01 // DROP 26</span>
                <div className="hidden lg:block w-8 h-[2px] bg-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.5rem,4vw,3.5rem)] xl:text-6xl font-black uppercase tracking-tighter leading-[1.1] lg:leading-[1] mb-6 lg:mb-8" style={{ fontFamily: "var(--font-display)" }}>
                AESTHETIC <br />
                <span className="text-primary italic">STREET</span>WEAR
              </h1>
              <p className="max-w-md text-black/40 text-sm md:text-lg font-medium leading-relaxed mb-8 lg:mb-10 lg:border-l lg:border-black/10 lg:pl-6" style={{ fontFamily: "var(--font-secondary)" }}>
                Architectural silhouettes fused with raw urban energy. Defining the new standard of premium apparel.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="h-14 w-full sm:w-auto px-10 rounded-full bg-black text-white hover:bg-primary transition-all duration-500 font-bold text-[10px] lg:text-[11px] uppercase tracking-widest"
                >
                  <Link to="/shirts">Explore Collection</Link>
                </Button>
                <Link to="/wishlist" className="flex items-center gap-3 group px-4 py-2">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-black/5 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-black/30 group-hover:text-black">Wishlist</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-20 border-y border-black/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 lg:gap-4 group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/5 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                  <badge.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <div>
                  <h3 className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-black mb-1">{badge.label}</h3>
                  <p className="hidden sm:block text-[8px] lg:text-[9px] text-black/30 font-bold uppercase tracking-wider">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Releases ─────────────────────────────────────────────── */}
      <section className="py-20 lg:py-32 bg-white" aria-label="New Releases">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-6 lg:gap-10">
            <div className="space-y-3 lg:space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="w-8 h-[2px] bg-primary" />
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-primary">Catalogue 26</p>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                NEW ARRIVALS
              </h2>
            </div>
            <Link to="/new-arrivals" className="text-[10px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 border-primary hover:text-primary transition-colors">
              Explore All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-x-8 lg:gap-y-16">
              {newArrivals.map((product) => (
                <ProductCard key={product._id || (product as any).id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-32 bg-white border-t border-black/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 lg:mb-20 gap-6 lg:gap-10">
            <div className="space-y-3 lg:space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="w-8 h-[2px] bg-primary" />
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] text-primary">Segments</p>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                SHOP BY CATEGORY
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to={cat.to} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-black">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 p-4 lg:p-8 flex flex-col justify-end">
                  <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-1 lg:mb-2">0{i + 1}</p>
                  <h3 className="text-lg lg:text-2xl font-black italic uppercase tracking-tighter text-white leading-none mb-2 lg:mb-4 group-hover:translate-x-2 transition-transform duration-500">{cat.label}</h3>
                  <div className="hidden lg:block w-0 h-px bg-white/40 group-hover:w-full transition-all duration-700" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────────── */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative group max-w-md mx-auto lg:mx-0">
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=90"
                  alt="Story"
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 w-28 h-28 lg:w-44 lg:h-44 bg-black rounded-full flex flex-col items-center justify-center text-white border-[6px] lg:border-[10px] border-white shadow-2xl transition-transform duration-700 group-hover:rotate-12">
                <p className="text-xl lg:text-3xl font-black italic tracking-tighter">ESTD</p>
                <p className="text-[8px] lg:text-[10px] font-black tracking-[0.4em] text-primary">2026</p>
              </div>
            </div>

            <div className="space-y-8 lg:space-y-10 text-center lg:text-left">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <span className="w-8 h-[2px] bg-primary" />
                  <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Philosophy</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: "var(--font-display)" }}>
                  BORN FROM <br /> <span className="text-primary italic">SUBSTANCE</span>
                </h2>
              </div>
              <div className="space-y-6 lg:space-y-8 text-black/40 font-medium text-sm lg:text-lg leading-relaxed lg:border-l-2 lg:border-black/5 lg:pl-10" style={{ fontFamily: "var(--font-secondary)" }}>
                <p>Establishing a vanguard in street culture through the meticulous fusion of high-fashion silhouettes and raw urban architecture.</p>
                <p className="text-black font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs italic">"Every fragment is a signature of modern excellence."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA (Compact Focused) ────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-[#0a0a0a] text-white p-8 lg:p-20 text-center shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6d28d9_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-40" />

            <div className="relative z-10 space-y-6 lg:space-y-8">
              <div className="flex items-center justify-center gap-3">
                <span className="w-8 h-[1px] bg-white/20" />
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.4em] text-primary">Member Gateway</span>
                <span className="w-8 h-[1px] bg-white/20" />
              </div>

              <h2 className="text-3xl lg:text-5xl font-black tracking-tight uppercase leading-none" style={{ fontFamily: "var(--font-display)" }}>
                ELEVATE YOUR <br /> <span className="text-white/20">EXPERIENCE</span>
              </h2>

              <p className="max-w-md mx-auto text-white/40 text-[10px] lg:text-sm font-medium leading-relaxed" style={{ fontFamily: "var(--font-secondary)" }}>
                Create an account for early drop access and personalized curation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-5 pt-4">
                <Button
                  asChild
                  className="h-12 lg:h-14 w-full sm:w-auto px-10 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 font-bold text-[9px] lg:text-[10px] uppercase tracking-widest shadow-xl"
                >
                  <Link to="/login">Register Now</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 lg:h-14 w-full sm:w-auto px-10 rounded-full border border-white/10 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-500 font-bold text-[9px] lg:text-[10px] uppercase tracking-widest"
                >
                  <Link to="/shirts">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
