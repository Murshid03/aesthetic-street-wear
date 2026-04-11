import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Heart, Shirt, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ALL_PRODUCTS } from "./HomePage";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
      className="card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5"
      data-ocid={`product-card-${product.id}`}
    >
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
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm hover:scale-110"
          onClick={() =>
            wished ? removeFromWishlist(product.id) : addToWishlist(product)
          }
          data-ocid={`wishlist-toggle-${product.id}`}
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
          Shirts
        </Badge>
        <div className="flex-1 min-w-0">
          <Link to="/product/$id" params={{ id: String(product.id) }}>
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
            ${product.price}
          </span>
          <Button
            size="sm"
            className="btn-primary text-xs h-8 px-3"
            onClick={() => {
              addToCart(product, product.sizes[0] ?? "One Size");
              toast.success("Added to cart!", { description: product.name });
            }}
            data-ocid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export default function ShirtsPage() {
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const shirts = useMemo(() => {
    let filtered = ALL_PRODUCTS.filter((p) => p.category === "Shirts");
    if (sizeFilter !== "all") {
      filtered = filtered.filter((p) => p.sizes.includes(sizeFilter));
    }
    if (sortBy === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [sizeFilter, sortBy]);

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
            <span className="text-foreground font-medium">Shirts</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <Shirt className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-3">
                Shirts
              </h1>
              <p className="text-muted-foreground max-w-xl leading-relaxed text-sm sm:text-base">
                Premium cuts and refined silhouettes for the modern man. From
                crisp formal wear to relaxed weekend essentials — each shirt
                crafted to elevate your look.
              </p>
              <p className="text-sm text-primary font-semibold mt-3">
                {shirts.length} product{shirts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Sort Bar */}
      <div className="bg-muted/30 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div
            className="flex flex-wrap items-center gap-2 sm:gap-3"
            data-ocid="filter-bar-shirts"
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
                data-ocid="filter-all"
              >
                All Sizes
              </button>
              {SIZE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSizeFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${sizeFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:border-primary/50"}`}
                  data-ocid={`filter-size-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="h-8 w-36 sm:w-40 text-xs"
                  data-ocid="sort-select-shirts"
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
          {shirts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {shirts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
              data-ocid="empty-state-shirts"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">
                No shirts found
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
