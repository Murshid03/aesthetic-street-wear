import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout, MOCK_RECENT_ORDERS } from "./AdminPage";

// Extended mock orders for the orders page
const EXTENDED_ORDERS: Order[] = [
  ...MOCK_RECENT_ORDERS,
  {
    id: 1005,
    userId: "user-pqr-654",
    items: [
      { productId: 6, size: "32", quantity: 1, price: 175 },
      { productId: 1, size: "XL", quantity: 1, price: 189 },
    ],
    status: "Confirmed",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    adminNotes: "Payment verified.",
  },
  {
    id: 1006,
    userId: "user-stu-987",
    items: [{ productId: 2, size: "30", quantity: 2, price: 145 }],
    status: "Delivered",
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    adminNotes: "Delivered on time.",
  },
];

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const STATUS_META: Record<
  OrderStatus,
  { color: string; icon: typeof Clock; label: string }
> = {
  Pending: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    label: "Pending",
  },
  Confirmed: {
    color: "bg-primary/10 text-primary border-primary/30",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  Shipped: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Truck,
    label: "Shipped",
  },
  Delivered: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Star,
    label: "Delivered",
  },
};

const FILTER_TABS = [
  { label: "All", value: "" },
  ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
];

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderDrawerContent({
  order,
  onSave,
  onClose,
}: {
  order: Order;
  onSave: (id: number, status: OrderStatus, notes: string) => void;
  onClose: () => void;
}) {
  const [editStatus, setEditStatus] = useState<OrderStatus>(order.status);
  const [editNotes, setEditNotes] = useState(order.adminNotes);
  const meta = STATUS_META[editStatus];
  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSave = () => {
    onSave(order.id, editStatus, editNotes);
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <SheetTitle className="font-display text-xl">
            Order #{order.id}
          </SheetTitle>
          <Badge className={`text-xs ${STATUS_META[order.status].color}`}>
            {order.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {order.userId}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
        </p>
      </SheetHeader>

      <ScrollArea className="flex-1 px-5 py-4">
        <div className="space-y-5">
          {/* Items */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Order Items
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm"
                >
                  <div>
                    <p className="font-medium">Product #{item.productId}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <span className="font-semibold">Total</span>
              <span className="font-display font-bold text-lg">${total}</span>
            </div>
          </div>

          <Separator />

          {/* Status update */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Update Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const m = STATUS_META[s];
                const Icon = m.icon;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEditStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                      editStatus === s
                        ? `${m.color} border-current`
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                    data-ocid={`status-option-${s.toLowerCase()}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {s}
                  </button>
                );
              })}
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${meta.color} text-xs font-medium`}
            >
              <meta.icon className="w-3.5 h-3.5 shrink-0" />
              Will be set to: <strong>{editStatus}</strong>
            </div>
          </div>

          <Separator />

          {/* Admin notes */}
          <div className="space-y-2">
            <Label
              htmlFor="drawer-notes"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Admin Notes (visible to customer)
            </Label>
            <Textarea
              id="drawer-notes"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="e.g. Shipped via FedEx. Tracking: FX123…"
              rows={3}
              data-ocid="drawer-notes-input"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="px-5 py-4 border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="btn-primary flex-1"
          onClick={handleSave}
          data-ocid="drawer-save-btn"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>(EXTENDED_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterTab, setFilterTab] = useState("");

  const filtered = filterTab
    ? orders.filter((o) => o.status === filterTab)
    : orders;
  const countFor = (val: string) =>
    val ? orders.filter((o) => o.status === val).length : orders.length;

  const handleSave = (id: number, status: OrderStatus, notes: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status, adminNotes: notes, updatedAt: Date.now() }
          : o,
      ),
    );
    toast.success(`Order #${id} updated to ${status}`);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-label text-primary mb-0">Admin</p>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilterTab(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth ${
              filterTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid={`order-tab-${tab.value || "all"}`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1 py-0.5 rounded-full ${filterTab === tab.value ? "bg-primary-foreground/20 text-primary-foreground" : "bg-border"}`}
            >
              {countFor(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Order
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">
                  Items
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Total
                </th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const total = order.items.reduce(
                  (s, i) => s + i.price * i.quantity,
                  0,
                );
                const m = STATUS_META[order.status];
                const StatusIcon = m.icon;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`order-row-${order.id}`}
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold">#{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                        {order.userId}
                      </p>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(order.createdAt)}
                      </p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {order.items
                          .map((i) => `#${i.productId} ×${i.quantity}`)
                          .join(", ")}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">${total}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        className={`text-[11px] px-2 py-0.5 inline-flex items-center gap-1 ${m.color}`}
                      >
                        <StatusIcon className="w-3 h-3 shrink-0" />
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => setSelectedOrder(order)}
                        data-ocid={`manage-order-${order.id}`}
                      >
                        Manage <ChevronRight className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="orders-empty"
            >
              <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-sm">
                No orders with this status
              </p>
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          {selectedOrder && (
            <OrderDrawerContent
              key={selectedOrder.id}
              order={selectedOrder}
              onSave={handleSave}
              onClose={() => setSelectedOrder(null)}
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
      <ProtectedRoute>
        <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminOrdersContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
