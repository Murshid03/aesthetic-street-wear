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
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Category Config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Shirts",
    to: "/shirts" as const,
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    sub: "Premium cuts & fabrics",
    category: "Shirts",
  },
  {
    label: "T-Shirts",
    to: "/tshirts" as const,
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    sub: "Everyday essentials",
    category: "TShirts",
  },
  {
    label: "Pants",
    to: "/pants" as const,
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    sub: "Tailored precision fits",
    category: "Pants",
  },
  {
    label: "Accessories",
    to: "/accessories" as const,
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    sub: "Finishing touches",
    category: "Accessories",
  },
];

// ─── Trust Badges ──────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Truck, label: "Fast Delivery", desc: "Delivered to your door" },
  { icon: Shield, label: "100% Authentic", desc: "Quality guaranteed" },
  { icon: Star, label: "Premium Quality", desc: "Handpicked collections" },
];

// ─── ProductCard Component ─────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const pid = product._id || (product as any).id;
  const wished = isInWishlist(pid);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, product.sizes[0] ?? "One Size");
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div
      className="card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5"
      data-ocid={`product-card-${pid}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Link to="/product/$id" params={{ id: String(pid) }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm hover:scale-110"
          onClick={() =>
            wished ? removeFromWishlist(pid) : addToWishlist(product)
          }
          data-ocid={`wishlist-toggle-${pid}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
          />
        </button>

        {/* Badges */}
        {product.stockQuantity <= 5 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-semibold">
            Low Stock
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <Link to="/product/$id" params={{ id: String(pid) }}>
            <h3 className="font-semibold text-sm text-foreground leading-snug hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {product.sizes.join(" · ")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-lg text-foreground">
            ₹{product.price}
          </span>
          <Button
            size="sm"
            className="btn-primary text-xs h-8 px-3 shrink-0"
            onClick={handleAddToCart}
            disabled={adding}
            data-ocid={`add-to-cart-${pid}`}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            {adding ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
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
      {/* ── Announcement Banner ─────────────────────────────────── */}
      <div
        className="bg-primary text-primary-foreground text-center py-2.5 px-4 text-xs sm:text-sm font-medium tracking-wide"
        data-ocid="announcement-banner"
      >
        <span>✦ New Collection Available — Shop the latest drops now</span>
        <Link
          to="/shirts"
          className="inline-flex items-center gap-1 ml-3 font-bold underline underline-offset-2 hover:no-underline"
        >
          Shop Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-foreground text-background"
        aria-label="Hero"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/15 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text */}
            <motion.div
              className="flex-1 text-center lg:text-left max-w-xl"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge className="mb-5 bg-primary/20 text-primary border-primary/30 font-semibold tracking-widest uppercase text-[11px] px-4 py-1">
                New Collection 2026
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.08] mb-5">
                Aesthetic
                <br />
                <span className="text-primary">Street Wear</span>
              </h1>
              <p className="text-base sm:text-lg opacity-75 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
                Premium mens wear for those who move through the world with
                purpose. Curated essentials, modern silhouettes, uncompromising
                quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  asChild
                  className="btn-primary text-base h-12 px-8 shadow-lg hover:shadow-primary/30"
                  data-ocid="hero-cta-primary"
                >
                  <Link to="/shirts">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-12 px-8 border-background/25 text-background hover:bg-background/10 hover:border-background/40"
                  data-ocid="hero-cta-secondary"
                >
                  <Link to="/accessories">View Accessories</Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-background">
                    500+
                  </p>
                  <p className="text-xs text-background/60 mt-0.5">Products</p>
                </div>
                <div className="w-px h-10 bg-background/20" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-background">
                    10K+
                  </p>
                  <p className="text-xs text-background/60 mt-0.5">
                    Happy Customers
                  </p>
                </div>
                <div className="w-px h-10 bg-background/20" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-background">
                    4.9★
                  </p>
                  <p className="text-xs text-background/60 mt-0.5">Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-3xl border border-primary/20 pointer-events-none" />
                <div className="w-64 h-[360px] sm:w-80 sm:h-[440px] lg:w-[380px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
                    alt="Aesthetic Street Wear — premium mens fashion"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800";
                    }}
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-6 bg-card text-card-foreground rounded-xl px-4 py-3 shadow-lg border border-border">
                  <p className="text-xs text-muted-foreground">New Drop</p>
                  <p className="font-display font-bold text-sm">Summer 2026</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ────────────────────────────────────────── */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 py-4 sm:py-3 px-4 sm:px-6 justify-center sm:justify-start"
              >
                <badge.icon className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {badge.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ─────────────────────────────────────────── */}
      <section
        className="py-14 lg:py-20 bg-background"
        aria-label="New Arrivals"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <p className="text-label text-primary mb-1">Just Dropped</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shirts"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 self-start sm:self-auto"
              data-ocid="new-arrivals-view-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading collection…</p>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/20">
              <p className="text-muted-foreground">No products found. Start by adding some in the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-muted/30" aria-label="Categories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-label text-primary mb-1">Browse by Category</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Shop the Range
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={cat.to}
                  className="group relative rounded-2xl overflow-hidden block aspect-[3/4] bg-muted shadow-sm hover:shadow-md transition-smooth"
                  data-ocid={`category-${cat.label.toLowerCase().replace(/\s+/, "-")}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600";
                    }}
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="font-display font-bold text-background text-lg sm:text-xl leading-tight">
                      {cat.label}
                    </p>
                    <p className="text-xs text-background/65 mt-0.5">
                      {cat.sub}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-smooth translate-y-1 group-hover:translate-y-0">
                      View Collection <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story / About ───────────────────────────────────── */}
      <section
        className="py-14 lg:py-20 bg-background"
        aria-label="About Aesthetic Street Wear"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                  alt="Aesthetic Street Wear brand story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800";
                  }}
                />
              </div>
              {/* Accent card */}
              <div className="absolute -bottom-5 -right-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg hidden sm:block">
                <p className="font-display font-bold text-2xl">2026</p>
                <p className="text-xs opacity-80">Relaunched</p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            >
              <p className="text-label text-primary mb-3">Our Story</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-5">
                Born on the Streets,
                <br />
                Built for Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Aesthetic Street Wear was founded with a single vision: to
                  bring premium quality men's fashion to those who demand both
                  style and substance. We believe that what you wear tells a
                  story — and we're here to help you make it a great one.
                </p>
                <p>
                  Every piece in our collection is handpicked for its
                  craftsmanship, fit, and versatility. From sharp Oxford shirts
                  to street-ready cargo pants, each item bridges the gap between
                  elevated fashion and everyday wearability.
                </p>
                <p>
                  Now rebuilt with modern technology to provide you the fastest, most
                  seamless shopping experience possible.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="btn-primary h-11 px-7"
                  data-ocid="about-shop-cta"
                >
                  <Link to="/shirts">Explore Collection</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-11 px-7"
                  data-ocid="about-accessories-cta"
                >
                  <Link to="/accessories">View Accessories</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Collection Banner ────────────────────────────── */}
      <section
        className="bg-muted/40 py-14 lg:py-20"
        aria-label="Featured Collection"
      >
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden bg-foreground text-background relative">
            {/* BG gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 relative">
              {/* Text */}
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-primary/20 text-primary border-primary/30 font-semibold tracking-wider text-[11px] uppercase">
                  Featured Collection
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-background">
                  Urban Explorer
                </h2>
                <p className="text-background/70 leading-relaxed mb-8 max-w-md">
                  Designed for the man who navigates city streets with purpose.
                  Versatile pieces that transition effortlessly from morning
                  meetings to evening gatherings — without missing a beat.
                </p>
                <Button
                  asChild
                  className="btn-primary w-fit h-12 px-8"
                  data-ocid="featured-collection-cta"
                >
                  <Link to="/shirts">
                    Explore the Edit <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Image grid */}
              <div className="grid grid-cols-2 gap-0.5 aspect-[4/3] lg:aspect-auto bg-muted/10">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    to="/product/$id"
                    params={{ id: String(product._id) }}
                    className="overflow-hidden group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600";
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Products ──────────────────────────────────────────── */}
      <section
        className="py-14 lg:py-20 bg-background"
        aria-label="All Products"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <p className="text-label text-primary mb-1">Full Range</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold">
                All Products
              </h2>
            </div>
          </div>

          {/* Quick filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8" role="tablist">
            {[
              { label: "Shirts", to: "/shirts" as const },
              { label: "T-Shirts", to: "/tshirts" as const },
              { label: "Pants", to: "/pants" as const },
              { label: "Accessories", to: "/accessories" as const },
            ].map((cat) => (
              <Button
                key={cat.label}
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-border hover:border-primary hover:text-primary transition-smooth"
                asChild
                data-ocid={`filter-${cat.label.toLowerCase()}`}
              >
                <Link to={cat.to}>{cat.label}</Link>
              </Button>
            ))}
          </div>

          {!isLoading && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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
          ) : !isLoading && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              className="h-11 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
              data-ocid="view-all-products-cta"
            >
              <Link to="/shirts">Browse Full Collection</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
