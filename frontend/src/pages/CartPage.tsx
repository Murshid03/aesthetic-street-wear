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
  ChevronRight,
  Package,
  ShieldCheck,
  Truck
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
    <div className="flex items-center bg-black/5 rounded-full p-0.5 border border-black/5">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all disabled:opacity-20 touch-target"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center text-[11px] font-black">{quantity}</span>
      <button
        onClick={onIncrease}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all touch-target"
      >
        <Plus className="w-3 h-3" />
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
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="flex gap-4 py-5 border-b border-black/5 last:border-0 group"
    >
      <Link
        to="/product/$id"
        params={{ id: String(item.productId) }}
        className="shrink-0 w-20 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-muted"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <Link
                to="/product/$id"
                params={{ id: String(item.productId) }}
                className="text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] hover:text-primary transition-colors block truncate"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                {item.product.name}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Size: <span className="text-black">{item.size}</span></span>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-full flex items-center justify-center text-black/20 hover:text-rose-500 hover:bg-rose-50 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QuantityControl
            quantity={item.quantity}
            onDecrease={() => onQtyChange(item.quantity - 1)}
            onIncrease={() => onQtyChange(item.quantity + 1)}
          />
          <div className="text-right">
            <p className="text-sm sm:text-base font-black tabular-nums">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
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
      {/* Header */}
      <section className="pt-16 sm:pt-20 pb-6 sm:pb-10 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-4 whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-2.5 h-2.5 shrink-0" />
            <span className="text-primary italic">Shopping Cart</span>
          </nav>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 sm:w-8 h-[2px] bg-primary" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Your Cart</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-display)" }}>
                My <span className="text-primary italic">Cart</span>
              </h1>
            </div>

            {!isEmpty && (
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-black/30">Total</p>
                <div className="text-2xl sm:text-3xl font-black text-black leading-none">₹{total.toLocaleString("en-IN")}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 sm:py-10 bg-white min-h-[60vh] pb-28 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {isEmpty ? (
            <div className="py-20 text-center max-w-sm mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/5 mb-8">
                <ShoppingBag className="w-8 h-8 text-black/10" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>Your Cart is Empty</h2>
              <p className="text-black/40 text-sm font-medium leading-relaxed mb-10">Browse our collections to find something you like.</p>
              <Button asChild className="h-12 px-10 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-lg">
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* Items */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="space-y-0">
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((item) => (
                      <CartItemRow
                        key={`${item.productId}-${item.size}`}
                        item={item}
                        onRemove={() => removeFromCart(item.productId, item.size)}
                        onQtyChange={(q) => updateQuantity(item.productId, item.size, q)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-8">
                  <Link to="/" className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-black/30 hover:text-black transition-colors">
                    <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <ArrowLeft className="w-3 h-3" />
                    </div>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-24 p-5 sm:p-7 rounded-3xl bg-black text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />
                  <div className="relative z-10 space-y-6">
                    <h2 className="text-base font-black uppercase tracking-widest">Order Summary</h2>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>Sub-Total</span>
                        <span className="text-white">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>Shipping</span>
                        <span className="text-primary italic">Free</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>Taxes</span>
                        <span className="text-white italic">Included</span>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Total</span>
                      <span className="text-2xl sm:text-3xl font-black">₹{total.toLocaleString("en-IN")}</span>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full h-12 sm:h-14 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl"
                    >
                      {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                      {[
                        { icon: ShieldCheck, label: "Secure" },
                        { icon: Truck, label: "Fast" },
                        { icon: Package, label: "Packed" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 opacity-20">
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
