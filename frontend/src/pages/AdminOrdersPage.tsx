import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Order, OrderStatus } from "@/types";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Package,
  Star,
  Truck,
  Loader2,
  Search,
  ExternalLink,
  User as UserIcon,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminPage";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const STATUS_META: Record<
  OrderStatus,
  { color: string; icon: typeof Clock; label: string; bg: string }
> = {
  Pending: {
    color: "text-amber-700 border-amber-200",
    bg: "bg-amber-50",
    icon: Clock,
    label: "Pending Receipt",
  },
  Confirmed: {
    color: "text-primary border-primary/30",
    bg: "bg-primary/10",
    icon: CheckCircle2,
    label: "Order Confirmed",
  },
  Shipped: {
    color: "text-blue-700 border-blue-200",
    bg: "bg-blue-50",
    icon: Truck,
    label: "In Transit",
  },
  Delivered: {
    color: "text-emerald-700 border-emerald-200",
    bg: "bg-emerald-50",
    icon: Star,
    label: "Delivered",
  },
};

const FILTER_TABS = [
  { label: "All Records", value: "all" },
  ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
];

function formatDate(ts: any) {
  const date = new Date(ts);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(ts: any) {
  const date = new Date(ts);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function OrderDrawerContent({
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

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="h-1.5 bg-primary w-full"></div>
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10">
          <SheetHeader className="text-left space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest ${STATUS_META[order.status].bg} ${STATUS_META[order.status].color}`}>
                {order.status}
              </Badge>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                Order Logged
              </span>
            </div>
            <SheetTitle className="font-display text-4xl font-black italic tracking-tighter">
              Order Details <span className="text-primary tracking-normal not-italic">.</span>
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em] pt-1">
              Ref ID: {order._id}
            </SheetDescription>
          </SheetHeader>

          {/* Customer Intel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <UserIcon className="w-3 h-3" /> Customer Intel
            </div>
            <div className="bg-muted/30 rounded-3xl p-6 border border-border/50">
              <p className="text-sm font-bold text-foreground mb-1">
                {typeof order.user === 'object' ? (order.user as any).name : 'Registered Client'}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {typeof order.user === 'object' ? (order.user as any).email : order.user}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Placement Date</span>
                  <span className="text-xs font-bold">{formatDate(order.createdAt)}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-border" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</span>
                  <span className="text-xs font-bold">{formatTime(order.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <Package className="w-3 h-3" /> Inventory Manifest
            </div>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}-${idx}`}
                  className="flex items-center justify-between p-4 bg-muted/20 border border-border/40 rounded-2xl group hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black italic tracking-tight line-clamp-1">{item.name || `Product ${item.productId.slice(-4)}`}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">
                        Variant: {item.size} <span className="mx-1.5 opacity-30">|</span> Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-display font-black text-sm text-foreground space-x-1">
                    <span className="text-[10px] text-primary">₹</span>
                    <span>{(item.price * item.quantity).toLocaleString()}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-6 bg-card border border-primary/20 rounded-[2rem] shadow-sm mt-6">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Revenue Total</span>
              <span className="font-display font-black text-2xl text-foreground">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Workflow Status */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <Clock className="w-3 h-3" /> Logistics Workflow
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((s) => {
                const m = STATUS_META[s];
                const Icon = m.icon;
                const active = editStatus === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEditStatus(s)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 ${active
                      ? `${m.bg} ${m.color} border-current shadow-sm scale-[1.02]`
                      : "bg-background border-border/60 text-muted-foreground hover:bg-muted/50"
                      }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                    <Icon className={`w-3.5 h-3.5 ${active ? "opacity-100" : "opacity-30"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logistics Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <ClipboardList className="w-3 h-3" /> Logistics Memo
            </div>
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Enter shipping details, tracking IDs, or notes for the client..."
              className="min-h-[120px] bg-muted/30 rounded-[2rem] border-border/50 focus-visible:ring-primary/10 p-6 text-sm resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-center italic">
              Note: These memos are visible to the customer on their account page.
            </p>
          </div>
        </div>
      </ScrollArea>

      <SheetFooter className="p-8 bg-card border-t border-border/30 gap-3 sm:flex-row flex-col">
        <Button variant="ghost" className="rounded-2xl h-12 flex-1 font-bold text-xs uppercase tracking-widest" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="btn-primary rounded-2xl h-12 flex-1 font-bold text-xs uppercase tracking-widest"
          onClick={() => onSave(order._id!, editStatus, editNotes)}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Update"}
        </Button>
      </SheetFooter>
    </div>
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
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: OrderStatus; notes: string }) =>
      api.put(`/orders/${id}/status`, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
      toast.success("Logistics updated", {
        description: "Order status and memos have been successfully synchronized."
      });
      setSelectedOrder(null);
    },
    onError: () => toast.error("Failed to update order architecture"),
  });

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = filterTab === "all" || o.status === filterTab;
      const matchesSearch = o._id?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filterTab, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-background/50 backdrop-blur-sm rounded-[3rem] border border-border/50 shadow-sm">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <p className="mt-6 text-foreground font-display font-semibold text-lg italic">Accessing Ledger</p>
        <p className="text-muted-foreground text-sm">Parsing transaction logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1200px]">
      {/* UI Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
            <span className="w-8 h-[1.5px] bg-primary"></span>
            Order Ledger
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase">
            Fulfillment <span className="text-primary tracking-normal not-italic lowercase">.</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm font-medium leading-relaxed">
            Monitor and manage your sales workflow. Every transaction here represents a commitment to premium street culture.
          </p>
        </div>
      </div>

      {/* Filtration Console */}
      <div className="flex flex-col xl:flex-row items-center gap-4 bg-card/60 backdrop-blur-xl p-5 rounded-[2.5rem] border border-border/40 shadow-sm sticky top-20 z-20 overflow-hidden">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            placeholder="Locate by Reference ID..."
            className="pl-12 h-14 bg-background/40 border-none rounded-3xl focus-visible:ring-1 focus-visible:ring-primary/20 text-sm font-medium italic"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 p-1.5 bg-muted/40 rounded-3xl border border-border/30 overflow-x-auto max-w-full">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterTab(tab.value)}
              className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filterTab === tab.value
                ? "bg-background text-primary shadow-sm scale-105"
                : "text-muted-foreground/60 hover:text-foreground hover:bg-background/20"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fulfillment Deck */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 rounded-[3.5rem] border-dashed border-2 border-border/50 bg-muted/10"
        >
          <ClipboardList className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
          <h2 className="font-display text-xl font-bold uppercase tracking-widest italic">Ledger Clean</h2>
          <p className="text-muted-foreground max-w-xs mx-auto text-xs font-semibold py-2">No transaction records match the current filter.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((order, idx) => {
              const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
              const meta = STATUS_META[order.status];
              return (
                <motion.div
                  layout
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  className="group bg-card hover:bg-muted/40 border border-border/40 hover:border-primary/30 rounded-[2.5rem] p-6 transition-all duration-500 overflow-hidden flex flex-col md:flex-row md:items-center gap-8 shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* Status Pulse */}
                  <div className="flex md:flex-col items-center gap-4 shrink-0 px-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${meta.bg} ${meta.color} shadow-inner`}>
                      <meta.icon className="w-6 h-6" />
                    </div>
                    <div className="md:hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Ref</p>
                      <p className="font-display font-black text-sm uppercase italic">#{order._id?.slice(-6)}</p>
                    </div>
                  </div>

                  {/* Order Intel */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 px-2">
                    <div className="md:flex hidden items-center gap-2 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">#{order._id?.slice(-8)}</p>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{formatDate(order.createdAt)}</p>
                    </div>
                    <h3 className="font-display font-black text-base text-foreground truncate italic group-hover:translate-x-1 transition-transform duration-500">
                      {typeof order.user === 'object' ? (order.user as any).email : 'External Client'}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {order.items.length} Units</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatTime(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Financials & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-10 md:bg-transparent bg-muted/20 p-4 md:p-0 rounded-2xl">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Value</p>
                      <p className="font-display font-black text-xl text-foreground italic space-x-1">
                        <span className="text-[10px] text-primary not-italic tracking-normal">₹</span>
                        <span>{total.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest group-hover:scale-105 transition-transform ${meta.bg} ${meta.color}`}>
                        {order.status}
                      </Badge>
                      <div className="md:flex hidden w-10 h-10 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground items-center justify-center transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-l border-border/30 glass-blur-lg">
          {selectedOrder && (
            <OrderDrawerContent
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
        <div className="bg-background min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminOrdersContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

export default function AdminOrdersPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminOrdersContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
