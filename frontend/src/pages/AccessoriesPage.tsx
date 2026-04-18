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
import { Heart, ShoppingBag, ShoppingCart, SlidersHorizontal, Package, Sparkles } from "lucide-react";
import { motion } from "motion/react";
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
                "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800";
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
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

export default function AccessoriesPage() {
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const accessories = useMemo(() => {
    let filtered = allProducts.filter((p) => p.category === "Accessories");
    if (sortBy === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [allProducts, sortBy]);

  return (
    <Layout>
      {/* ── Editorial Header ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-white border-b border-black/5 overflow-hidden">
        <div className="container mx-auto container-px">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="w-1 h-1 rounded-full bg-black/10" />
              <span className="text-black/60">Archive</span>
              <span className="w-1 h-1 rounded-full bg-black/10" />
              <span className="text-primary italic">Accessories</span>
            </nav>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-[2px] bg-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Category . Collection</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10" style={{ fontFamily: "var(--font-display)" }}>
              ESSENTIAL <br /> <span className="text-primary italic">FRAGMENTS</span>
            </h1>

            <p className="max-w-2xl text-black/40 text-base md:text-lg font-medium leading-relaxed border-l-2 border-black/5 pl-8" style={{ fontFamily: "var(--font-secondary)" }}>
              The final signatures of urban architecture. Meticulously crafted accessories designed to complete the contemporary silhouette.
            </p>
          </div>
        </div>
      </section>

      {/* ── Modern Controls ─────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-[72px] z-30 py-4">
        <div className="container mx-auto container-px">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-black/30" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Hierarchy:</span>
            </div>

            <div className="flex items-center justify-end gap-6">
              <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-black/20">
                {accessories.length} Artifacts Found
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-44 rounded-full border-black/5 bg-black/5 text-[10px] font-black uppercase tracking-widest focus:ring-primary/20">
                  <SelectValue placeholder="Sort Hierarchy" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-black/5 shadow-2xl">
                  <SelectItem value="newest" className="text-[10px] font-black uppercase tracking-widest">Newest Arrival</SelectItem>
                  <SelectItem value="price-asc" className="text-[10px] font-black uppercase tracking-widest">Price Low → High</SelectItem>
                  <SelectItem value="price-desc" className="text-[10px] font-black uppercase tracking-widest">Price High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Result Grid ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto container-px">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : accessories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {accessories.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/5 mb-8">
                <Sparkles className="w-10 h-10 text-black/20" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>Sequence Missing</h2>
              <p className="text-black/40 text-sm font-medium mb-10 max-w-sm mx-auto">The requested archive fragment could not be located in this configuration.</p>
              <Button
                variant="outline"
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
