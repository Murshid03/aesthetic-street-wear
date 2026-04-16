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
import { toast } from "sonner";

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
      <section className="relative min-h-[80vh] flex items-center bg-[#0a0a0c] text-white overflow-hidden py-16 lg:py-0" aria-label="Hero">
        {/* Background Layering */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(124,58,237,0.12),_transparent_40%),_radial-gradient(circle_at_80%_70%,_rgba(139,92,246,0.08),_transparent_40%)]" />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Scaled down Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.015] select-none uppercase tracking-tighter whitespace-nowrap leading-none">
            Aesthetic
          </div>
        </div>

        <div className="container mx-auto container-px relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <motion.div
              className="flex-1 text-center lg:text-left z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">New Season Drops</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] mb-6 uppercase italic">
                Defined by <br />
                <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.6)" }}>Aesthetics</span>
              </h1>

              <div className="max-w-lg mx-auto lg:mx-0">
                <p className="text-white/50 text-sm sm:text-base font-medium leading-relaxed mb-8">
                  Discover curated silhouettes designed for the modern pioneer. We bridge the gap between street culture and premium luxury.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button
                    asChild
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]"
                  >
                    <Link to="/shirts">
                      Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-12 px-7 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-sm"
                  >
                    <Link to="/accessories">Lookbook</Link>
                  </Button>
                </div>

                <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                  <div className="flex -space-x-2.5">
                    {[12, 13, 14, 15].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0c] bg-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0c] bg-secondary flex items-center justify-center text-[9px] font-bold text-foreground">
                      +2k
                    </div>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div>
                    <div className="flex gap-0.5 text-primary">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                    </div>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-tighter mt-0.5">Verified Quality</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Collage - More Compact */}
            <motion.div
              className="flex-1 relative w-full h-[450px] sm:h-[550px] flex items-center justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              <div className="relative w-full aspect-square max-w-[420px] lg:max-w-none lg:w-[105%] h-full">
                {/* Main Large Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80"
                    alt="Streetwear Signature"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Secondary Image */}
                <motion.div
                  className="absolute top-[5%] right-[5%] w-[40%] aspect-square rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-[#0a0a0c]"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1539106602058-03836727bc36?w=500&q=80"
                    alt="Detail"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Third Image */}
                <motion.div
                  className="absolute bottom-[5%] left-[5%] w-[35%] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-[#0a0a0c]"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80"
                    alt="Style"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Accents */}
                <div className="absolute top-1/4 -left-5 w-24 h-24 border border-primary/10 rounded-full animate-pulse" />
                <div className="absolute bottom-5 right-5 glass rounded-xl px-4 py-2 border border-white/10 z-30 hidden sm:block">
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Est. 2026</p>
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
