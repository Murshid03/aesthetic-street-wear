import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Order, OrderStatus, Product } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
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
  Shield,
  Activity,
  Layers
} from "lucide-react";
import { motion } from "motion/react";

export const STATUS_META: Record<OrderStatus, { color: string; icon: any; bg: string; badge: string }> = {
  Pending: { color: "text-amber-500", bg: "bg-amber-500/10", badge: "bg-amber-500/10 text-amber-600 border-amber-200/20", icon: Clock },
  Confirmed: { color: "text-primary", bg: "bg-primary/10", badge: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  Shipped: { color: "text-blue-500", bg: "bg-blue-500/10", badge: "bg-blue-500/10 text-blue-600 border-blue-200/20", icon: Truck },
  Delivered: { color: "text-emerald-500", bg: "bg-emerald-500/10", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-200/20", icon: Star },
  Cancelled: { color: "text-rose-500", bg: "bg-rose-500/10", badge: "bg-rose-500/10 text-rose-600 border-rose-200/20", icon: AlertCircle },
};

export const STATUS_OPTIONS: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export function formatDate(ts: any) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const NAV_ITEMS = [
  { icon: BarChart3, label: "Dashboard", to: "/admin" },
  { icon: Package, label: "Products", to: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", to: "/admin/orders" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="w-56 shrink-0 hidden lg:flex flex-col gap-1 py-8 sticky top-24 self-start">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">ADMIN PANEL</p>
            <p className="text-[10px] text-primary font-black tracking-widest uppercase italic">V.2.6.0</p>
          </div>
        </div>
      </div>
      <div className="space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-black text-white shadow-lg transition-all duration-300"
                  : "flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-black/40 hover:bg-black/5 hover:text-black transition-all duration-300"
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Mobile navigation - compact tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 lg:hidden no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={
                isActive
                  ? "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider bg-black text-white border border-black shrink-0 whitespace-nowrap shadow-md transition-all"
                  : "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider bg-black/5 text-black/50 border border-black/10 shrink-0 whitespace-nowrap hover:bg-black/10 hover:text-black transition-all"
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 xl:gap-12">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, bgClass, textClass, delay, sub, highlight }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`p-4 sm:p-5 rounded-2xl bg-white border border-black/5 transition-all duration-500 hover:shadow-xl relative overflow-hidden group ${highlight ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : ""}`}
    >
      <div className="absolute -right-3 -bottom-3 w-16 h-16 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
        <Icon className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass} ${textClass} shadow-inner`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-black/20">{sub}</span>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-black leading-none mb-1" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-black/40">{label}</p>
      </div>
    </motion.div>
  );
}

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

  const stats = [
    { label: "Net Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, sub: "TOTAL FLOW", icon: TrendingUp, bgClass: "bg-emerald-500/10", textClass: "text-emerald-600", delay: 0 },
    { label: "Products", value: products.length, sub: "INVENTORY", icon: Package, bgClass: "bg-blue-500/10", textClass: "text-blue-600", delay: 0.08 },
    { label: "Total Orders", value: orders.length, sub: "HISTORY", icon: ShoppingBag, bgClass: "bg-purple-500/10", textClass: "text-purple-600", delay: 0.16 },
    { label: "Pending", value: pendingOrders.length, sub: "ATTENTION", icon: Clock, bgClass: "bg-amber-500/20", textClass: "text-amber-600", delay: 0.24, highlight: pendingOrders.length > 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Admin <span className="text-primary italic">Dashboard</span>
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-black/50">Systems Nominal</span>
        </div>
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-black/8 hover:bg-black hover:text-white transition-all">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentOrders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.Pending;
              const total = order.totalAmount || order.items.reduce((s, x) => s + x.price * x.quantity, 0);
              const userName = typeof order.user === "object" ? (order.user as any).name || (order.user as any).email : order.customerName || "Member";
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-black/5 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                      <meta.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-wide text-black truncate">{userName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-wide text-black/30">#{order._id?.slice(-6).toUpperCase()}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wide text-black/20">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                      <p className="text-sm font-black text-black">₹{total.toLocaleString("en-IN")}</p>
                      <Badge className={`text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-none ${meta.badge}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <Link to="/admin/orders" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/20 hover:bg-black hover:text-white transition-all shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">Quick Links</h2>
          </div>
          <div className="grid grid-cols-3 xl:grid-cols-1 gap-3">
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="p-4 rounded-2xl bg-black text-white hover:bg-primary transition-all duration-400 group flex flex-col sm:flex-row xl:flex-col items-start justify-between relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rotate-45 translate-x-8 -translate-y-8" />
                <div className="relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-black transition-all">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all mt-2 xl:mt-0 relative z-10" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-white min-h-screen">
          <AdminLayout>
            <AdminDashboardContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
