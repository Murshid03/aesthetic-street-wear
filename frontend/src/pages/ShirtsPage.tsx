import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { Heart, Shirt, ShoppingCart, SlidersHorizontal, Loader2, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function ProductCard({ product }: { product: Product }) {
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
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500";
            }}
          />
        </Link>
        <button
          onClick={() => wished ? removeFromWishlist(pid) : addToWishlist(product)}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
            ${wished ? "bg-primary text-white" : "bg-white/80 backdrop-blur-sm text-black hover:bg-white"}`}
        >
          <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
        </button>
        {/* Always show on mobile, hover-only on desktop */}
        <div className="absolute inset-x-3 bottom-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity <= 0}
            className="w-full bg-white text-black hover:bg-black hover:text-white rounded-lg h-10 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            {adding ? <Package className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
            {adding ? "Added" : product.stockQuantity <= 0 ? "Sold Out" : "Add to Cart"}
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
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Ltd . Ed</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-4">
      <div className="skeleton aspect-[3/4.2] rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 rounded-lg w-2/3" />
        <div className="skeleton h-2 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export default function ShirtsPage() {
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const shirts = useMemo(() => {
    let filtered = allProducts.filter((p) => p.category === "Shirts");
    if (sizeFilter !== "all") {
      filtered = filtered.filter((p) => p.sizes.includes(sizeFilter));
    }
    if (sortBy === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [allProducts, sizeFilter, sortBy]);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-16 sm:pt-24 pb-8 sm:pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl text-center md:text-left">
            <nav className="flex items-center justify-center md:justify-start gap-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-4 whitespace-nowrap overflow-x-auto no-scrollbar">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="w-1 h-1 rounded-full bg-black/10" />
              <span className="text-primary italic">Shirts</span>
            </nav>

            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary">Category . Collection</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Premium <span className="text-primary italic">Shirts</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Filter Controls */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-black/5 sticky top-[56px] z-30 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-0.5">
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-black/30" />
            </div>
            <button
              onClick={() => setSizeFilter("all")}
              className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${sizeFilter === "all" ? "bg-black text-white border-black" : "bg-transparent text-black/40 border-black/5 hover:border-black/20"}`}
            >
              All
            </button>
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSizeFilter(s)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${sizeFilter === s ? "bg-black text-white border-black" : "bg-transparent text-black/40 border-black/5 hover:border-black/20"}`}
              >
                {s}
              </button>
            ))}
            <div className="ml-auto shrink-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-36 rounded-full border-black/5 bg-black/5 text-[9px] font-black uppercase tracking-widest focus:ring-primary/20">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-black/5 shadow-2xl">
                  <SelectItem value="newest" className="text-[9px] font-black uppercase tracking-widest">Newest</SelectItem>
                  <SelectItem value="price-asc" className="text-[9px] font-black uppercase tracking-widest">Price Low → High</SelectItem>
                  <SelectItem value="price-desc" className="text-[9px] font-black uppercase tracking-widest">Price High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-6 sm:py-10 bg-white pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : shirts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-x-8 lg:gap-y-16">
              {shirts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/5 mb-8">
                <Shirt className="w-10 h-10 text-black/20" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>Sequence Missing</h2>
              <p className="text-black/40 text-sm font-medium mb-10 max-w-sm mx-auto">The requested archive fragment could not be located in this configuration.</p>
              <Button
                variant="outline"
                onClick={() => setSizeFilter("all")}
                className="h-12 px-10 rounded-full border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Reset Archive
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
