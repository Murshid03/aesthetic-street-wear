import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { Heart, Search as SearchIcon, ShoppingCart, Package, X, SlidersHorizontal, Sparkles, ArrowUpNarrowWide, ArrowDownWideNarrow, CalendarDays } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            <div className="relative aspect-[3/4.2] overflow-hidden bg-muted rounded-xl border border-black/[0.03]">
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
                    className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10
            ${wished ? "bg-primary text-white" : "bg-white/80 backdrop-blur-sm text-black hover:bg-white"}`}
                >
                    <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${wished ? "fill-current" : ""}`} />
                </button>
                <div className="absolute inset-x-3 bottom-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Button
                        onClick={handleAddToCart}
                        disabled={adding || product.stockQuantity <= 0}
                        className="w-full bg-white text-black hover:bg-black hover:text-white rounded-lg h-9 sm:h-10 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                        {adding ? <Package className="w-3 h-3 animate-bounce" /> : <ShoppingCart className="w-3 h-3" />}
                        {adding ? "Added" : product.stockQuantity <= 0 ? "Sold Out" : "Add to Cart"}
                    </Button>
                </div>
            </div>
            <div className="py-3 sm:py-4 space-y-1 sm:space-y-1.5">
                <Link to="/product/$id" params={{ id: String(pid) }}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-black hover:text-primary transition-colors line-clamp-1" style={{ fontFamily: "var(--font-accent)" }}>
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black/60 tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
                    {new Date(product.createdAt || 0) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? (
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">New</span>
                    ) : (
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-black/30">Ltd. Ed</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="aspect-[3/4.2] rounded-xl bg-black/[0.04]" />
            <div className="space-y-2 px-1">
                <div className="h-3 rounded bg-black/[0.05] w-2/3" />
                <div className="h-2.5 rounded bg-black/[0.03] w-1/3" />
            </div>
        </div>
    );
}

const CATEGORIES = ["All Items", "Shirts", "T-Shirts", "Pants", "Accessories"];
const TRENDING_TAGS = ["Oversized", "Vintage", "Hoodie", "Denim", "Watch"];

