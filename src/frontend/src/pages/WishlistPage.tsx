import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { WishlistItem } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShoppingCart, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function SizePickerDialog({
  item,
  open,
  onClose,
  onConfirm,
}: {
  item: WishlistItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (size: string) => void;
}) {
  const [selected, setSelected] = useState<string>("");

  if (!item) return null;

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected("");
  };

  const handleClose = () => {
    setSelected("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="max-w-sm" data-ocid="size-picker-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Choose a Size
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-2">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-16 h-20 rounded-lg object-cover bg-muted shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm line-clamp-2 leading-snug">
              {item.product.name}
            </p>
            <p className="text-primary font-bold text-base mt-1">
              ${item.product.price}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {item.product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg border transition-smooth ${
                selected === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50 hover:bg-muted text-foreground"
              }`}
              onClick={() => setSelected(size)}
              data-ocid={`size-option-${size}`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="btn-primary flex-1"
            disabled={!selected}
            onClick={handleConfirm}
            data-ocid="confirm-size"
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WishlistCard({
  item,
  onRemove,
  onMoveToCart,
}: {
  item: WishlistItem;
  onRemove: () => void;
  onMoveToCart: () => void;
}) {
  const { isInWishlist } = useWishlist();
  const wished = isInWishlist(item.productId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className="card-elevated group overflow-hidden flex flex-col"
      data-ocid={`wishlist-card-${item.productId}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Link to="/product/$id" params={{ id: String(item.productId) }}>
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/images/placeholder.svg";
            }}
          />
        </Link>
        {/* Heart toggle */}
        <button
          type="button"
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-xs"
          onClick={onRemove}
          data-ocid={`wishlist-remove-${item.productId}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wished ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
        {item.product.stockQuantity <= 5 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px]">
            Low Stock
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <Link to="/product/$id" params={{ id: String(item.productId) }}>
            <h3 className="font-semibold text-sm text-foreground leading-tight hover:text-primary transition-colors line-clamp-2">
              {item.product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            {item.product.sizes.join(" · ")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-lg text-foreground">
            ${item.product.price}
          </span>
          <Badge variant="secondary" className="text-xs shrink-0">
            {item.product.category}
          </Badge>
        </div>
        <Button
          size="sm"
          className="btn-primary w-full text-xs h-9"
          onClick={onMoveToCart}
          data-ocid={`move-to-cart-${item.productId}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          Move to Cart
        </Button>
      </div>
    </motion.div>
  );
}

function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="empty-wishlist"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Heart className="w-9 h-9 text-primary" />
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">
        Your wishlist is empty
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
        Save your favourite pieces here. Tap the heart icon on any product to
        add it to your wishlist.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {[
          { label: "Shop Shirts", to: "/shirts" },
          { label: "Shop Pants", to: "/pants" },
          { label: "Accessories", to: "/accessories" },
        ].map((cat) => (
          <Button key={cat.to} asChild variant="outline" className="h-10 px-5">
            <Link to={cat.to}>
              {cat.label}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { items, removeFromWishlist, itemCount } = useWishlist();
  const { addToCart } = useCart();
  const [pendingItem, setPendingItem] = useState<WishlistItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMoveToCart = (item: WishlistItem) => {
    if (item.product.sizes.length === 1) {
      addToCart(item.product, item.product.sizes[0]);
      removeFromWishlist(item.productId);
      toast.success(`${item.product.name} added to cart`);
      return;
    }
    setPendingItem(item);
    setDialogOpen(true);
  };

  const handleSizeConfirm = (size: string) => {
    if (!pendingItem) return;
    addToCart(pendingItem.product, size);
    removeFromWishlist(pendingItem.productId);
    toast.success(`${pendingItem.product.name} (${size}) added to cart`);
    setPendingItem(null);
    setDialogOpen(false);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Wishlist</span>
          </div>
        </div>
      </div>

      <section className="py-8 lg:py-12 bg-background min-h-[60vh]">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold leading-tight">
                  My Wishlist
                </h1>
                {itemCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <span className="font-semibold text-foreground">
                      {itemCount}
                    </span>{" "}
                    saved {itemCount === 1 ? "item" : "items"}
                  </p>
                )}
              </div>
            </div>
            {itemCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                Tap "Move to Cart" to order
              </div>
            )}
          </div>

          {itemCount === 0 ? (
            <EmptyWishlist />
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {},
              }}
            >
              <AnimatePresence>
                {items.map((item) => (
                  <WishlistCard
                    key={item.productId}
                    item={item}
                    onRemove={() => removeFromWishlist(item.productId)}
                    onMoveToCart={() => handleMoveToCart(item)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <SizePickerDialog
        item={pendingItem}
        open={dialogOpen}
        onClose={() => {
          setPendingItem(null);
          setDialogOpen(false);
        }}
        onConfirm={handleSizeConfirm}
      />
    </Layout>
  );
}
