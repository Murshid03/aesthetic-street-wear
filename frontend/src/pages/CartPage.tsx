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
    <div className="flex items-center bg-black/5 rounded-full p-1 border border-black/5">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all disabled:opacity-20"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center text-[11px] font-black">{quantity}</span>
      <button
        onClick={onIncrease}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col sm:flex-row gap-6 py-8 border-b border-black/5 last:border-0 group"
    >
      <Link
        to="/product/$id"
        params={{ id: String(item.productId) }}
        className="shrink-0 aspect-[3/4] w-32 rounded-2xl overflow-hidden bg-muted relative"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Link
                to="/product/$id"
                params={{ id: String(item.productId) }}
                className="text-xs font-black uppercase tracking-[0.1em] hover:text-primary transition-colors block"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                {item.product.name}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Fitment: <span className="text-black">{item.size}</span></span>
                <span className="w-1 h-1 rounded-full bg-black/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black/30">ID: {String(item.productId).slice(-6).toUpperCase()}</span>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="w-10 h-10 rounded-full flex items-center justify-center text-black/20 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <QuantityControl
            quantity={item.quantity}
            onDecrease={() => onQtyChange(item.quantity - 1)}
            onIncrease={() => onQtyChange(item.quantity + 1)}
          />
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-1">Subtotal</p>
            <p className="text-lg font-black tabular-nums">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
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
      {/* ── Editorial Header ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-white border-b border-black/5">
        <div className="container mx-auto container-px">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-primary italic">Shopping Cart</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-primary" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Your Selection</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-display)" }}>
                ACTIVE <br /> <span className="text-primary italic">CART</span>
              </h1>
            </div>

            {!isEmpty && (
              <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Cart Total</p>
                <div className="text-4xl font-black text-black leading-none">₹{total.toLocaleString("en-IN")}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <section className="py-20 bg-white min-h-[60vh]">
        <div className="container mx-auto container-px">
          {isEmpty ? (
            <div className="py-32 text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/5 mb-10">
                <ShoppingBag className="w-10 h-10 text-black/10" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>Your Cart is Empty</h2>
              <p className="text-black/40 text-sm font-medium leading-relaxed mb-12">Looks like you haven't added anything to your cart yet. Browse our collections to find something you like.</p>
              <Button asChild className="h-16 px-12 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Items */}
              <div className="lg:col-span-12 xl:col-span-8">
                <div className="space-y-4">
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

                <div className="mt-12">
                  <Link to="/" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-black/30 hover:text-black transition-colors">
                    <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Summary Summary Sidebar */}
              <div className="lg:col-span-12 xl:col-span-4 lg:pt-8">
                <div className="sticky top-32 p-10 rounded-[2.5rem] bg-black text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[100px] rounded-full" />
                  <div className="relative z-10 space-y-10">
                    <h2 className="text-xl font-black uppercase tracking-widest mb-10">ORDER SUMMARY</h2>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                        <span>Sub-Total</span>
                        <span className="text-white">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                        <span>Shipping</span>
                        <span className="text-primary italic italic">Standard Delivery / Free</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                        <span>Taxes</span>
                        <span className="text-white italic">Included</span>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Amount</span>
                      <span className="text-3xl font-black">₹{total.toLocaleString("en-IN")}</span>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full h-16 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl group overflow-hidden relative"
                    >
                      <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${checkoutLoading ? "-translate-y-16" : ""}`}>
                        {isAuthenticated ? "PROCEED TO CHECKOUT" : "LOGIN TO CHECKOUT"}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                      <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${checkoutLoading ? "translate-y-0" : "translate-y-16"}`}>
                        <Package className="w-4 h-4 animate-bounce" />
                        Processing...
                      </span>
                    </Button>

                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                      {[
                        { icon: ShieldCheck, label: "Secure" },
                        { icon: Truck, label: "Fast" },
                        { icon: Package, label: "Mint" }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 opacity-20">
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
