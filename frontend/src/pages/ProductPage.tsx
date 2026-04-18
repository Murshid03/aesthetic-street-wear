import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product, Category } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Loader2,
  Zap,
  Package,
  Shield,
  Truck,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORY_ROUTE: Record<Category, string> = {
  Shirts: "/shirts",
  "T-Shirts": "/tshirts",
  Pants: "/pants",
  Accessories: "/accessories",
};

function RelatedProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const pid = product._id || (product as any).id;
  const wished = isInWishlist(pid);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, product.sizes[0] ?? "One Size");
    setTimeout(() => {
      setAdding(false);
      toast.success("Added to cart", { description: product.name });
    }, 900);
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
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
            ${wished ? "bg-primary text-white" : "bg-white/80 backdrop-blur-sm text-black hover:bg-white"}`}
        >
          <Heart className={`w-3 h-3 ${wished ? "fill-current" : ""}`} />
        </button>
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity <= 0}
            className="w-full bg-white text-black hover:bg-black hover:text-white rounded-lg h-9 text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
          >
            {adding ? <Package className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
            {adding ? "Added" : product.stockQuantity <= 0 ? "Empty" : "Add"}
          </Button>
        </div>
      </div>
      <div className="py-3 space-y-0.5">
        <h4 className="text-[9px] font-black uppercase tracking-[0.1em] text-black/60 truncate" style={{ fontFamily: "var(--font-accent)" }}>{product.name}</h4>
        <span className="text-[10px] font-bold text-black tracking-tighter">₹{product.price.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-black/5" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Accessing Archive Object...</p>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto container-px py-40 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Fragment Missing</h1>
          <p className="text-black/40 mb-10 max-w-sm mx-auto">The requested archive fragment could not be located in our current configuration.</p>
          <Button asChild className="h-12 px-10 rounded-full bg-black">
            <Link to="/">Return to Hub</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const wished = isInWishlist(product._id!);
  const categoryRoute = CATEGORY_ROUTE[product.category];
  const related = allProducts.filter(
    (p) => p.category === product.category && p._id !== product._id,
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select an architectural fit (size)");
      return;
    }
    setAddingToCart(true);
    addToCart(product, selectedSize, quantity);
    setTimeout(() => {
      setAddingToCart(false);
      toast.success("Segment Authenticated", {
        description: `Added "${product.name}" [${selectedSize}] to your loadout.`
      });
    }, 800);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="container mx-auto container-px">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* ── Visual Context ─────────────────────────────────────────── */}
            <div className="lg:col-span-7">
              <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Hub</Link>
                <ChevronRight className="w-2.5 h-2.5" />
                <Link to={categoryRoute} className="hover:text-primary transition-colors">{product.category}</Link>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-black/60 truncate">{product.name}</span>
              </nav>

              <div className="relative group">
                <div className="aspect-[3/4] md:aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted shadow-2xl">
                  <motion.img
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => wished ? removeFromWishlist(product._id!) : addToWishlist(product)}
                  className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-md
                     ${wished ? "bg-primary text-white scale-110" : "bg-white/80 text-black hover:bg-white"}`}
                >
                  <Heart className={`w-6 h-6 ${wished ? "fill-current" : ""}`} />
                </button>
                {product.isSoldOut && (
                  <div className="absolute top-8 left-8">
                    <div className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Non-Exist Project</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Architectural Specs ────────────────────────────────────── */}
            <div className="lg:col-span-5 flex flex-col pt-10">
              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-[2px] bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Signature Collection . 26</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    {product.name}
                  </h1>
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-black text-black">₹{product.price.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20">MSRP Inclusive Tax</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-black/40 text-base font-medium leading-relaxed border-l-2 border-black/5 pl-8" style={{ fontFamily: "var(--font-secondary)" }}>
                    {product.description || "Architectural silhouette engineered with raw urban intent. Every fragment is a signature of modern excellence, designed to define the new standard."}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {[
                      { icon: Shield, label: "Certified" },
                      { icon: Truck, label: "Express" },
                      { icon: RotateCcw, label: "Returnable" }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors">
                        <item.icon className="w-3.5 h-3.5 text-black/40" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/60">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fit Selection */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Architectural Fit:</span>
                    <button className="text-[8px] font-black uppercase tracking-widest border-b border-black/10 hover:border-black transition-colors">Sizing Grid</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={product.isSoldOut}
                        className={`h-12 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2 
                                    ${selectedSize === size
                            ? "border-black bg-black text-white shadow-xl scale-105"
                            : "border-black/5 bg-transparent text-black/40 hover:border-black/20"
                          } ${product.isSoldOut ? "opacity-20 cursor-not-allowed" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 bg-black/5 rounded-full p-1 items-center shrink-0">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black/40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-[11px] font-black">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black/40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.isSoldOut || addingToCart}
                      className="flex-1 h-16 rounded-full bg-primary text-white hover:bg-black transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl group overflow-hidden relative"
                    >
                      <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${addingToCart ? "-translate-y-16" : ""}`}>
                        <ShoppingCart className="w-4 h-4" />
                        {product.isSoldOut ? "Project Expired" : "Add to Loadout"}
                      </span>
                      <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${addingToCart ? "translate-y-0" : "translate-y-16"}`}>
                        <Package className="w-4 h-4 animate-bounce" />
                        Processing...
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 text-center">Batch ID: {String(product._id).slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sequence Context ────────────────────────────────────────── */}
          {related.length > 0 && (
            <section className="mt-40">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-[2px] bg-primary" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Contextual Pieces</p>
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>ARCHIVE PAIRINGS</h2>
                </div>
                <Link to={categoryRoute} className="text-[10px] font-black uppercase tracking-[0.3em] pb-1 border-b-2 border-primary hover:text-black transition-colors">Explore Category</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                {related.map((p) => (
                  <RelatedProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