export default function SearchPage() {
    const searchParams = useSearch({ strict: false });
    const urlQuery = (searchParams as any).q || "";
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState(urlQuery);
    const [selectedCategory, setSelectedCategory] = useState("All Items");
    const [sortBy, setSortBy] = useState("newest");

    // Sync external URL updates to the input
    useEffect(() => {
        setInputValue(urlQuery);
    }, [urlQuery]);

    const { data: allProducts = [], isLoading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await api.get("/products");
            return data;
        },
    });

    // Debounced syncing to the browser search parameters
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue.trim() !== urlQuery) {
                navigate({
                    to: "/search",
                    search: { q: inputValue.trim() || undefined },
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue, navigate, urlQuery]);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const handleTrendingClick = (tag: string) => {
        setInputValue(tag);
    };

    // Apply Memoized Filters and Sorters
    const searchResults = useMemo(() => {
        let filtered = [...allProducts];

        // 1. Text Filter
        if (urlQuery) {
            const q = urlQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // 2. Category Filter
        if (selectedCategory !== "All Items") {
            filtered = filtered.filter(
                (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // 3. Sorting Order
        filtered.sort((a, b) => {
            if (sortBy === "price-asc") {
                return a.price - b.price;
            } else if (sortBy === "price-desc") {
                return b.price - a.price;
            } else if (sortBy === "newest") {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            }
            return 0; // Featured default
        });

        return filtered;
    }, [allProducts, urlQuery, selectedCategory, sortBy]);

    const recommendations = useMemo(() => {
        return [...allProducts]
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 4);
    }, [allProducts]);

    return (
        <Layout>
            {/* Highly Responsive, Compact Search Hero */}
            <section className="pt-12 pb-8 md:pt-24 md:pb-12 bg-gradient-to-b from-black/[0.01] to-transparent border-b border-black/[0.015]">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex flex-col items-center text-center">
                        {/* Compact Breadcrumb */}
                        <nav className="hidden sm:flex items-center justify-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-4">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <span className="w-1 h-1 rounded-full bg-black/10" />
                            <span className="text-primary italic font-extrabold">Search</span>
                        </nav>

                        <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6 select-none" style={{ fontFamily: "var(--font-display)" }}>
                            Discover <span className="text-primary italic">Fashion</span>
                        </h1>

                        {/* COMPACT, HIGHLY RESPONSIVE SEARCH BAR */}
                        <div className="w-full max-w-xl relative group">
                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-all duration-300 -z-10" />
                            <div className="relative flex items-center h-12 sm:h-14 md:h-16 px-4 sm:px-6 bg-white border border-black/[0.08] rounded-full shadow-md shadow-black/[0.01] transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-lg focus-within:shadow-primary/[0.03]">
                                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black/20 group-focus-within:text-primary transition-colors shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full h-full bg-transparent px-3 text-xs sm:text-sm md:text-base font-semibold text-black placeholder:text-black/20 focus:outline-none tracking-tight"
                                    style={{ fontFamily: "var(--font-accent)" }}
                                />
                                {inputValue && (
                                    <button
                                        onClick={() => setInputValue("")}
                                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center hover:bg-black/5 transition-all shrink-0 text-black/40 hover:text-black"
                                    >
                                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Category Scroll - Improved padding/spacing for mobile */}
                    <div className="w-full overflow-hidden mt-6 flex justify-center">
                        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar snap-x max-w-full">
                            {CATEGORIES.map((cat) => {
                                const active = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`whitespace-nowrap snap-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all border duration-300
                                            ${active
                                                ? "bg-primary border-primary text-white shadow-md shadow-primary/10 scale-105"
                                                : "bg-white border-black/[0.06] text-black/60 hover:border-black/30 hover:text-black"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Toolbar & Product Grid Grid */}
            <section className="py-6 bg-white min-h-[50vh] pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
                    
                    {/* Toolbar Section */}
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 pb-4 mb-6 border-b border-black/[0.05]">
                        <div>
                            <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3 h-3 text-primary shrink-0" />
                                {isLoading ? "Catalog loading..." : `${searchResults.length} Matches`}
                            </h2>
                        </div>

                        {/* Sort Control Dropdown */}
                        <div className="flex items-center gap-2 w-full xs:w-auto self-stretch xs:self-auto">
                            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest text-black/30 shrink-0">Sort:</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-9 sm:h-10 w-full xs:w-40 bg-white border border-black/[0.08] rounded-lg px-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary/50 shrink-0">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent className="border-black/[0.08] rounded-lg shadow-xl">
                                    <SelectItem value="newest" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black hover:text-primary py-2 flex items-center">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="w-3 h-3 text-primary/60" /> Newest
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="price-asc" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black hover:text-primary py-2 flex items-center">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowUpNarrowWide className="w-3 h-3 text-primary/60" /> Low-High
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="price-desc" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black hover:text-primary py-2 flex items-center">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowDownWideNarrow className="w-3 h-3 text-primary/60" /> High-Low
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="featured" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black hover:text-primary py-2 flex items-center">
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-primary/60" /> Featured
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Product Result Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 animate-fade-in">
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-y-12 animate-fade-up">
                            {searchResults.map((p) => (
                                <ProductCard key={p._id || (p as any).id} product={p} />
                            ))}
                        </div>
                    ) : (
                        /* Optimized Discovery Empty State */
                        <div className="py-8 sm:py-12 max-w-3xl mx-auto animate-fade-up text-center px-2">
                            <div className="mb-6 relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-black/[0.02] to-white border border-black/5 shadow-sm">
                                <SearchIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black/20" />
                            </div>
                            <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: "var(--font-display)" }}>
                                No items found
                            </h3>
                            <p className="text-black/40 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                                We couldn't find any items matching your query. Try typing a different tag.
                            </p>

                            {/* Small Trending Pills Group */}
                            <div className="mb-12 flex flex-col items-center">
                                <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-3">Popular Keywords</span>
                                <div className="flex flex-wrap justify-center gap-1.5 max-w-xs sm:max-w-md">
                                    {TRENDING_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTrendingClick(tag)}
                                            className="px-3 py-1.5 bg-black/[0.02] hover:bg-primary hover:text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-black/50 rounded-lg border border-transparent transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Curated Product List */}
                            {recommendations.length > 0 && (
                                <div className="pt-8 border-t border-black/[0.04] text-left">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-[1.5px] bg-primary" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-black/80">Trending Shelf</h4>
                                        </div>
                                        <Link to="/new-arrivals" className="text-[8px] font-black uppercase tracking-widest text-primary">View All</Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {recommendations.map((p) => (
                                            <ProductCard key={`rec-${p._id || (p as any).id}`} product={p} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
