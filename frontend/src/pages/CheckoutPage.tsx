import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/types";
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

            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>
              SEQUENCE <br /> <span className="text-primary italic">SYNCHRONIZED</span>
            </h1>

            <p className="text-white/40 text-sm font-medium leading-relaxed mb-12 max-w-md mx-auto">
              Your architectural loadout has been registered. Our logistics terminal is now awaiting WhatsApp verification to finalize dispatch.
            </p>

            <div className="bg-white/5 rounded-3xl p-8 mb-12 border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Manifest Tracking ID</p>
              <p className="text-3xl font-black text-primary tracking-[0.2em]">#{orderRef.slice(-8).toUpperCase()}</p>
              <div className="w-12 h-1 bg-primary/20 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                asChild
                className="h-16 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-xl"
              >
                <Link to="/account">
                  Track Manifest
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-full border-white/10 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                onClick={onReset}
              >
                New Procurement
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

  const WHATSAPP_NUMBER = "917540096446";

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
        `👋 *ORDER INQUIRY — Aesthetic Street Wear*`,
        `Manifest protocol initiated. Requesting validation for current loadout.`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `📋 *Tracking ID:* #${orderRef}`,
        `📅 *Timestamp:* ${now}`,
        ``,
        `👤 *Vanguard:*`,
        `   Name: ${customerName}`,
        `   Sector: ${deliveryAddress}`,
        ``,
        `🛒 *Archive Fragments:*`,
        `─────────────────────`,
        ...lineItems,
        `─────────────────────`,
        `💰 *Valuation Sum:* ₹${total.toLocaleString("en-IN")}`,
        `💳 *Protocol:* Cash on Delivery`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `Awaiting administrative response. Over. 🙏`,
      ].join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");

      setOrderId(newOrder._id);
      setConfirmed(true);
      clearCart();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Protocol Failure.");
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
    if (!customerName.trim()) { toast.error("Identity Required."); return; }
    if (!deliveryAddress.trim()) { toast.error("Sector Coords Required."); return; }

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
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Command Vacant</h1>
          <p className="text-black/40 mb-10 max-w-sm mx-auto">No procurement segments registered. Return to the archive to begin your sequence.</p>
          <Button asChild className="h-16 px-12 rounded-full bg-black">
            <Link to="/">Explore Archive</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute redirectTo="/login">
      <Layout>
        <div className="bg-white min-h-screen pt-24 pb-20">
          <div className="container mx-auto container-px">
            {/* ── Editorial Header ────────────────────────────────────────── */}
            <div className="mb-16">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-8">
                <Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3 h-3" /> Logistics
                </Link>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-primary italic">Checkout Protocol</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                FINALIZE <br /> <span className="text-primary italic text-4xl md:text-6xl">PROCUREMENT</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* ── Config Side ──────────────────────────────────────────────── */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-16">
                {/* Customer details */}
                <div className="space-y-10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black shadow-lg">01</div>
                    <h2 className="text-xl font-black uppercase tracking-widest">IDENTIFICATION</h2>
                  </div>
                  <div className="grid gap-8 p-10 rounded-[2.5rem] bg-black/5 border border-black/5 transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:border-transparent">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Full Signature</Label>
                      <Input
                        placeholder="Enter Persona Designation"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Dispatch Sector (Address)</Label>
                      <Input
                        placeholder="Street, Sector, City, PIN"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-black shadow-lg">02</div>
                    <h2 className="text-xl font-black uppercase tracking-widest">LOADOUT VALIDATION</h2>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-black/5 border border-black/5 transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:border-transparent divide-y divide-black/5">
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
                <div className="sticky top-32 p-10 rounded-[3rem] bg-black text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[130px] rounded-full" />
                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black uppercase tracking-widest">SUMMARY</h2>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">COD Protocol Active</span>
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
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">COMBINED SUM</span>
                        <span className="text-4xl font-black text-white">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={orderMutation.isPending}
                      className="w-full h-16 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl group overflow-hidden relative"
                    >
                      <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${orderMutation.isPending ? "-translate-y-16" : ""}`}>
                        INITIALIZE DISPATCH
                        <ChevronRight className="w-4 h-4" />
                      </span>
                      <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${orderMutation.isPending ? "translate-y-0" : "translate-y-16"}`}>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Manifest...
                      </span>
                    </Button>

                    <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                      {[
                        { icon: ShieldCheck, label: "Encrypted" },
                        { icon: Truck, label: "Logistic" }
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
