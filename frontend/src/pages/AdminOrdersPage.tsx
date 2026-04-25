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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ArrowRight,
  Activity,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminLayout, STATUS_META, STATUS_OPTIONS, formatDate } from "./AdminPage";
import { motion, AnimatePresence } from "motion/react";

const FILTER_TABS = [
  { label: "All", value: "all" },
  ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
];

function OrderDetailSheet({
  order,
  onSave,
  onClose,
  isSaving,
}: {
  order: Order;
  onSave: (id: string, status: OrderStatus, notes: string, tracking?: string) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [editStatus, setEditStatus] = useState<OrderStatus>(order.status);
  const [editNotes, setEditNotes] = useState(order.adminNotes || "");
  const [editTrackingId, setEditTrackingId] = useState(order.trackingId || "");
  const total = useMemo(() =>
    order.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0),
    [order.items]
  );

  const userName = useMemo(() =>
    order.customerName || (typeof order.user === "object" ? (order.user as any).name || "Customer" : "Customer"),
    [order.customerName, order.user]
  );

  const isPending = order.status === "Pending";

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-1 bg-primary w-full shrink-0" />

      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          <SheetHeader className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px] bg-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-primary">Order Overview</span>
            </div>
            <SheetTitle className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              #{order._id?.slice(-8).toUpperCase()} <span className="text-primary italic">Details</span>
            </SheetTitle>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black/30">
              <span>{formatDate(order.createdAt)}</span>
              <span className="w-1 h-1 rounded-full bg-black/10" />
              <span>{order.status}</span>
            </div>
          </SheetHeader>

          {isPending && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Ready to Confirm?</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSave(order._id!, "Confirmed", editNotes, editTrackingId)}
                  disabled={isSaving}
                  className="h-10 bg-black text-white hover:bg-primary transition-all text-[9px] font-black uppercase tracking-widest rounded-full"
                >
                  Confirm
                </button>
                <button
                  onClick={() => onSave(order._id!, "Cancelled", editNotes, editTrackingId)}
                  disabled={isSaving}
                  className="h-10 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Customer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest">Customer</span>
            </div>
            <div className="p-4 rounded-xl bg-black/5 border border-black/5">
              <p className="text-sm font-black uppercase tracking-tight text-black">{userName}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-black/30 mt-1">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest">Order Items</span>
            </div>
            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5">
                  <div className="w-9 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider text-black truncate">{item.name}</p>
                    <p className="text-[8px] font-bold uppercase text-black/40 mt-0.5">{item.size} · {item.quantity}x</p>
                  </div>
                  <p className="text-[10px] font-black text-black shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-2xl bg-black text-white flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Total</span>
              <span className="text-lg font-black italic">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Update Status */}
          {!isPending && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Update Status</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.filter(s => s !== "Pending").map((s) => {
                  const active = editStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setEditStatus(s)}
                      className={`px-3 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${active
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/8 text-black/40 hover:border-black/15"
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4 pt-3 border-t border-black/5">
                {editStatus === "Shipped" && (
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Truck className="w-3 h-3" /> Tracking Number
                    </span>
                    <Input
                      value={editTrackingId}
                      onChange={(e) => setEditTrackingId(e.target.value)}
                      placeholder="Enter Tracking ID..."
                      className="h-11 px-4 bg-white rounded-xl border-black/8 focus:border-primary transition-all text-sm font-bold"
                    />
                    <p className="text-[8px] font-bold text-primary/40 italic">Sent to customer instantly.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Admin Note</span>
                  </div>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes for the customer..."
                    className="min-h-[72px] p-3 bg-black/5 rounded-xl border-none text-sm font-bold resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="p-4 border-t border-black/5 bg-white flex gap-2 shrink-0 safe-bottom">
        <Button
          variant="outline"
          onClick={onClose}
          className="h-12 rounded-full flex-1 border-black/10 text-[9px] font-black uppercase tracking-widest touch-target"
        >
          Close
        </Button>
        {!isPending && (
          <Button
            onClick={() => onSave(order._id!, editStatus, editNotes, editTrackingId)}
            disabled={isSaving}
            className="h-12 rounded-full flex-[2] bg-primary text-white hover:bg-black transition-all duration-300 font-bold text-[9px] uppercase tracking-widest shadow-lg touch-target"
          >
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Apply Update"}
          </Button>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const total = order.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const meta = STATUS_META[order.status];
  const userName = order.customerName || (typeof order.user === "object" ? (order.user as any).name || "Customer" : "Customer");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-3.5 sm:p-5 rounded-2xl bg-white border border-black/5 hover:shadow-xl transition-all duration-400 group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
          <meta.icon className="w-4 h-4" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[7px] font-black uppercase tracking-widest text-black/25">#{order._id?.slice(-6).toUpperCase()}</span>
            <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.badge}`}>{order.status}</span>
          </div>
          <h3 className="text-sm font-black uppercase tracking-tight text-black truncate leading-tight">{userName}</h3>
          <div className="flex items-center gap-2.5 text-[8px] font-bold uppercase tracking-wide text-black/30">
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatDate(order.createdAt)}
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Package className="w-2.5 h-2.5" />
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </div>
          </div>
        </div>

        {/* Amount + Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-base sm:text-lg font-black text-black">₹{total.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/20 group-hover:bg-black group-hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes, tracking }: { id: string; status: OrderStatus; notes: string; tracking?: string }) =>
      api.put(`/orders/${id}/status`, { status, adminNotes: notes, trackingId: tracking }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
      toast.success("Order updated successfully");
      setSelectedOrder(null);
    },
    onError: () => toast.error("Failed to update order status"),
  });

  const filtered = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesTab = filterTab === "all" || o.status === filterTab;
        const q = searchQuery.toLowerCase();
        const userName = (o.customerName || (typeof o.user === "object" ? (o.user as any).name || "" : "")).toLowerCase();
        const matchesSearch = !q || o._id?.toLowerCase().includes(q) || userName.includes(q);
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filterTab, searchQuery]);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Order <span className="text-primary italic">History</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <span className="text-[8px] font-black uppercase tracking-widest text-black/20">Active Orders</span>
            <span className="text-[10px] font-black uppercase">{orders.length} total · {pendingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/25 group-focus-within:text-black transition-colors" />
          <Input
            placeholder="Search by name or order ID..."
            className="h-11 pl-10 pr-4 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterTab(tab.value)}
              className={`px-3.5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border transition-all duration-400 relative ${filterTab === tab.value
                ? "bg-black text-white border-black shadow-md"
                : "bg-white border-black/8 text-black/40 hover:border-black/20 hover:text-black"
                }`}
            >
              {tab.label}
              {tab.value === "Pending" && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-white text-[7px] flex items-center justify-center rounded-full animate-bounce">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center bg-black/5 rounded-3xl">
          <Package className="w-10 h-10 text-black/10 mx-auto mb-4" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">No matching orders found.</p>
        </div>
      ) : (
        <div className="grid gap-2.5">
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

      {/* Detail Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md h-full p-0 border-none shadow-2xl">
          {selectedOrder && (
            <OrderDetailSheet
              key={selectedOrder._id}
              order={selectedOrder}
              onSave={(id, status, notes, tracking) => updateMutation.mutate({ id, status, notes, tracking })}
              onClose={() => setSelectedOrder(null)}
              isSaving={updateMutation.isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-white min-h-screen">
          <AdminLayout>
            <AdminOrdersContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
