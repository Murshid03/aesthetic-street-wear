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
import { Heart, ShoppingCart, SlidersHorizontal, Loader2, Package, Sparkles } from "lucide-react";
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
            <div className="skeleton aspect-[3/4.2] rounded-xl" />
            <div className="space-y-2">
                <div className="skeleton h-3 rounded-lg w-2/3" />
                <div className="skeleton h-2 rounded-lg w-1/3" />
            </div>
        </div>
    );
}

const CATEGORY_OPTIONS = ["Shirts", "T-Shirts", "Pants", "Accessories"];

export default function NewArrivalsPage() {
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");

    const { data: allProducts = [], isLoading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await api.get("/products");
            return data;
        },
    });

    const products = useMemo(() => {
        let filtered = [...allProducts];
        if (categoryFilter !== "all") {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Sort logic
        if (sortBy === "price-asc")
            return filtered.sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc")
            return filtered.sort((a, b) => b.price - a.price);

        // Default: Sort by newest first
        return filtered.sort((a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }, [allProducts, categoryFilter, sortBy]);

    return (
        <Layout>
            {/* ── Editorial Header ────────────────────────────────────────── */}
            <section className="pt-20 lg:pt-32 pb-12 lg:pb-20 bg-white border-b border-black/5 overflow-hidden">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-4xl">
                        <nav className="flex items-center justify-center md:justify-start gap-2 lg:gap-3 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-6 lg:mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <span className="w-1 h-1 rounded-full bg-black/10" />
                            <span className="text-black/60">Archive</span>
                            <span className="w-1 h-1 rounded-full bg-black/10" />
                            <span className="text-primary italic">New Arrivals</span>
                        </nav>

                        <div className="flex items-center justify-center md:justify-start gap-4 lg:gap-6 mb-4 lg:mb-8">
                            <div className="w-8 lg:w-12 h-[2px] bg-primary" />
                            <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-primary">Latest Artifacts . Manifest 26</span>
                            <div className="md:hidden w-8 h-[2px] bg-primary" />
                        </div>

                        <h1 className="text-4xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6 lg:mb-10" style={{ fontFamily: "var(--font-display)" }}>
                            NEW <br /> <span className="text-primary italic">ARRIVALS</span>
                        </h1>

                        <p className="max-w-2xl text-black/40 text-sm lg:text-lg font-medium leading-relaxed lg:border-l-2 lg:border-black/5 lg:pl-8 mx-auto md:mx-0 text-center md:text-left" style={{ fontFamily: "var(--font-secondary)" }}>
                            Witness the recent convergence of urban architecture and premium tailoring.presented in reverse chronological priority.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Modern Controls ─────────────────────────────────────────── */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-[56px] lg:top-[72px] z-30 py-3 lg:py-4">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            <div className="flex items-center gap-2 shrink-0">
                                <SlidersHorizontal className="w-3 h-3 text-black/30" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Category:</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCategoryFilter("all")}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${categoryFilter === "all" ? "bg-black text-white border-black" : "bg-transparent text-black/40 border-black/5 hover:border-black/20"}`}
                                >
                                    All
                                </button>
                                {CATEGORY_OPTIONS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCategoryFilter(c)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${categoryFilter === c ? "bg-black text-white border-black" : "bg-transparent text-black/40 border-black/5 hover:border-black/20"}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6">
                            <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-black/20">
                                {products.length} Recent Fragments
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-10 w-44 rounded-full border-black/5 bg-black/5 text-[10px] font-black uppercase tracking-widest focus:ring-primary/20">
                                    <SelectValue placeholder="Sort Hierarchy" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-black/5 shadow-2xl">
                                    <SelectItem value="newest" className="text-[10px] font-black uppercase tracking-widest">Newest First</SelectItem>
                                    <SelectItem value="price-asc" className="text-[10px] font-black uppercase tracking-widest">Minimal Price</SelectItem>
                                    <SelectItem value="price-desc" className="text-[10px] font-black uppercase tracking-widest">Maximal Price</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Result Grid ─────────────────────────────────────────────── */}
            <section className="py-12 lg:py-20 bg-white pb-32">
                <div className="container mx-auto px-6 lg:px-12">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {products.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/5 mb-8">
                                <Sparkles className="w-10 h-10 text-black/20" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>Protocol Idle</h2>
                            <p className="text-black/40 text-sm font-medium mb-10 max-w-sm mx-auto">No recent artifacts match the current filter configuration.</p>
                            <Button
                                variant="outline"
                                onClick={() => setCategoryFilter("all")}
                                className="h-12 px-10 rounded-full border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                            >
                                Reset Manifest
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
