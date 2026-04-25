import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import type { CartItem, SiteSettings } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Package,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface SizeRowProps {
  item: CartItem;
  onSizeChange: (productId: string, oldSize: string, newSize: string) => void;
}

function SizeRow({ item, onSizeChange }: SizeRowProps) {
  const sizes = item.product.sizes;
  return (
    <div className="flex items-center gap-6 py-5 border-b border-black/5 last:border-0 group">
      <div className="w-16 h-20 rounded-2xl overflow-hidden bg-muted shrink-0 group-hover:shadow-lg transition-all duration-500">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-black truncate mb-1">{item.product.name}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-black/30">Quantity: {item.quantity}</p>
        <div className="mt-3 flex items-center gap-2">
          <Select
            value={item.size}
            onValueChange={(val) => onSizeChange(item.productId, item.size, val)}
          >
            <SelectTrigger className="h-8 text-[9px] font-black uppercase tracking-widest w-24 border-black/5 bg-black/5 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              {sizes.map((s) => (
                <SelectItem key={s} value={s} className="text-[9px] font-black uppercase tracking-widest">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-black text-black">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

function ConfirmationScreen({
  orderRef,
  onReset,
}: { orderRef: string; onReset: () => void }) {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl text-center"
        >
          <div className="p-12 md:p-16 rounded-[3rem] bg-black text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-10 mx-auto border-2 border-primary/30"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>
              ORDER <br /> <span className="text-primary italic">CONFIRMED</span>
            </h1>

            <p className="text-white/40 text-sm font-medium leading-relaxed mb-12 max-w-md mx-auto">
              Your order has been successfully placed. Please complete the WhatsApp verification to finalize your shipment.
            </p>

            <div className="bg-white/5 rounded-3xl p-8 mb-12 border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Order ID</p>
              <p className="text-3xl font-black text-primary tracking-[0.2em]">#{orderRef.slice(-8).toUpperCase()}</p>
              <div className="w-12 h-1 bg-primary/20 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                asChild
                className="h-16 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-xl"
              >
                <Link to="/account">
                  Track Order
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-full border-white/10 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                onClick={onReset}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default function CheckoutPage() {
  const { items, clearCart, total, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderId, setOrderId] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return data;
    },
  });

  // Automatically add 91 prefix if number is 10 digits
  const rawNum = (settings?.whatsappNumber || "7540096446").replace(/\D/g, "");
  const WHATSAPP_NUMBER = rawNum.length === 10 ? `91${rawNum}` : rawNum;

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post("/orders", orderData);
      return data;
    },
    onSuccess: (newOrder) => {
      const orderRef = newOrder._id.slice(-8).toUpperCase();
      const now = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const lineItems = items.map((i, idx) =>
        [
          `  ${idx + 1}. *${i.product.name}*`,
          `     • Size: ${i.size}`,
          `     • Qty: ${i.quantity}`,
          `     • Subtotal: ₹${(i.product.price * i.quantity).toLocaleString("en-IN")}`,
        ].join("\n")
      );

      const message = [
        `📦 *NEW ORDER CONFIRMATION — Aesthetic Street Wear*`,
        `Hi, I've just placed an order! Please confirm my details below:`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `🆔 *Order ID:* #${orderRef}`,
        `📅 *Date:* ${now}`,
        ``,
        `👤 *Customer Info:*`,
        `   Name: ${customerName}`,
        `   Address: ${deliveryAddress}`,
        ``,
        `🛒 *Items to be Ordered:*`,
        `─────────────────────`,
        ...lineItems,
        `─────────────────────`,
        `💰 *Total Amount:* ₹${total.toLocaleString("en-IN")}`,
        `💳 *Payment Method:* Cash on Delivery`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `Awaiting your confirmation for this order. Thank you! 🙏`,
      ].join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");

      setOrderId(newOrder._id);
      setConfirmed(true);
      clearCart();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Order could not be placed.");
    }
  });

  const handleSizeChangeReal = (productId: string, oldSize: string, newSize: string) => {
    const item = items.find((i) => i.productId === productId && i.size === oldSize);
    if (!item || oldSize === newSize) return;
    const qty = item.quantity;
    removeFromCart(productId, oldSize);
    addToCart(item.product, newSize, qty);
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim()) { toast.error("Please enter your name."); return; }
    if (!deliveryAddress.trim()) { toast.error("Please enter your delivery address."); return; }

    const orderData = {
      customerName: customerName.trim(),
      deliveryAddress: deliveryAddress.trim(),
      items: items.map(i => ({
        productId: i.productId,
        name: i.product.name,
        image: i.product.image,
        size: i.size,
        quantity: i.quantity,
        price: i.product.price
      }))
    };
    orderMutation.mutate(orderData);
  };

  if (confirmed) {
    return <ConfirmationScreen orderRef={orderId} onReset={() => navigate({ to: "/" })} />;
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto container-px py-40 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/5 mb-8">
            <ShoppingBag className="w-10 h-10 text-black/10" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Cart is Empty</h1>
          <p className="text-black/40 mb-10 max-w-sm mx-auto">You haven't added any items to your cart yet. Browse our collection to get started.</p>
          <Button asChild className="h-16 px-12 rounded-full bg-black">
            <Link to="/">Shop Now</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute redirectTo="/login">
      <Layout>
        <div className="bg-white min-h-screen pt-16 lg:pt-24 pb-32 lg:pb-20">
          <div className="container mx-auto px-6 lg:px-12">
            {/* ── Editorial Header ────────────────────────────────────────── */}
            <div className="mb-12 lg:mb-16">
              <nav className="flex items-center justify-center md:justify-start gap-2 lg:gap-3 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-6 lg:mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
                <Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3 h-3" /> Cart
                </Link>
                <ChevronRight className="w-2.5 h-2.5 shrink-0" />
                <span className="text-primary italic">Checkout</span>
              </nav>
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-tight text-center md:text-left" style={{ fontFamily: "var(--font-display)" }}>
                CHECKOUT <br /> <span className="text-primary italic text-2xl lg:text-4xl">DETAILS</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* ── Config Side ──────────────────────────────────────────────── */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-16">
                {/* Customer details */}
                <div className="space-y-10 group">
                  <div className="flex items-center gap-4 px-4 lg:px-0">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black text-white flex items-center justify-center text-[9px] lg:text-[11px] font-black shadow-lg">01</div>
                    <h2 className="text-lg lg:text-xl font-black uppercase tracking-widest">SHIPPING INFO</h2>
                  </div>
                  <div className="grid gap-6 lg:gap-8 p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] bg-black/5 border border-black/5 transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:border-transparent">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Full Name</Label>
                      <Input
                        placeholder="e.g. John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-base font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Delivery Address</Label>
                      <Input
                        placeholder="House No, Street, City, State, PIN"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-base font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-10 group">
                  <div className="flex items-center gap-4 px-4 lg:px-0">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black text-white flex items-center justify-center text-[9px] lg:text-[11px] font-black shadow-lg">02</div>
                    <h2 className="text-lg lg:text-xl font-black uppercase tracking-widest">ORDER SUMMARY</h2>
                  </div>
                  <div className="p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] bg-black/5 border border-black/5 transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:border-transparent divide-y divide-black/5">
                    {items.map((item) => (
                      <SizeRow
                        key={`${item.productId}-${item.size}`}
                        item={item}
                        onSizeChange={handleSizeChangeReal}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Summary Side ────────────────────────────────────────────── */}
              <div className="lg:col-span-12 xl:col-span-5">
                <div className="sticky top-32 p-7 sm:p-10 rounded-[3rem] bg-black text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[130px] rounded-full" />
                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black uppercase tracking-widest">SUMMARY</h2>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">CASH ON DELIVERY</span>
                    </div>

                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span className="truncate max-w-[200px]">{item.product.name} [{item.size}] × {item.quantity}</span>
                          <span className="text-white">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                        <span>Shipping</span>
                        <span className="text-primary italic">Standard / Free</span>
                      </div>
                      <div className="flex justify-between items-end pt-4">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">TOTAL AMOUNT</span>
                        <span className="text-4xl font-black text-white">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={orderMutation.isPending}
                      className="w-full h-16 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl group overflow-hidden relative"
                    >
                      <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${orderMutation.isPending ? "-translate-y-16" : ""}`}>
                        PLACE ORDER
                        <ChevronRight className="w-4 h-4" />
                      </span>
                      <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${orderMutation.isPending ? "translate-y-0" : "translate-y-16"}`}>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Placing Order...
                      </span>
                    </Button>

                    <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                      {[
                        { icon: ShieldCheck, label: "Secure" },
                        { icon: Truck, label: "Shipping" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 opacity-20">
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
