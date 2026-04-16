import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Order, OrderStatus } from "@/types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Truck,
  Star,
  Loader2,
  Search,
  User as UserIcon,
  MapPin,
  AlertCircle,
  ChevronRight,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminLayout, STATUS_META, STATUS_OPTIONS, formatDate, formatTime } from "./AdminPage";
import { motion, AnimatePresence } from "motion/react";

const FILTER_TABS = [
  { label: "All", value: "all" },
  ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
];

// ─── Order Detail Sheet ───────────────────────────────────────────────────────────
function OrderDetailSheet({
  order,
  onSave,
  onClose,
  isSaving,
}: {
  order: Order;
  onSave: (id: string, status: OrderStatus, notes: string) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [editStatus, setEditStatus] = useState<OrderStatus>(order.status);
  const [editNotes, setEditNotes] = useState(order.adminNotes || "");
  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const userName = typeof order.user === "object" ? (order.user as any).name || "Customer" : "Customer";
  const userEmail = typeof order.user === "object" ? (order.user as any).email : "";

  const isPending = order.status === "Pending";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top accent */}
      <div className="h-1 gradient-primary w-full" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <SheetHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_META[order.status].badge}`}>
                {order.status}
              </span>
            </div>
            <SheetTitle className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
              Order #{order._id?.slice(-8).toUpperCase()}
            </SheetTitle>
            <p className="text-xs text-muted-foreground">
              Placed {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
            </p>
          </SheetHeader>

          {/* WhatsApp Confirm/Cancel buttons — only for Pending */}
          {isPending && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-700" />
                <p className="text-sm font-semibold text-amber-900">Awaiting WhatsApp Confirmation</p>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                After confirming the order with the customer on WhatsApp, update the status below.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setEditStatus("Confirmed");
                    onSave(order._id!, "Confirmed", editNotes);
                  }}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setEditStatus("Cancelled");
                    onSave(order._id!, "Cancelled", editNotes);
                  }}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 h-10 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Customer info */}
          <div className="card-base rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" /> Customer
            </h3>
            <div>
              <p className="text-sm font-semibold text-foreground">{userName}</p>
              {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
            </div>
            {order.customerName && order.customerName !== userName && (
              <div>
                <p className="text-xs text-muted-foreground">Name given at checkout</p>
                <p className="text-sm font-medium">{order.customerName}</p>
              </div>
            )}
            {order.deliveryAddress && (
              <div className="flex items-start gap-2 pt-2 border-t border-border">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{order.deliveryAddress}</p>
              </div>
            )}
          </div>

          {/* Order items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Items ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}-${idx}`}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                >
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-3 py-3 bg-accent rounded-xl">
              <span className="text-sm font-semibold text-primary">Order Total</span>
              <span className="text-base font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Update Status — for non-pending orders */}
          {!isPending && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Update Status
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.filter(s => s !== "Pending").map((s) => {
                  const m = STATUS_META[s];
                  const Icon = m.icon;
                  const active = editStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditStatus(s)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${active
                          ? `${m.bg} ${m.color} border-current`
                          : "bg-secondary border-border text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Notes for Customer
            </h3>
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add tracking ID, delivery updates, or any notes…"
              className="resize-none min-h-[100px] bg-secondary border-border rounded-xl text-sm focus-visible:ring-primary/20"
            />
            <p className="text-[10px] text-muted-foreground">These notes are visible to the customer on their account.</p>
          </div>
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="p-4 border-t border-border bg-white flex gap-3">
        <button
          onClick={onClose}
          className="btn-secondary flex-1 h-11 flex items-center justify-center"
        >
          Close
        </button>
        {!isPending && (
          <button
            onClick={() => onSave(order._id!, editStatus, editNotes)}
            disabled={isSaving}
            className="btn-primary flex-1 h-11 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Order Row Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const meta = STATUS_META[order.status];
  const userName = typeof order.user === "object" ? (order.user as any).name || (order.user as any).email : "Customer";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="card-base rounded-2xl p-4 hover:shadow-md cursor-pointer hover:border-primary/20 transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        {/* Status icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
          <meta.icon className="w-4.5 h-4.5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.badge}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            #{order._id?.slice(-8).toUpperCase()} · {formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </p>
          {order.deliveryAddress && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {order.deliveryAddress}
            </p>
          )}
        </div>

        {/* Amount + arrow */}
        <div className="text-right shrink-0 flex items-center gap-3">
          <p className="text-sm font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Orders Content ───────────────────────────────────────────────────────────────
function AdminOrdersContent() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterTab, setFilterTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["admin_orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data;
    },
    refetchInterval: 30000, // auto-refresh every 30s
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: OrderStatus; notes: string }) =>
      api.put(`/orders/${id}/status`, { status, adminNotes: notes }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin_orders_stat"] });
      toast.success(`Order ${vars.status.toLowerCase()}`, {
        description: `Order #...${vars.id.slice(-6)} has been updated to ${vars.status}.`,
      });
      setSelectedOrder(null);
    },
    onError: () => toast.error("Failed to update order status"),
  });

  const filtered = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesTab = filterTab === "all" || o.status === filterTab;
        const q = searchQuery.toLowerCase();
        const userName = typeof o.user === "object" ? ((o.user as any).name || (o.user as any).email || "").toLowerCase() : "";
        const matchesSearch = !q || o._id?.toLowerCase().includes(q) || userName.includes(q);
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filterTab, searchQuery]);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-label text-primary mb-1">Management</p>
          <h1 className="text-heading">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} total orders · {pendingCount} pending
          </p>
        </div>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-sm font-medium text-amber-900">
            <strong>{pendingCount}</strong> order{pendingCount > 1 ? "s" : ""} waiting for confirmation after WhatsApp chat.
            Confirm or cancel these to update the customer's order status.
          </p>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search by order ID or customer name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterTab(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${filterTab === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
            >
              {tab.label}
              {tab.value === "Pending" && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full inline-flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            {searchQuery ? "No orders match your search" : "No orders in this category"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Order Detail Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l border-border">
          {selectedOrder && (
            <OrderDetailSheet
              key={selectedOrder._id}
              order={selectedOrder}
              onSave={(id, status, notes) => updateMutation.mutate({ id, status, notes })}
              onClose={() => setSelectedOrder(null)}
              isSaving={updateMutation.isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-background min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminOrdersContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
