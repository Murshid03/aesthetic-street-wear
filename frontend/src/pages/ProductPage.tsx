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
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// Category route mapping
const CATEGORY_ROUTE: Record<Category, string> = {
  Shirts: "/shirts",
  TShirts: "/tshirts",
  Pants: "/pants",
  Accessories: "/accessories",
};

const CATEGORY_LABEL: Record<Category, string> = {
  Shirts: "Shirts",
  TShirts: "T-Shirts & Tops",
  Pants: "Pants & Trousers",
  Accessories: "Accessories",
};

function RelatedProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product._id!);

  return (
    <div className="card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5">
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Link to="/product/$id" params={{ id: product._id! }}>
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
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm"
          onClick={() =>
            wished ? removeFromWishlist(product._id!) : addToWishlist(product)
          }
        >
          <Heart
            className={`w-4 h-4 ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex-1 min-w-0">
          <Link to="/product/$id" params={{ id: product._id! }}>
            <h4 className="font-semibold text-xs text-foreground leading-snug hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h4>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="font-display font-bold text-base">
            ₹{product.price}
          </span>
          <Button
            size="sm"
            className="btn-primary text-[10px] h-7 px-2"
            onClick={() => {
              addToCart(product, product.sizes[0] ?? "One Size");
              toast.success("Added to cart!");
            }}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
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
        <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading product details…</p>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This product doesn't exist or may have been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const wished = isInWishlist(product._id!);
  const activeSize = selectedSize || "";
  const categoryRoute = CATEGORY_ROUTE[product.category];
  const categoryLabel = CATEGORY_LABEL[product.category];

  // Related products: same category, exclude current
  const related = allProducts.filter(
    (p) => p.category === product.category && p._id !== product._id,
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!activeSize) {
      toast.error("Please select a size first");
      return;
    }
    addToCart(product, activeSize, quantity);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${activeSize} · Qty: ${quantity}`,
    });
  };

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 pt-6 pb-12">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8"
            aria-label="breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              to={categoryRoute}
              className="hover:text-foreground transition-colors"
            >
              {categoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium line-clamp-1 max-w-[200px]">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[3/4] shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500";
                  }}
                />
                <button
                  type="button"
                  aria-label={
                    wished ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-smooth hover:bg-card hover:scale-110"
                  onClick={() =>
                    wished
                      ? removeFromWishlist(product._id!)
                      : addToWishlist(product)
                  }
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                </button>
                {product.isSoldOut ? (
                  <Badge className="absolute top-4 left-4 bg-rose-600 text-white font-bold px-3 py-1">
                    Sold Out
                  </Badge>
                ) : product.stockQuantity <= 5 && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    Only {product.stockQuantity} left
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              {/* Header */}
              <div>
                <Badge
                  variant="outline"
                  className="mb-3 text-primary border-primary/30 font-semibold text-xs"
                >
                  {categoryLabel}
                </Badge>
                <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="font-display text-3xl font-bold text-primary">
                  ₹{product.price}
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">
                    Select Size
                    {activeSize && (
                      <span className="text-primary ml-2 font-bold">
                        {activeSize}
                      </span>
                    )}
                  </p>
                  {!activeSize && (
                    <span className="text-xs text-muted-foreground">
                      Required to add to cart
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      disabled={product.isSoldOut}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeSize === size
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:border-primary/60 bg-card"
                        } ${product.isSoldOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!activeSize && !product.isSoldOut && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Please select a size to proceed
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div>
                <p className="text-sm font-semibold mb-3">Quantity</p>
                <div
                  className="inline-flex items-center border-2 border-border rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    disabled={product.isSoldOut}
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`w-12 text-center text-sm font-bold ${product.isSoldOut ? "opacity-30" : ""}`}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={product.isSoldOut}
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {product.isSoldOut ? (
                  <Button
                    className="flex-1 h-12 text-base font-bold bg-foreground text-background hover:bg-foreground/90 rounded-xl px-8"
                    onClick={() => {
                      api.post(`/products/${product._id}/notify-me`)
                        .then(() => toast.success("We'll notify you!", {
                          description: `You'll be alerted when ${product.name} returns to our collection.`
                        }))
                        .catch(() => toast.error("Please sign in to get restock alerts"));
                    }}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Notify Me When Restocked
                  </Button>
                ) : (
                  <Button
                    className="btn-primary flex-1 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={!activeSize}
                    title={!activeSize ? "Select a size first" : "Add to cart"}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {activeSize ? "Add to Cart" : "Select a Size First"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 h-12 border-2"
                  onClick={() =>
                    wished
                      ? removeFromWishlist(product._id!)
                      : addToWishlist(product)
                  }
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${wished ? "fill-primary text-primary" : ""}`}
                  />
                  {wished ? "Wishlisted" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Back to category */}
              <Link
                to={categoryRoute}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {categoryLabel}
              </Link>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-label text-primary mb-1">
                    More from the collection
                  </p>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  to={categoryRoute}
                  className="text-sm font-semibold text-primary hover:underline underline-offset-2 hidden sm:inline-flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {related.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                  >
                    <RelatedProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
