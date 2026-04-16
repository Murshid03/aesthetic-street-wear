import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Order, OrderStatus, Product } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Truck,
  Loader2,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

// ─── Shared Status Config ────────────────────────────────────────────────────────
export const STATUS_META: Record<OrderStatus, { color: string; icon: any; bg: string; badge: string }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  Confirmed: { color: "text-primary", bg: "bg-primary/10", badge: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  Shipped: { color: "text-blue-700", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
  Delivered: { color: "text-emerald-700", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Star },
  Cancelled: { color: "text-rose-700", bg: "bg-rose-50", badge: "bg-rose-100 text-rose-700 border-rose-200", icon: AlertCircle },
};

export const STATUS_OPTIONS: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export function formatDate(ts: any) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(ts: any) {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ─── Nav Items ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: BarChart3, label: "Dashboard", to: "/admin" },
  { icon: Package, label: "Products", to: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", to: "/admin/orders" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

// ─── Admin Sidebar ────────────────────────────────────────────────────────────────
function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 hidden lg:flex flex-col gap-1 py-6">
      <div className="px-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>Admin Panel</p>
            <p className="text-[10px] text-primary font-semibold tracking-widest uppercase">Control Center</p>
          </div>
        </div>
      </div>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
          activeProps={{ className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-accent text-primary transition-all duration-200" }}
          activeOptions={item.to === "/admin" ? { exact: true } : undefined}
        >
          <item.icon className="w-4 h-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </aside>
  );
}

// ─── Admin Layout ────────────────────────────────────────────────────────────────
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto container-px py-6">
      {/* Mobile navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 lg:hidden scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-card border border-border text-muted-foreground transition-all shrink-0"
            activeProps={{ className: "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground border-transparent shrink-0 shadow-md shadow-primary/20" }}
            activeOptions={item.to === "/admin" ? { exact: true } : undefined}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, colorClass, delay, sub, highlight }: {
  label: string; value: number | string; icon: any; colorClass: string; delay: number; sub: string; highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`card-base p-5 rounded-2xl ${highlight ? "border-primary/30 bg-accent/30" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{sub}</span>
      </div>
      <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
    </motion.div>
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────────
function AdminDashboardContent() {
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["admin_products_stat"],
    queryFn: async () => { const { data } = await api.get("/products"); return data; },
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["admin_orders_stat"],
    queryFn: async () => { const { data } = await api.get("/orders"); return data; },
  });

  const isLoading = isLoadingProducts || isLoadingOrders;
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const recentOrders = [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, sub: "Confirmed orders", icon: TrendingUp, colorClass: "bg-emerald-100 text-emerald-700", delay: 0 },
    { label: "Products", value: products.length, sub: "In catalog", icon: Package, colorClass: "bg-blue-100 text-blue-700", delay: 0.07 },
    { label: "Total Orders", value: orders.length, sub: "All time", icon: ShoppingBag, colorClass: "bg-purple-100 text-purple-700", delay: 0.14 },
    { label: "Pending Orders", value: pendingOrders.length, sub: "Needs attention", icon: Clock, colorClass: "bg-amber-100 text-amber-700", delay: 0.21, highlight: pendingOrders.length > 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-label text-primary mb-1">Overview</p>
        <h1 className="text-heading">{greeting} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Pending Orders Alert */}
      {pendingOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {pendingOrders.length} order{pendingOrders.length > 1 ? "s" : ""} awaiting your action
              </p>
              <p className="text-xs text-amber-700">Confirm or cancel orders placed via WhatsApp</p>
            </div>
          </div>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card-base rounded-2xl p-6">
          <h2 className="text-subheading mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between p-3.5 rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-base rounded-2xl p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-subheading">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
              <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentOrders.map((order, i) => {
                const meta = STATUS_META[order.status] || STATUS_META.Pending;
                const total = order.totalAmount || order.items.reduce((s, x) => s + x.price * x.quantity, 0);
                const userName = typeof order.user === "object" ? (order.user as any).name || (order.user as any).email : "Customer";
                return (
                  <div key={order._id}>
                    <div className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-secondary transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                        <meta.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground">#{order._id?.slice(-6).toUpperCase()} · {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.badge}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {i < recentOrders.length - 1 && <Separator className="mx-2" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-background min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminDashboardContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
