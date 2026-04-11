import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Sample Products (8 items) ────────────────────────────────────────────────
export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Linen Shirt - Navy",
    category: "Shirts",
    description:
      "Breathable linen construction, relaxed contemporary fit. Perfect for warm days and coastal getaways.",
    price: 189,
    image: "/assets/generated/shirt-navy.dim_600x800.jpg",
    stockQuantity: 15,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    name: "Essential Twill Pants - Khaki",
    category: "Pants",
    description:
      "Slim-fit twill pants with clean structure. Versatile enough for any occasion from brunch to boardroom.",
    price: 145,
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    stockQuantity: 20,
    sizes: ["28", "30", "32", "34", "36"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 3,
    name: "Merino Wool Sweater - Camel",
    category: "TShirts",
    description:
      "Luxuriously soft merino wool in a refined crew neck silhouette. Lightweight warmth, timeless look.",
    price: 220,
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    stockQuantity: 10,
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 4,
    name: "Minimalist Leather Watch",
    category: "Accessories",
    description:
      "Clean dial, sapphire glass, genuine Italian leather strap. Timeless sophistication on your wrist.",
    price: 310,
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    stockQuantity: 8,
    sizes: ["One Size"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 5,
    name: "Oxford Button-Down - White",
    category: "Shirts",
    description:
      "Classic Oxford weave, relaxed collar, timeless everyday essential. Pairs with anything in your wardrobe.",
    price: 165,
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    stockQuantity: 25,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 6,
    name: "Cargo Utility Pants - Olive",
    category: "Pants",
    description:
      "Modern utility silhouette with subtle cargo pockets. Street-ready versatility meets refined tailoring.",
    price: 175,
    image: "/assets/generated/pants-olive.dim_600x800.jpg",
    stockQuantity: 12,
    sizes: ["28", "30", "32", "34"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 7,
    name: "Graphic Tee - Urban Script",
    category: "TShirts",
    description:
      "Premium 220gsm combed cotton with original urban art print. A statement piece for every occasion.",
    price: 85,
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    stockQuantity: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 8,
    name: "Leather Belt - Black",
    category: "Accessories",
    description:
      "Full-grain leather with brushed silver buckle. Handcrafted in small batches for lasting quality.",
    price: 75,
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    stockQuantity: 18,
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 9,
    name: "Chambray Overshirt - Indigo",
    category: "Shirts",
    description:
      "Lightweight chambray overshirt designed for layering. Soft-washed for immediate comfort and effortless drape.",
    price: 145,
    image: "/assets/generated/shirt-navy.dim_600x800.jpg",
    stockQuantity: 5,
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
    createdAt: Date.now() - 1000,
    updatedAt: Date.now(),
  },
  {
    id: 10,
    name: "Slim Chino Trousers - Charcoal",
    category: "Pants",
    description:
      "Clean-cut slim chino in premium stretch cotton. The most versatile trouser in any modern wardrobe.",
    price: 155,
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    stockQuantity: 14,
    sizes: ["28", "30", "32", "34", "36"],
    isActive: true,
    createdAt: Date.now() - 2000,
    updatedAt: Date.now(),
  },
  {
    id: 11,
    name: "Essential Crew Neck Tee - White",
    category: "TShirts",
    description:
      "Premium 200gsm cotton jersey crew neck. The foundation of any outfit, elevated to perfection.",
    price: 65,
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    stockQuantity: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now() - 3000,
    updatedAt: Date.now(),
  },
  {
    id: 12,
    name: "Wool-Blend Scarf - Charcoal",
    category: "Accessories",
    description:
      "Finely woven wool-blend scarf in versatile charcoal. The perfect finishing touch in cold weather.",
    price: 75,
    image: "/assets/generated/pants-olive.dim_600x800.jpg",
    stockQuantity: 15,
    sizes: ["One Size"],
    isActive: true,
    createdAt: Date.now() - 4000,
    updatedAt: Date.now(),
  },
];

// ─── Category Config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Shirts",
    to: "/shirts" as const,
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    sub: "Premium cuts & fabrics",
    count: "12 styles",
  },
  {
    label: "T-Shirts",
    to: "/tshirts" as const,
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    sub: "Everyday essentials",
    count: "18 styles",
  },
  {
    label: "Pants",
    to: "/pants" as const,
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    sub: "Tailored precision fits",
    count: "10 styles",
  },
  {
    label: "Accessories",
    to: "/accessories" as const,
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    sub: "Finishing touches",
    count: "15 pieces",
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
  const wished = isInWishlist(product.id);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, product.sizes[0] ?? "One Size");
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div
      className="card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5"
      data-ocid={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Link to="/product/$id" params={{ id: String(product.id) }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
        </Link>

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm hover:scale-110"
          onClick={() =>
            wished ? removeFromWishlist(product.id) : addToWishlist(product)
          }
          data-ocid={`wishlist-toggle-${product.id}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wished ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Badges */}
        {product.stockQuantity <= 5 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-semibold">
            Low Stock
          </Badge>
        )}
        {product.id <= 2 && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold">
            New
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <Link to="/product/$id" params={{ id: String(product.id) }}>
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
            ${product.price}
          </span>
          <Button
            size="sm"
            className="btn-primary text-xs h-8 px-3 shrink-0"
            onClick={handleAddToCart}
            disabled={adding}
            data-ocid={`add-to-cart-${product.id}`}
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
  const newArrivals = ALL_PRODUCTS.slice(0, 6);

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
                <div className="w-64 h-[360px] sm:w-80 sm:h-[440px] lg:w-[380px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/assets/generated/hero-model.dim_800x1000.jpg"
                    alt="Aesthetic Street Wear — premium mens fashion"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
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
                        "/assets/images/placeholder.svg";
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
                      {cat.count} <ArrowRight className="w-3 h-3" />
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
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <img
                  src="/assets/generated/about-brand.dim_800x600.jpg"
                  alt="Aesthetic Street Wear brand story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
              </div>
              {/* Accent card */}
              <div className="absolute -bottom-5 -right-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg hidden sm:block">
                <p className="font-display font-bold text-2xl">2020</p>
                <p className="text-xs opacity-80">Est. in Chennai</p>
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
                  Based in Chennai, serving style-conscious men across India
                  with fast delivery and genuine quality you can feel with every
                  wear.
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
              <div className="grid grid-cols-2 gap-0.5 aspect-[4/3] lg:aspect-auto">
                {ALL_PRODUCTS.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    to="/product/$id"
                    params={{ id: String(product.id) }}
                    className="overflow-hidden group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/images/placeholder.svg";
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {ALL_PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

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
