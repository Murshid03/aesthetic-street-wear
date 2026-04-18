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
  ArrowRight,
  Activity,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminLayout, STATUS_META, STATUS_OPTIONS, formatDate } from "./AdminPage";
import { motion, AnimatePresence } from "motion/react";

const FILTER_TABS = [
  { label: "ALL", value: "all" },
  ...STATUS_OPTIONS.map((s) => ({ label: s.toUpperCase(), value: s })),
];

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
  const total = order.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const userName = order.customerName || (typeof order.user === "object" ? (order.user as any).name || "Vanguard Member" : "Vanguard Member");

  const isPending = order.status === "Pending";

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-2 bg-primary w-full" />

      <ScrollArea className="flex-1">
        <div className="p-10 space-y-12">
          <SheetHeader className="text-left space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Manifest Details</span>
            </div>
            <SheetTitle className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
              #{order._id?.slice(-8).toUpperCase()} <br /> <span className="text-primary italic">SPECIFICATION</span>
            </SheetTitle>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/30">
              <span>Created: {formatDate(order.createdAt)}</span>
              <span className="w-1 h-1 rounded-full bg-black/10" />
              <span>Status: {order.status}</span>
            </div>
          </SheetHeader>

          {isPending && (
            <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 space-y-6">
              <div className="flex items-center gap-3 text-amber-600">
                <MessageCircle className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Operational Verification Needed</span>
              </div>
              <p className="text-sm font-medium text-amber-800/60 leading-relaxed italic">
                "Confirm procurement sequence via WhatsApp before finalizing administrative status."
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onSave(order._id!, "Confirmed", editNotes)}
                  disabled={isSaving}
                  className="h-14 bg-black text-white hover:bg-primary transition-all text-[10px] font-black uppercase tracking-widest rounded-full flex items-center justify-center gap-2"
                >
                  Confirm Sequence
                </button>
                <button
                  onClick={() => onSave(order._id!, "Cancelled", editNotes)}
                  disabled={isSaving}
                  className="h-14 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-full flex items-center justify-center gap-2"
                >
                  Terminate
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <UserIcon className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Member Identity</span>
            </div>
            <div className="p-8 rounded-[2rem] bg-black/5 border border-black/5 space-y-2">
              <p className="text-lg font-black uppercase tracking-tight text-black">{userName}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/20">{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Artifact Loadout</span>
            </div>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-black/5 group">
                  <div className="w-14 h-18 rounded-xl overflow-hidden bg-muted group-hover:shadow-lg transition-all duration-500">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1 truncate">{item.name}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-black/30">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-black">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="p-8 rounded-[2rem] bg-black text-white flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Manifest Sum</span>
              <span className="text-3xl font-black italic">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {!isPending && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Operational Status</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STATUS_OPTIONS.filter(s => s !== "Pending").map((s) => {
                  const active = editStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setEditStatus(s)}
                      className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${active
                        ? "bg-black text-white border-black shadow-xl scale-[1.02]"
                        : "bg-white border-black/5 text-black/40 hover:border-black/20 hover:text-black"
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Communication Fragment</span>
            </div>
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Dispatches manifest notes to member terminal..."
              className="min-h-[150px] p-6 bg-black/5 rounded-[2rem] border-2 border-transparent focus:border-black transition-all text-sm font-bold resize-none"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-10 border-t border-black/5 bg-white flex gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="h-16 rounded-full flex-1 border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          Discard
        </Button>
        {!isPending && (
          <Button
            onClick={() => onSave(order._id!, editStatus, editNotes)}
            disabled={isSaving}
            className="h-16 rounded-full flex-[2] bg-black text-white hover:bg-primary transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.4em] shadow-xl"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "APPLY CHANGES"}
          </Button>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const total = order.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const meta = STATUS_META[order.status];
  const userName = order.customerName || (typeof order.user === "object" ? (order.user as any).name || "Vanguard Member" : "Vanguard Member");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-8 rounded-[2.5rem] bg-white border border-black/5 hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col md:flex-row items-center gap-10"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color} group-hover:scale-110 transition-transform`}>
        <meta.icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <span className="text-[8px] font-black uppercase tracking-widest text-black/20">#{order._id?.slice(-8).toUpperCase()}</span>
          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${meta.badge}`}>{order.status}</span>
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-black truncate">{userName}</h3>
        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black/40">
            <Clock className="w-3 h-3" />
            {formatDate(order.createdAt)}
          </div>
          <span className="w-1 h-1 rounded-full bg-black/10" />
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black/40">
            <Package className="w-3 h-3" />
            {order.items.length} Artifacts
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 shrink-0">
        <div className="text-center md:text-right">
          <span className="text-[8px] font-black uppercase tracking-widest text-black/20 block mb-1">Valuation Sum</span>
          <p className="text-2xl font-black text-black">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/20 group-hover:bg-black group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5" />
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
    mutationFn: ({ id, status, notes }: { id: string; status: OrderStatus; notes: string }) =>
      api.put(`/orders/${id}/status`, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
      toast.success("Manifest Updated");
      setSelectedOrder(null);
    },
    onError: () => toast.error("Sync Protocol Failure"),
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
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Syncing Manifests...</p>
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
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Logistics . Command</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>MANIFEST <br /> <span className="text-primary italic text-4xl md:text-6xl">HISTORY</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Active Queue</span>
            <span className="text-xs font-black uppercase">{orders.length} total . {pendingCount} PENDING</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-12 xl:col-span-5 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
          <Input
            placeholder="Search Manifest ID or Name..."
            className="h-16 pl-14 pr-6 bg-black/5 rounded-3xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="lg:col-span-12 xl:col-span-7 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterTab(tab.value)}
              className={`px-6 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 relative ${filterTab === tab.value
                ? "bg-black text-white border-black shadow-xl"
                : "bg-white border-black/5 text-black/40 hover:border-black/20 hover:text-black"
                }`}
            >
              {tab.label}
              {tab.value === "Pending" && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] flex items-center justify-center rounded-full animate-bounce">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-40 text-center bg-black/5 rounded-[3rem]">
          <Package className="w-12 h-12 text-black/10 mx-auto mb-8" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">No matching manifests found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
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

      {/* Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-none shadow-2xl">
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
