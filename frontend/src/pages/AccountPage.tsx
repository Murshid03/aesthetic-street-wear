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
    label: "ARCHIVING",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    icon: Circle,
  },
  Confirmed: {
    label: "AUTHENTICATED",
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
    label: "DISPATCHED",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    icon: MapPin,
  },
  Cancelled: {
    label: "EXPIRED",
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    icon: XCircle,
  },
};

function StatusTimeline({ status }: { status: OrderStatus }) {
  const activeIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-8 mb-4">
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
                className={`text-[9px] font-black uppercase tracking-widest ${done ? "text-black" : "text-black/20"}`}
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
      className="bg-white border border-black/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl"
    >
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20">Archived ID:</span>
              <span className="text-xs font-black uppercase">#{String(order._id).slice(-8).toUpperCase()}</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Time Signature</span>
                <span className="text-xs font-bold text-black">{new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="w-px h-8 bg-black/5" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Inventory Sum</span>
                <span className="text-xs font-bold text-black">{itemCount} Artifacts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1 block">Logistics Value</span>
              <span className="text-3xl font-black text-black">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="h-10 px-6 rounded-full bg-black/5 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all gap-2"
            >
              {expanded ? "Collapse Archive" : "Expand Artifacts"}
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
              <div className="pt-10 space-y-8">
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 pb-4 border-b border-black/5">Artifact Specification:</div>
                  <div className="grid gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl bg-black/5 group hover:bg-black/10 transition-colors">
                        <div className="w-16 h-20 rounded-2xl overflow-hidden bg-muted group-hover:shadow-lg transition-all duration-500">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">{item.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase text-black/40 tracking-widest">Fit: {item.size}</span>
                            <span className="w-1 h-1 rounded-full bg-black/10" />
                            <span className="text-[9px] font-black uppercase text-black/40 tracking-widest">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-black">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "Cancelled" ? (
                  <div className="p-8 rounded-[2rem] bg-rose-50 border border-rose-100 space-y-4">
                    <div className="flex items-center gap-3 text-rose-600">
                      <XCircle className="w-5 h-5" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Session Expired / Terminated</span>
                    </div>
                    <p className="text-sm font-medium text-rose-800 italic leading-relaxed">
                      "{order.adminNotes || "Project trajectory terminated by administrative override."}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="p-8 rounded-[2rem] bg-black/5 border border-black/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/20 block mb-6 px-1">Trajectory Status:</span>
                      <StatusTimeline status={order.status} />
                    </div>

                    {order.adminNotes && (
                      <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                          <Package className="w-4 h-4" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Command Communiqué</span>
                        </div>
                        <p className="text-sm font-medium text-black/60 leading-relaxed">
                          {order.adminNotes}
                        </p>
                      </div>
                    )}
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
      {/* ── Editorial Header ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-white border-b border-black/5">
        <div className="container mx-auto container-px">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Hub</Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-primary italic">Identity Portal</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-primary" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Authorized Session</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-display)" }}>
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
                Terminate Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto container-px">
          <div className="grid lg:grid-cols-12 gap-20">
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
                    <h3 className="text-xl font-black uppercase tracking-tight">{user?.name || "Archetype Member"}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 truncate">{user?.email}</p>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Classification</span>
                      <span className="text-primary">{user?.role === "admin" ? "Systems Admin" : "Vanguard Member"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Status</span>
                      <span className="text-white italic">Authorized . Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-12 p-10 rounded-[2.5rem] border border-black/5 bg-white space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Sector</span>
                </div>
                <p className="text-sm font-medium text-black/40 leading-relaxed italic">"Logistics coordinates and communication fragments are managed per individual dispatch. Security remains our priority."</p>
              </div>
            </div>

            {/* History Section */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-[2px] bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>ARCHIVE HISTORY</h2>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-6">
                  <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Syncing Dispatch History...</p>
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
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Trajectory Vacant</h3>
                  <p className="text-black/40 text-sm font-medium mb-10 max-w-sm mx-auto">No dispatch sequences have been initialized. Explore the archive to begin your collection trajectory.</p>
                  <Button asChild className="h-16 px-12 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.4em]">
                    <Link to="/shirts">Initialize Procurement</Link>
                  </Button>
                </div>
              )}
            </div>
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
