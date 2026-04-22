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
  { icon: BarChart3, label: "DASHBOARD", to: "/admin" },
  { icon: Package, label: "PRODUCTS", to: "/admin/products" },
  { icon: ShoppingBag, label: "ORDERS", to: "/admin/orders" },
  { icon: Settings, label: "SETTINGS", to: "/admin/settings" },
];

function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-1 py-10 sticky top-24 self-start">
      <div className="px-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-black uppercase tracking-[0.2em]">ADMIN PANEL</p>
            <p className="text-[11px] text-primary font-black tracking-widest uppercase italic">V.2.6.0</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:bg-black/5 hover:text-black transition-all duration-300 group"
            activeProps={{ className: "flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white shadow-xl translate-x-1" }}
            activeOptions={item.to === "/admin" ? { exact: true } : undefined}
          >
            <item.icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto container-px py-10">
      {/* Mobile navigation */}
      <div className="flex gap-2 overflow-x-auto pb-6 mb-8 lg:hidden no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white border border-black/5 text-black/40 transition-all shrink-0"
            activeProps={{ className: "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-black text-white border-transparent shrink-0 shadow-xl" }}
            activeOptions={item.to === "/admin" ? { exact: true } : undefined}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, bgClass, textClass, delay, sub, highlight }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`p-8 rounded-[2rem] bg-white border border-black/5 transition-all duration-500 hover:shadow-2xl relative overflow-hidden group ${highlight ? "ring-2 ring-primary ring-offset-4 ring-offset-white" : ""}`}
    >
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
        <Icon className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass} ${textClass} shadow-inner`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20">{sub}</span>
        </div>
        <p className="text-4xl font-black text-black leading-none mb-2" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{label}</p>
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
    { label: "NET REVENUE", value: `₹${totalRevenue.toLocaleString("en-IN")}`, sub: "TOTAL FLOW", icon: TrendingUp, bgClass: "bg-emerald-500/10", textClass: "text-emerald-600", delay: 0 },
    { label: "ACTIVE PRODUCTS", value: products.length, sub: "INVENTORY", icon: Package, bgClass: "bg-blue-500/10", textClass: "text-blue-600", delay: 0.1 },
    { label: "TOTAL ORDERS", value: orders.length, sub: "HISTORY", icon: ShoppingBag, bgClass: "bg-purple-500/10", textClass: "text-purple-600", delay: 0.2 },
    { label: "PENDING ORDERS", value: pendingOrders.length, sub: "ATTENTION", icon: Clock, bgClass: "bg-amber-500/20", textClass: "text-amber-600", delay: 0.3, highlight: pendingOrders.length > 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Overview</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>ADMIN <br /> <span className="text-primary italic">DASHBOARD</span></h1>
        </div>
        <div className="hidden xl:flex items-center gap-8 text-right">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Operational Pulse</span>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Systems Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Recent Orders */}
        <div className="xl:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">RECENT ORDERS</h2>
            </div>
            <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-black/5 hover:bg-black hover:text-white transition-all">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.Pending;
              const total = order.totalAmount || order.items.reduce((s, x) => s + x.price * x.quantity, 0);
              const userName = typeof order.user === "object" ? (order.user as any).name || (order.user as any).email : order.customerName || "Member";
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-3xl bg-white border border-black/5 hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color} group-hover:scale-105 transition-transform`}>
                      <meta.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black truncate">{userName}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black/20">#{order._id?.slice(-8).toUpperCase()}</span>
                        <span className="w-1 h-1 rounded-full bg-black/10" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black/20">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-right space-y-2">
                      <p className="text-xl font-black text-black">₹{total.toLocaleString("en-IN")}</p>
                      <Badge className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none ${meta.badge}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <Link to="/admin/orders" className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/20 hover:bg-black hover:text-white transition-all shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Config */}
        <div className="xl:col-span-4 space-y-10">
          <div className="flex items-center gap-4">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tight">QUICK LINKS</h2>
          </div>
          <div className="grid gap-4">
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="p-8 rounded-[2rem] bg-black text-white hover:bg-primary transition-all duration-500 group flex items-start justify-between relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-12 -translate-y-12" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">{item.label}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Full sector access</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 group-hover:translate-x-2 group-hover:text-white transition-all" />
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
