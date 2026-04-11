import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth disabled:opacity-40"
        onClick={onDecrease}
        disabled={quantity <= 1}
        data-ocid="qty-decrease"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-9 text-center text-sm font-semibold text-foreground tabular-nums select-none">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
        onClick={onIncrease}
        data-ocid="qty-increase"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function CartItemRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (q: number) => void;
}) {
  const lineTotal = item.product.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 py-5"
      data-ocid={`cart-item-${item.productId}`}
    >
      {/* Product image */}
      <Link
        to="/product/$id"
        params={{ id: String(item.productId) }}
        className="shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-muted block"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              to="/product/$id"
              params={{ id: String(item.productId) }}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
            >
              {item.product.name}
            </Link>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {item.product.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Size:{" "}
                <span className="font-semibold text-foreground">
                  {item.size}
                </span>
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Remove item"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
            onClick={onRemove}
            data-ocid={`remove-item-${item.productId}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <QuantityControl
            quantity={item.quantity}
            onDecrease={() => onQtyChange(item.quantity - 1)}
            onIncrease={() => onQtyChange(item.quantity + 1)}
          />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              ${item.product.price} × {item.quantity}
            </p>
            <p className="font-display font-bold text-base text-foreground">
              ${lineTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="empty-cart"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <ShoppingCart className="w-9 h-9 text-primary" />
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
        Looks like you haven't added any pieces yet. Explore our collection and
        find your style.
      </p>
      <Button asChild className="btn-primary h-11 px-8">
        <Link to="/">Start Shopping</Link>
      </Button>
    </motion.div>
  );
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    setCheckoutLoading(true);
    navigate({ to: "/checkout" });
    setCheckoutLoading(false);
  };

  const isEmpty = items.length === 0;

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
            <span className="text-foreground font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      <section className="py-8 lg:py-12 bg-background min-h-[60vh]">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-7 h-7 text-primary" />
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              Shopping Cart
            </h1>
            {!isEmpty && (
              <Badge className="bg-primary/15 text-primary border-primary/25 font-semibold text-xs">
                {items.length} {items.length === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <div className="card-elevated divide-y divide-border px-4 sm:px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItemRow
                        key={`${item.productId}-${item.size}`}
                        item={item}
                        onRemove={() =>
                          removeFromCart(item.productId, item.size)
                        }
                        onQtyChange={(q) =>
                          updateQuantity(item.productId, item.size, q)
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-5 flex items-center">
                  <Link
                    to="/"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    data-ocid="continue-shopping"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="card-elevated p-6 sticky top-24"
                  data-ocid="order-summary"
                >
                  <h2 className="font-display text-lg font-bold mb-5">
                    Order Summary
                  </h2>

                  <div className="space-y-2.5 text-sm mb-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="flex items-start justify-between gap-2"
                      >
                        <span className="text-muted-foreground min-w-0 leading-snug">
                          <span className="text-foreground font-medium line-clamp-1 block">
                            {item.product.name}
                          </span>
                          <span className="text-xs">
                            {item.size} × {item.quantity}
                          </span>
                        </span>
                        <span className="font-semibold shrink-0 tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2.5 text-sm mb-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground font-medium tabular-nums">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-primary font-semibold text-xs">
                        Confirmed via WhatsApp
                      </span>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-display font-bold">Grand Total</span>
                    <span className="font-display font-bold text-xl text-primary tabular-nums">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className="btn-primary w-full h-12 text-sm font-semibold shadow-sm"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    data-ocid="proceed-to-checkout"
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                        Processing…
                      </span>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      You'll be asked to{" "}
                      <Link
                        to="/login"
                        className="text-primary hover:underline font-semibold"
                      >
                        sign in
                      </Link>{" "}
                      before checkout
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Orders confirmed via WhatsApp
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
