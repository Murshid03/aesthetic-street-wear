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
import { Heart, ShoppingBag, SlidersHorizontal, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product._id!);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
      className="card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Link to="/product/$id" params={{ id: product._id! }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974";
            }}
          />
        </Link>
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm hover:scale-110"
          onClick={() =>
            wished ? removeFromWishlist(product._id!) : addToWishlist(product)
          }
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
        {product.stockQuantity <= 5 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-semibold">
            Low Stock
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Badge
          variant="outline"
          className="self-start text-primary border-primary/30 text-[10px] px-2 py-0.5 font-semibold"
        >
          T-Shirts
        </Badge>
        <div className="flex-1 min-w-0">
          <Link to="/product/$id" params={{ id: product._id! }}>
            <h3 className="font-semibold text-sm text-foreground leading-snug hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {product.sizes.join(" · ")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="font-display font-bold text-lg text-foreground">
            ₹{product.price}
          </span>
          <Button
            size="sm"
            className="btn-primary text-xs h-8 px-3"
            onClick={() => {
              addToCart(product, product.sizes[0] ?? "One Size");
              toast.success("Added to cart!", { description: product.name });
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export default function TShirtsPage() {
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const tshirtsList = useMemo(() => {
    let filtered = allProducts.filter((p) => p.category === "TShirts");
    if (sizeFilter !== "all") {
      filtered = filtered.filter((p) => p.sizes.includes(sizeFilter));
    }
    if (sortBy === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allProducts, sizeFilter, sortBy]);

  return (
    <Layout>
      {/* Category Header */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground mb-5"
            aria-label="breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">T-Shirts & Tops</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-3">
                T-Shirts & Tops
              </h1>
              <p className="text-muted-foreground max-w-xl leading-relaxed text-sm sm:text-base">
                Everyday essentials crafted for comfort and effortless style.
                From relaxed fits to slim-cut silhouettes, built to be worn
                endlessly across any season.
              </p>
              {isLoading ? (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating collection…
                </div>
              ) : (
                <p className="text-sm text-primary font-semibold mt-3">
                  {tshirtsList.length} product{tshirtsList.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Sort Bar */}
      <div className="bg-muted/30 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="font-medium text-xs hidden sm:inline">
                Filter:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSizeFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${sizeFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:border-primary/50"}`}
              >
                All Sizes
              </button>
              {SIZE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSizeFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${sizeFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:border-primary/50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="h-8 w-36 sm:w-40 text-xs"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : tshirtsList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {tshirtsList.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">
                No T-Shirts found
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Try a different size filter or browse the full collection
              </p>
              <Button variant="outline" onClick={() => setSizeFilter("all")}>
                Clear Filter
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
