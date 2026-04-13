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
} from "lucide-react";
import { motion } from "motion/react";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-primary/10 text-primary border-primary/30",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STATUS_ICONS: Record<OrderStatus, any> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Shipped: Truck,
  Delivered: Star,
};

const NAV_ITEMS = [
  {
    icon: BarChart3,
    label: "Dashboard",
    to: "/admin",
    ocid: "admin-nav-dashboard",
  },
  {
    icon: Package,
    label: "Products",
    to: "/admin/products",
    ocid: "admin-nav-products",
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    to: "/admin/orders",
    ocid: "admin-nav-orders",
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/admin/settings",
    ocid: "admin-nav-settings",
  },
];

function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 hidden lg:flex flex-col gap-1 pt-2">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
          activeProps={{
            className:
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-smooth",
          }}
        >
          <item.icon className="w-4 h-4 shrink-0" />
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
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-elevated p-5 flex items-center gap-4"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
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
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  const recentOrders = [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-primary/10 text-primary",
      delay: 0,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700",
      delay: 0.05,
    },
    {
      label: "Pending",
      value: pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
      delay: 0.1,
    },
    {
      label: "Completed",
      value: deliveredOrders,
      icon: Star,
      color: "bg-emerald-50 text-emerald-700",
      delay: 0.15,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Calculating statistics…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-8">
        <p className="text-label text-primary mb-1">Overview</p>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back — here's what's happening in your store.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick links */}
        <div className="card-elevated p-5 lg:col-span-1">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-smooth text-sm font-medium group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">No recent orders yet.</p>
            ) : (
              recentOrders.map((order, i) => {
                const StatusIcon = STATUS_ICONS[order.status];
                const total = order.items.reduce(
                  (s, x) => s + x.price * x.quantity,
                  0,
                );
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <StatusIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Order #{order._id?.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground truncate font-mono">
                          {typeof order.user === 'object' ? order.user.email : order.user}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">₹{total}</p>
                        <Badge
                          className={`text-[10px] px-1.5 py-0.5 ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    {i < recentOrders.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Mobile nav */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-smooth shrink-0"
            activeProps={{
              className:
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-primary/10 text-primary shrink-0",
            }}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-8">
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
        <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminDashboardContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
