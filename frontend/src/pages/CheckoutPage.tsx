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
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="p-8 sm:p-12 rounded-3xl bg-black text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto border-2 border-primary/30"
            >
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-3" style={{ fontFamily: "var(--font-display)" }}>
              ORDER <br /> <span className="text-primary italic">CONFIRMED</span>
            </h1>

            <p className="text-white/40 text-sm font-medium leading-relaxed mb-12 max-w-md mx-auto">
              Your order has been successfully placed. Please complete the WhatsApp verification to finalize your shipment.
            </p>

            <div className="bg-white/5 rounded-2xl p-5 mb-8 border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Order ID</p>
              <p className="text-2xl font-black text-primary tracking-[0.2em]">#{orderRef.slice(-8).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                className="h-12 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all font-black text-[9px] uppercase tracking-[0.3em] shadow-xl"
              >
                <Link to="/account">
                  Track Order
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-white/10 text-white hover:bg-white hover:text-black transition-all font-black text-[9px] uppercase tracking-[0.3em]"
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
        <div className="bg-white min-h-screen pt-14 sm:pt-20 pb-28 sm:pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            {/* Header */}
            <div className="mb-6 sm:mb-10">
              <nav className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-4 whitespace-nowrap overflow-x-auto no-scrollbar">
                <Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-2.5 h-2.5" /> Cart
                </Link>
                <ChevronRight className="w-2.5 h-2.5 shrink-0" />
                <span className="text-primary italic">Checkout</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                Checkout <span className="text-primary italic">Details</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* Form Side */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                {/* Customer details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black shadow-md">01</div>
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-widest">Shipping Info</h2>
                  </div>
                  <div className="grid gap-4 p-4 sm:p-6 rounded-2xl bg-black/5 border border-black/5">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Full Name</Label>
                      <Input
                        placeholder="e.g. John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-12 px-4 bg-white rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Delivery Address</Label>
                      <Input
                        placeholder="House No, Street, City, State, PIN"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="h-12 px-4 bg-white rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black shadow-md">02</div>
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-widest">Order Summary</h2>
                  </div>
                  <div className="p-4 sm:p-6 rounded-2xl bg-black/5 border border-black/5 divide-y divide-black/5">
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

              {/* Summary Side */}
              <div className="lg:col-span-12 xl:col-span-5">
                <div className="sticky top-24 p-5 sm:p-7 rounded-3xl bg-black text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-black uppercase tracking-widest">Summary</h2>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">Cash on Delivery</span>
                    </div>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40">
                          <span className="truncate max-w-[160px]">{item.product.name} [{item.size}] ×{item.quantity}</span>
                          <span className="text-white shrink-0 ml-2">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>Shipping</span>
                        <span className="text-primary italic">Free</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Total</span>
                        <span className="text-2xl sm:text-3xl font-black text-white">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={orderMutation.isPending}
                      className="w-full h-12 sm:h-14 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl"
                    >
                      {orderMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Placing Order...</>
                      ) : (
                        <>Place Order <ChevronRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>

                    <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                      {[
                        { icon: ShieldCheck, label: "Secure" },
                        { icon: Truck, label: "Free Shipping" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 opacity-20">
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
