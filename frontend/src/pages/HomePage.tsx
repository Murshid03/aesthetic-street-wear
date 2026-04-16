import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Heart,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Loader2,
  Zap,
  Package,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Category Config ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Shirts",
    to: "/shirts" as const,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    sub: "Premium cuts & fabrics",
    color: "from-blue-900/60",
  },
  {
    label: "T-Shirts",
    to: "/tshirts" as const,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
    sub: "Everyday essentials",
    color: "from-purple-900/60",
  },
  {
    label: "Pants",
    to: "/pants" as const,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
    sub: "Tailored precision fits",
    color: "from-slate-900/60",
  },
  {
    label: "Accessories",
    to: "/accessories" as const,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    sub: "Finishing touches",
    color: "from-amber-900/60",
  },
];

// ─── Trust Badges ────────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Truck, label: "Free Delivery", desc: "On orders above ₹999" },
  { icon: Shield, label: "100% Authentic", desc: "Quality guaranteed" },
  { icon: Star, label: "Premium Quality", desc: "Handpicked collections" },
  { icon: Zap, label: "Quick Dispatch", desc: "Ships within 24 hours" },
];

// ─── ProductCard Component ────────────────────────────────────────────────────────
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
    <div
      className="card-base card-hover group overflow-hidden flex flex-col"
      data-ocid={`product-card-${pid}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
        <Link to="/product/$id" params={{ id: String(pid) }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500";
            }}
          />
        </Link>

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
            ${wished ? "bg-primary text-primary-foreground scale-110" : "bg-white/95 text-muted-foreground hover:bg-white hover:scale-110"}`}
          onClick={() => wished ? removeFromWishlist(pid) : addToWishlist(product)}
          data-ocid={`wishlist-toggle-${pid}`}
        >
          <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
        </button>

        {/* Badges */}
        {product.isSoldOut ? (
          <Badge className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg">
            Sold Out
          </Badge>
        ) : product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
            Low Stock
          </Badge>
        )}

        {product.isSoldOut && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white/95 text-foreground text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl border border-border/50">
              Out of Collection
            </div>
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {product.isSoldOut ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                api.post(`/products/${pid}/notify-me`)
                  .then(() => toast.success("We'll notify you!", { description: `You'll be alerted when ${product.name} returns.` }))
                  .catch(() => toast.error("Please sign in to get restock alerts"));
              }}
              className="w-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Notify Me
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-primary text-primary-foreground text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
              data-ocid={`quick-add-${pid}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {adding ? "Added!" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2.5">
        <div className="flex-1">
          <Link to="/product/$id" params={{ id: String(pid) }}>
            <h3 className="font-semibold text-sm text-foreground leading-snug hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
            {product.sizes.join(" · ")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-base text-foreground">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {!product.isSoldOut && (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95 shrink-0 sm:hidden"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card-base overflow-hidden">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-3.5 space-y-2.5">
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-1/2" />
        <div className="flex justify-between items-center">
          <div className="skeleton h-5 rounded-lg w-16" />
          <div className="skeleton h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const newArrivals = products.slice(0, 6);

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-foreground text-background overflow-hidden" aria-label="Hero">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[hsl(262,40%,15%)] via-[hsl(270,20%,10%)] to-[hsl(270,20%,8%)]" />
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(hsl(262,83%,58%) 1px, transparent 1px), linear-gradient(90deg, hsl(262,83%,58%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="container mx-auto container-px relative z-10">
          <div className="py-16 sm:py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <motion.div
              className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                New Collection 2026
              </div>

              <h1 className="text-hero text-background mb-6">
                Style That{" "}
                <span className="relative">
                  <span className="gradient-text" style={{ background: "linear-gradient(135deg, hsl(262,83%,70%), hsl(280,70%,75%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Speaks
                  </span>
                </span>
                <br />
                For Itself
              </h1>

              <p className="text-background/65 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                Premium men's streetwear crafted for those who move through the world with purpose. Curated essentials, modern silhouettes — uncompromising quality.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Button
                  asChild
                  className="btn-primary h-12 px-8 text-sm shadow-lg shadow-primary/30"
                  data-ocid="hero-cta-primary"
                >
                  <Link to="/shirts">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-12 px-8 text-sm border-white/20 text-background hover:bg-white/10 hover:border-white/30"
                  data-ocid="hero-cta-secondary"
                >
                  <Link to="/accessories">View Accessories</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 justify-center lg:justify-start">
                {[
                  { val: "500+", label: "Products" },
                  { val: "10K+", label: "Customers" },
                  { val: "4.9★", label: "Rating" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-background" style={{ fontFamily: "Syne, sans-serif" }}>{s.val}</p>
                    <p className="text-xs text-background/50 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end w-full max-w-sm lg:max-w-none"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl border border-primary/20" />
                <div className="w-56 h-[320px] sm:w-72 sm:h-[420px] lg:w-80 lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
                    alt="Aesthetic Street Wear"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800";
                    }}
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 glass rounded-2xl px-4 py-3 shadow-xl border border-white/40">
                  <p className="text-[10px] text-muted-foreground font-semibold">New Drop</p>
                  <p className="font-bold text-sm text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>Summer 2026</p>
                </div>
                {/* Second floating card */}
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-5 bg-primary text-primary-foreground rounded-2xl px-3.5 py-2.5 shadow-lg">
                  <p className="text-[10px] font-semibold opacity-80">Starting from</p>
                  <p className="font-bold text-sm">₹599 only</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto container-px py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3 py-3.5 px-4 justify-center">
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <badge.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-foreground leading-tight">{badge.label}</p>
                  <p className="text-[11px] text-muted-foreground">{badge.desc}</p>
                </div>
                <div className="sm:hidden">
                  <p className="text-xs font-bold text-foreground">{badge.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ───────────────────────────────────────────────── */}
      <section className="section-py bg-background" aria-label="New Arrivals">
        <div className="container mx-auto container-px">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <p className="text-label text-primary mb-2">Just Dropped</p>
              <h2 className="text-heading">New Arrivals</h2>
            </div>
            <Link
              to="/shirts"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors self-start sm:self-auto"
              data-ocid="new-arrivals-view-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/20">
              <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────────── */}
      <section className="section-py bg-secondary" aria-label="Categories">
        <div className="container mx-auto container-px">
          <div className="text-center mb-10">
            <p className="text-label text-primary mb-2">Explore Collections</p>
            <h2 className="text-heading">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={cat.to}
                  className="group relative rounded-2xl overflow-hidden block aspect-[3/4] bg-muted shadow-sm hover:shadow-lg transition-all duration-300"
                  data-ocid={`category-${cat.label.toLowerCase().replace(/\s+/, "-")}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600";
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-transparent to-transparent`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="font-bold text-white text-base sm:text-lg leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>{cat.label}</p>
                    <p className="text-[11px] text-white/65 mt-0.5 hidden sm:block">{cat.sub}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      Shop Now <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Products ───────────────────────────────────────────────── */}
      <section className="section-py bg-background" aria-label="All Products">
        <div className="container mx-auto container-px">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <p className="text-label text-primary mb-2">Full Range</p>
              <h2 className="text-heading">All Products</h2>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-1">
            {[
              { label: "Shirts", to: "/shirts" as const },
              { label: "T-Shirts", to: "/tshirts" as const },
              { label: "Pants", to: "/pants" as const },
              { label: "Accessories", to: "/accessories" as const },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold border border-border text-muted-foreground bg-white hover:border-primary hover:text-primary hover:bg-accent transition-all duration-200"
                data-ocid={`filter-${cat.label.toLowerCase()}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/shirts"
              className="inline-flex items-center gap-2 px-8 h-11 border border-primary text-primary font-semibold text-sm rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              data-ocid="view-all-products-cta"
            >
              Browse Full Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Story  ────────────────────────────────────────────── */}
      <section className="section-py bg-secondary" aria-label="About Aesthetic Street Wear">
        <div className="container mx-auto container-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative order-last lg:order-first"
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-lg bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                  alt="Aesthetic Street Wear brand story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800";
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 gradient-primary rounded-2xl p-4 shadow-lg hidden sm:block text-white">
                <p className="font-bold text-2xl" style={{ fontFamily: "Syne, sans-serif" }}>2026</p>
                <p className="text-xs opacity-80">Collection</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            >
              <p className="text-label text-primary mb-3">Our Story</p>
              <h2 className="text-heading mb-5">
                Born on the Streets,<br />Built for Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                <p>
                  Aesthetic Street Wear was founded with a single vision: to bring premium quality men's fashion to those who demand both style and substance.
                </p>
                <p>
                  Every piece is handpicked for its craftsmanship, fit, and versatility — from sharp Oxford shirts to street-ready cargo pants.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shirts"
                  className="btn-primary h-11 px-7 flex items-center justify-center gap-2"
                  data-ocid="about-shop-cta"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/accessories"
                  className="btn-secondary h-11 px-7 flex items-center justify-center gap-2"
                  data-ocid="about-accessories-cta"
                >
                  View Accessories
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="section-py bg-background" aria-label="Call to Action">
        <div className="container mx-auto container-px">
          <div className="relative rounded-3xl overflow-hidden gradient-primary text-white p-8 sm:p-12 text-center">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="relative z-10">
              <p className="text-label text-white/70 mb-3">Limited Time</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                Your Style, Your Rules
              </h2>
              <p className="text-white/75 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Shop the latest drops and get free delivery over ₹999. New arrivals every week — don't miss out.
              </p>
              <Link
                to="/shirts"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
                data-ocid="cta-banner-btn"
              >
                Shop All Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
