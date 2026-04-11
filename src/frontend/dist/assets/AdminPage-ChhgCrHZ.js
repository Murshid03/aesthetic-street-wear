import { j as jsxRuntimeExports, L as Link } from "./index-g3gZ3l8S.js";
import { L as Layout, P as Package, b as Settings, B as Badge } from "./Layout-FMaNFeOD.js";
import { P as ProtectedRoute, C as CircleCheck } from "./ProtectedRoute-B9z3BhDk.js";
import { S as ShoppingBag, a as Separator } from "./separator-CPjAY5o4.js";
import { A as ALL_PRODUCTS, S as Star } from "./HomePage-Bd44OtDp.js";
import { c as createLucideIcon, m as motion } from "./proxy-BFAMbTv0.js";
import { T as Truck } from "./truck-CjzM8O8g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
const MOCK_RECENT_ORDERS = [
  {
    id: 1001,
    userId: "user-abc-123",
    items: [
      { productId: 1, size: "M", quantity: 1, price: 189 },
      { productId: 2, size: "32", quantity: 1, price: 145 }
    ],
    status: "Confirmed",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1e3,
    adminNotes: "Order confirmed and being prepared."
  },
  {
    id: 1002,
    userId: "user-xyz-456",
    items: [{ productId: 4, size: "One Size", quantity: 1, price: 310 }],
    status: "Shipped",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1e3,
    adminNotes: "Shipped via FedEx. Tracking: FX123456789"
  },
  {
    id: 1003,
    userId: "user-qrs-789",
    items: [{ productId: 3, size: "L", quantity: 2, price: 220 }],
    status: "Pending",
    createdAt: Date.now() - 1 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 1 * 60 * 60 * 1e3,
    adminNotes: ""
  },
  {
    id: 1004,
    userId: "user-mno-321",
    items: [{ productId: 5, size: "S", quantity: 1, price: 165 }],
    status: "Delivered",
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 6 * 24 * 60 * 60 * 1e3,
    adminNotes: "Delivered successfully."
  }
];
const STATUS_COLORS = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-primary/10 text-primary border-primary/30",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200"
};
const STATUS_ICONS = {
  Pending: Clock,
  Confirmed: CircleCheck,
  Shipped: Truck,
  Delivered: Star
};
const NAV_ITEMS = [
  {
    icon: ChartColumn,
    label: "Dashboard",
    to: "/admin",
    ocid: "admin-nav-dashboard"
  },
  {
    icon: Package,
    label: "Products",
    to: "/admin/products",
    ocid: "admin-nav-products"
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    to: "/admin/orders",
    ocid: "admin-nav-orders"
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/admin/settings",
    ocid: "admin-nav-settings"
  }
];
function AdminSidebar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-56 shrink-0 hidden lg:flex flex-col gap-1 pt-2", children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: item.to,
      className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth",
      activeProps: {
        className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-smooth"
      },
      "data-ocid": item.ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4 h-4 shrink-0" }),
        item.label
      ]
    },
    item.label
  )) });
}
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay },
      className: "card-elevated p-5 flex items-center gap-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-12 h-12 rounded-xl flex items-center justify-center ${color}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: label })
        ] })
      ]
    }
  );
}
function AdminDashboardContent() {
  const totalProducts = ALL_PRODUCTS.length;
  const totalOrders = MOCK_RECENT_ORDERS.length;
  const pendingOrders = MOCK_RECENT_ORDERS.filter(
    (o) => o.status === "Pending"
  ).length;
  const shippedOrders = MOCK_RECENT_ORDERS.filter(
    (o) => o.status === "Shipped"
  ).length;
  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-primary/10 text-primary",
      delay: 0
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700",
      delay: 0.05
    },
    {
      label: "Pending",
      value: pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
      delay: 0.1
    },
    {
      label: "Shipped",
      value: shippedOrders,
      icon: Truck,
      color: "bg-emerald-50 text-emerald-700",
      delay: 0.15
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-1", children: "Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Welcome back — here's what's happening in your store." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...s }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-5 lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-4", children: "Quick Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: NAV_ITEMS.slice(1).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-smooth text-sm font-medium group",
            "data-ocid": `quick-action-${item.label.toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
            ]
          },
          item.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Recent Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/admin/orders",
              className: "text-xs font-semibold text-primary hover:underline",
              "data-ocid": "view-all-orders",
              children: "View All"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: MOCK_RECENT_ORDERS.map((order, i) => {
          const StatusIcon = STATUS_ICONS[order.status];
          const total = order.items.reduce(
            (s, x) => s + x.price * x.quantity,
            0
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -8 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.3, delay: i * 0.05 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-3",
                    "data-ocid": `recent-order-${order.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "w-4 h-4 text-muted-foreground" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
                          "Order #",
                          order.id
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate font-mono", children: order.userId })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", children: [
                          "$",
                          total
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            className: `text-[10px] px-1.5 py-0.5 ${STATUS_COLORS[order.status]}`,
                            children: order.status
                          }
                        )
                      ] })
                    ]
                  }
                ),
                i < MOCK_RECENT_ORDERS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mt-3" })
              ]
            },
            order.id
          );
        }) })
      ] })
    ] })
  ] });
}
function AdminLayout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 lg:py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden", children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        className: "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-smooth shrink-0",
        activeProps: {
          className: "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-primary/10 text-primary shrink-0"
        },
        "data-ocid": `mobile-nav-${item.label.toLowerCase()}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-3.5 h-3.5" }),
          item.label
        ]
      },
      item.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
      children
    ] })
  ] });
}
function AdminPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 min-h-[calc(100vh-4rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboardContent, {}) }) }) }) });
}
const AdminPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AdminLayout,
  MOCK_RECENT_ORDERS,
  default: AdminPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdminLayout as A,
  Clock as C,
  MOCK_RECENT_ORDERS as M,
  AdminPage$1 as a
};
