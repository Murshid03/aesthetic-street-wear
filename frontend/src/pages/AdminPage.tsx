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
  User as UserIcon,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STATUS_META: Record<OrderStatus, { color: string; icon: any; bg: string }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  Confirmed: { color: "text-primary", bg: "bg-primary/10", icon: CheckCircle2 },
  Shipped: { color: "text-blue-700", bg: "bg-blue-50", icon: Truck },
  Delivered: { color: "text-emerald-700", bg: "bg-emerald-50", icon: Star },
  Cancelled: { color: "text-rose-700", bg: "bg-rose-50", icon: AlertCircle },
};

const NAV_ITEMS = [
  {
    icon: BarChart3,
    label: "Intelligence",
    to: "/admin",
  },
  {
    icon: Package,
    label: "Inventory",
    to: "/admin/products",
  },
  {
    icon: ShoppingBag,
    label: "Fulfillment",
    to: "/admin/orders",
  },
  {
    icon: Settings,
    label: "Architecture",
    to: "/admin/settings",
  },
];

function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2 py-6">
      <div className="px-3 mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Authenticated</p>
        <p className="text-sm font-bold tracking-tight">Root Administrator</p>
      </div>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 group"
          activeProps={{
            className:
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-primary/10 text-primary transition-all duration-300 shadow-sm",
          }}
        >
          <item.icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
          {item.label}
        </Link>
      ))}
    </aside>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
  subtitle
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  delay: number;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border/40 p-6 rounded-[2.5rem] relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-500"
    >
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 ${color.split(' ')[0]}`} />

      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-display font-black tracking-tighter italic">{value}</h3>
            <span className="text-[10px] font-bold text-primary italic uppercase tracking-widest">{subtitle}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AdminDashboardContent() {
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["admin_products_stat"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["admin_orders_stat"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data;
    },
  });

  const isLoading = isLoadingProducts || isLoadingOrders;

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const recentOrders = [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const stats = [
    {
      label: "Revenue Manifest",
      value: `₹${totalRevenue.toLocaleString()}`,
      subtitle: "Total",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
      delay: 0,
    },
    {
      label: "Inventory Units",
      value: totalProducts,
      subtitle: "Active",
      icon: Package,
      color: "bg-primary/10 text-primary",
      delay: 0.1,
    },
    {
      label: "Fulfillment Cycle",
      value: totalOrders,
      subtitle: "Total",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700",
      delay: 0.2,
    },
    {
      label: "Operational Backlog",
      value: pendingOrders,
      subtitle: "Pending",
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
      delay: 0.3,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-6 text-foreground font-display font-semibold text-lg italic uppercase tracking-widest">Aggregating Intel...</p>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex-1 min-w-0 space-y-12 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
            <span className="w-8 h-[1.5px] bg-primary"></span>
            System Overview
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter text-foreground italic uppercase">
            {greeting} <span className="text-primary tracking-normal not-italic lowercase">.</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg text-sm font-medium leading-relaxed">
            Welcome back to the aesthetic street wear command center. Here's a real-time status of your brand's digital presence.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick actions panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card border border-border/40 p-8 rounded-[3rem] xl:col-span-1 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-display font-black italic text-xl uppercase tracking-tight">Directives</h2>
          </div>
          <div className="space-y-3">
            {NAV_ITEMS.slice(1).map((item, idx) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 hover:bg-muted/50 border border-transparent hover:border-border/60 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold">{item.label} Control</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Fulfillment deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-card border border-border/40 p-8 rounded-[3rem] xl:col-span-2 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display font-black italic text-xl uppercase tracking-tight">Recent Fulfillment</h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all"
            >
              View All Records
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-[2.5rem]">
                <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest italic">Waiting for transactions...</p>
              </div>
            ) : (
              recentOrders.map((order, i) => {
                const meta = STATUS_META[order.status] || STATUS_META.Pending;
                const total = order.totalAmount || order.items.reduce((s, x) => s + x.price * x.quantity, 0);
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (i * 0.1) }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 hover:bg-muted/30 p-2 -m-2 rounded-2xl transition-colors">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${meta.bg} ${meta.color}`}>
                        <meta.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black italic tracking-tight">#{order._id?.slice(-8).toUpperCase()}</p>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate font-mono">
                          {typeof order.user === 'object' ? (order.user as any).email : order.user}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display font-black text-lg italic text-foreground leading-none mb-1">
                          <span className="text-[10px] text-primary not-italic tracking-normal mr-0.5">₹</span>
                          {total.toLocaleString()}
                        </p>
                        <Badge className={`rounded-xl px-2 py-0 text-[9px] font-black uppercase tracking-widest ${meta.bg} ${meta.color}`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    {i < recentOrders.length - 1 && (
                      <Separator className="mt-4 border-border/30" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 lg:px-8">
      {/* Mobile nav console */}
      <div className="flex gap-2 overflow-x-auto py-4 mb-4 lg:hidden scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-card border border-border/40 text-muted-foreground transition-all shrink-0"
            activeProps={{
              className:
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground border-transparent shrink-0 shadow-lg shadow-primary/20",
            }}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <AdminSidebar />
        {children}
      </div>
    </div>
  );
}

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
