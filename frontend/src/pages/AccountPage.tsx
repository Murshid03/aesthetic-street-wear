import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderStatus } from "@/types";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  User as UserIcon,
  Loader2,
  XCircle,
  Eye,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const STATUS_STEPS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  Pending: {
    label: "PENDING",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    icon: Circle,
  },
  Confirmed: {
    label: "CONFIRMED",
    bg: "bg-primary/10",
    text: "text-primary",
    icon: CheckCircle2,
  },
  Shipped: {
    label: "IN TRANSIT",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    icon: Truck,
  },
  Delivered: {
    label: "DELIVERED",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    icon: MapPin,
  },
  Cancelled: {
    label: "CANCELLED",
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    icon: XCircle,
  },
};

function StatusTimeline({ status }: { status: OrderStatus }) {
  const activeIdx = STATUS_STEPS.indexOf(status);
  return (
    <>
      {/* Desktop Horizontal Timeline */}
      <div className="hidden md:flex items-center gap-0 mt-8 mb-4">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= activeIdx;
          const isLast = idx === STATUS_STEPS.length - 1;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${done
                    ? "bg-black border-black text-white shadow-lg"
                    : "bg-white border-black/5 text-black/10"
                    }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-widest ${done ? "text-black" : "text-black/20"}`}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-6 rounded-full transition-all duration-500 ${idx < activeIdx ? "bg-black" : "bg-black/5"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="md:hidden flex flex-col gap-0 mt-4 px-2">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= activeIdx;
          const isLast = idx === STATUS_STEPS.length - 1;
          const current = idx === activeIdx;

          return (
            <div key={step} className="flex gap-4 min-h-[60px]">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0 ${done
                    ? "bg-black border-black text-white"
                    : "bg-white border-black/5 text-black/20 font-black text-[10px]"
                    }`}
                >
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                {!isLast && (
                  <div className={`w-[2px] grow my-1 rounded-full transition-all duration-500 ${idx < activeIdx ? "bg-black" : "bg-black/5"}`} />
                )}
              </div>
              <div className="py-0.5">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${done ? 'text-black' : 'text-black/20'}`}>
                  {step}
                  {current && <span className="ml-3 text-[8px] font-black text-primary italic lowercase tracking-tight">active</span>}
                </span>
                <p className={`text-[8px] font-medium leading-tight mt-1 ${done ? 'text-black/40' : 'text-black/10'}`}>
                  {idx === 0 && "Order placed. We are checking your details."}
                  {idx === 1 && "Order confirmed. We are packing your items."}
                  {idx === 2 && "Picked up by courier. Your order is on the way."}
                  {idx === 3 && "Delivered! Enjoy your new streetwear."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const total = order.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const itemCount = order.items.reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <motion.div
      layout
      className="bg-white border border-black/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between md:justify-start gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/20">Order ID:</span>
                <span className="text-xs font-black uppercase">#{String(order._id).slice(-8).toUpperCase()}</span>
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} shrink-0`}>
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Order Date</span>
                <span className="text-[11px] md:text-xs font-bold text-black">{new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="w-px h-6 bg-black/5" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Total Items</span>
                <span className="text-[11px] md:text-xs font-bold text-black">{itemCount} {itemCount === 1 ? "Item" : "Items"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 pt-5 md:pt-0 border-t md:border-none border-black/5">
            <div className="text-left md:text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1 block">Total Amount</span>
              <span className="text-2xl md:text-3xl font-black text-black">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="h-10 px-5 md:px-6 rounded-full bg-black/5 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all gap-2"
            >
              <span className="hidden md:inline">{expanded ? "View Less" : "Order Details"}</span>
              <span className="md:hidden">{expanded ? "Hide" : "Details"}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${expanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pt-8 md:pt-10 space-y-6 md:space-y-10">
                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-black/5">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20 italic">Items Ordered</span>
                    <div className="grow h-[1px] bg-black/5" />
                  </div>
                  <div className="grid gap-3 md:gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-black/5 group hover:bg-black/10 transition-colors">
                        <div className="w-12 h-16 md:w-16 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-muted group-hover:shadow-lg transition-all duration-500 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-tight text-black truncate mb-0.5 md:mb-1">{item.name}</p>
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-[8px] md:text-[9px] font-black uppercase text-black/40 tracking-widest">{item.size}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-black/10" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase text-black/40 tracking-widest">{item.quantity}x</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs md:text-sm font-black text-black">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "Cancelled" ? (
                  <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-rose-50 border border-rose-100 space-y-3">
                    <div className="flex items-center gap-3 text-rose-600">
                      <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">Order Cancelled</span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-rose-800 italic leading-relaxed">
                      "{order.adminNotes || "This order has been cancelled by the administrator."}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 md:space-y-10">
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-black/5 border border-black/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-black/20 block mb-6 px-1 italic">Order Progress:</span>
                      <StatusTimeline status={order.status} />
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {order.trackingId && (
                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4">
                          <div className="flex items-center gap-3 text-primary">
                            <Truck className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Shipping: Tracking ID</span>
                          </div>
                          <div className="p-4 md:p-5 bg-white/80 rounded-xl md:rounded-2xl border border-primary/10 shadow-sm">
                            <p className="text-base md:text-lg font-black tracking-[0.2em] font-mono text-black">
                              {order.trackingId}
                            </p>
                          </div>
                          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary/40 italic leading-tight">Use this ID on the selected courier's portal to track your delivery.</p>
                        </div>
                      )}

                      {order.adminNotes && (
                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-black/5 border border-black/5 space-y-3">
                          <div className="flex items-center gap-3 text-black/60">
                            <Package className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Update</span>
                          </div>
                          <p className="text-xs md:text-sm font-medium text-black/60 leading-relaxed italic pl-1">
                            "{order.adminNotes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AccountContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("orders");

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["my_orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/my");
      return data;
    },
  });

  const queryClient = useQueryClient();
  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate({ to: "/" });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── Editorial Header (Desktop/Tablet) ────────────────────────── */}
      <section className="hidden md:block pt-20 lg:pt-32 pb-12 lg:pb-20 bg-white border-b border-black/5">
        <div className="container mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-center md:justify-start gap-2 lg:gap-3 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-6 lg:mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-primary italic">Account</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 lg:gap-10">
            <div className="max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4 lg:mb-6">
                <div className="w-8 lg:w-12 h-[2px] bg-primary" />
                <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-primary">Account Overview</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-display)" }}>
                MY <br /> <span className="text-primary italic">PROFILE</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="h-14 px-10 rounded-full border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile Context Header ────────────────────────────────────── */}
      <section className="md:hidden pt-28 pb-10 px-6 bg-black text-white rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 p-1.5 relative">
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-black">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-tight mb-1 truncate" style={{ fontFamily: "var(--font-display)" }}>
                {user?.name || "User"}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 truncate max-w-[180px]">{user?.email}</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}
            >
              <Package className="w-3.5 h-3.5" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-black shadow-xl' : 'text-white/40'}`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Profile
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <section className="py-12 lg:py-20 bg-white pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Desktop Layout (Grid) */}
          <div className="hidden md:grid lg:grid-cols-12 gap-20">
            {/* Profile Snapshot */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-10 rounded-[2.5rem] bg-black text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />
                <div className="relative z-10 space-y-8">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-2 relative">
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-black">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight">{user?.name || "Premium Member"}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 truncate">{user?.email}</p>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Account Type</span>
                      <span className="text-primary">{user?.role === "admin" ? "Administrator" : "Member"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Status</span>
                      <span className="text-white italic">Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-12 p-10 rounded-[2.5rem] border border-black/5 bg-white space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Account Info</span>
                </div>
                <p className="text-sm font-medium text-black/40 leading-relaxed italic">"Your order history and account details are managed here securely. We value your privacy and security."</p>
              </div>
            </div>

            {/* History Section */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-[2px] bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>ORDER HISTORY</h2>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-6">
                  <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center bg-black/5 rounded-[2.5rem] p-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-8">
                    <Package className="w-8 h-8 text-black/10" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4">No Orders Found</h3>
                  <p className="text-black/40 text-sm font-medium mb-10 max-w-sm mx-auto">You haven't placed any orders yet. Explore our collections to start your first order.</p>
                  <Button asChild className="h-16 px-12 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.4em]">
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout (Tabview) */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>Order History</h3>
                    <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">{orders.length} Orders</span>
                  </div>

                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-6">
                      <div className="w-10 h-10 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center bg-black/5 rounded-[2.5rem] p-8">
                      <Package className="w-10 h-10 text-black/10 mx-auto mb-6" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-8">No orders yet.</p>
                      <Button asChild className="w-full h-14 rounded-2xl bg-black">
                        <Link to="/">Explore Collection</Link>
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 mb-10">
                    <h3 className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>Profile Information</h3>
                    <p className="text-xs text-black/40 font-medium">Manage your personal account details.</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="p-6 rounded-3xl bg-black/5 border border-black/5 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/20">Full Name</p>
                      <p className="text-sm font-black text-black">{user?.name}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-black/5 border border-black/5 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/20">Email Address</p>
                      <p className="text-sm font-black text-black truncate">{user?.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-3xl bg-black/5 border border-black/5 space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/20">Membership</p>
                        <p className="text-sm font-black text-primary uppercase">{user?.role}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-black/5 border border-black/5 space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/20">Status</p>
                        <p className="text-sm font-black text-emerald-500 uppercase italic">Active</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10">
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full h-16 rounded-2xl border-black/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <AccountContent />
      </ProtectedRoute>
    </Layout>
  );
}
