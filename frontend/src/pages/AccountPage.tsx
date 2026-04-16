import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Order, OrderStatus } from "@/types";
import { useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_STEPS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeCls: string; icon: React.ElementType }
> = {
  Pending: {
    label: "Pending",
    badgeCls: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Circle,
  },
  Confirmed: {
    label: "Confirmed",
    badgeCls: "bg-primary/10 text-primary border-primary/30",
    icon: CheckCircle2,
  },
  Shipped: {
    label: "Shipped",
    badgeCls: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Truck,
  },
  Delivered: {
    label: "Delivered",
    badgeCls: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: MapPin,
  },
  Cancelled: {
    label: "Cancelled",
    badgeCls: "bg-rose-100 text-rose-700 border-rose-200",
    icon: Circle,
  },
};

// ─── Status Timeline ──────────────────────────────────────────────────────────

function StatusTimeline({ status }: { status: OrderStatus }) {
  const activeIdx = STATUS_STEPS.indexOf(status);
  return (
    <div
      className="flex items-center gap-0 mt-4"
    >
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= activeIdx;
        const isLast = idx === STATUS_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-smooth ${done
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-border text-muted-foreground"
                  }`}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-tight text-center whitespace-nowrap ${done ? "text-primary" : "text-muted-foreground"}`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-smooth ${idx < activeIdx ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated overflow-hidden"
    >
      {/* Card header — always visible */}
      <button
        type="button"
        className="w-full px-5 py-4 text-left hover:bg-muted/30 transition-smooth"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-sm sm:text-base">
                Order #{order._id?.slice(-6).toUpperCase()}
              </span>
              <Badge
                className={`text-[10px] px-2 py-0.5 font-semibold border ${cfg.badgeCls}`}
              >
                {cfg.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-display font-bold text-base sm:text-lg">
              ₹{total}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Separator />
            <div className="px-5 py-4 space-y-4">
              {/* Items list */}
              <div>
                <p className="text-xs font-semibold text-label text-muted-foreground mb-2">
                  Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.size}-${idx}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {idx + 1}. Item #{item.productId.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-muted-foreground ml-1.5">
                          · Size {item.size} · Qty {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold ml-4 shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="mt-3 mb-2" />
                <div className="flex justify-between font-display font-bold text-sm">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Status timeline */}
              <div>
                <p className="text-xs font-semibold text-label text-muted-foreground mb-1">
                  Order Status
                </p>
                <StatusTimeline status={order.status} />
              </div>

              {/* Admin notes */}
              {order.adminNotes && (
                <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-primary mb-1">
                    Update from us
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {order.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Account Content ──────────────────────────────────────────────────────────

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

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="bg-background min-h-[80vh]">
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              My Account
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your profile and track orders
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card-elevated p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">
                    {user?.name || "Member User"}
                  </p>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 font-semibold">
                    {user?.role === "admin" ? "Store Administrator" : "Active Member"}
                  </Badge>
                </div>
                <p
                  className="text-xs text-muted-foreground mt-0.5 truncate"
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Orders section */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Order History</h2>
              {orders.length > 0 && (
                <Badge className="bg-muted text-muted-foreground border-border ml-auto text-xs">
                  {orders.length} orders
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Retrieving your orders…</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order, i) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                  >
                    <OrderCard order={order} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-elevated py-14 px-6 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/60" />
                </div>
                <p className="font-display font-bold text-lg text-foreground mb-1">
                  No orders yet
                </p>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                  Once you place an order, your full order history and tracking
                  will appear here.
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                  onClick={() => navigate({ to: "/" })}
                >
                  Start Shopping
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function AccountPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <AccountContent />
      </ProtectedRoute>
    </Layout>
  );
}
