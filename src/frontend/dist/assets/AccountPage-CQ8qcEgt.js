import { j as jsxRuntimeExports, d as useNavigate, r as reactExports } from "./index-g3gZ3l8S.js";
import { L as Layout, a as LogOut, U as User, B as Badge, P as Package, M as MapPin, C as ChevronDown } from "./Layout-FMaNFeOD.js";
import { P as ProtectedRoute, C as CircleCheck } from "./ProtectedRoute-B9z3BhDk.js";
import { c as createLucideIcon, u as useAuth, B as Button, m as motion } from "./proxy-BFAMbTv0.js";
import { S as ShoppingBag, a as Separator } from "./separator-CPjAY5o4.js";
import { T as Truck } from "./truck-CjzM8O8g.js";
import { C as ChevronUp } from "./chevron-up-4r12EpeP.js";
import { A as AnimatePresence } from "./index-DwMhx5gN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode);
const MOCK_ORDERS = [
  {
    id: 10043,
    userId: "demo",
    items: [
      { productId: 1, size: "M", quantity: 1, price: 189 },
      { productId: 2, size: "32", quantity: 1, price: 145 }
    ],
    status: "Shipped",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1e3,
    adminNotes: "Shipped via FedEx. Tracking: FX123456789. Expected delivery in 2–3 business days."
  },
  {
    id: 10039,
    userId: "demo",
    items: [{ productId: 3, size: "L", quantity: 2, price: 220 }],
    status: "Confirmed",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1e3,
    adminNotes: "Your order has been confirmed and is being prepared for shipment."
  },
  {
    id: 10028,
    userId: "demo",
    items: [
      { productId: 4, size: "One Size", quantity: 1, price: 310 },
      { productId: 5, size: "S", quantity: 1, price: 95 }
    ],
    status: "Delivered",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1e3,
    adminNotes: "Delivered successfully. Thank you for shopping with us!"
  },
  {
    id: 10052,
    userId: "demo",
    items: [{ productId: 6, size: "XL", quantity: 1, price: 175 }],
    status: "Pending",
    createdAt: Date.now() - 3 * 60 * 60 * 1e3,
    updatedAt: Date.now() - 3 * 60 * 60 * 1e3,
    adminNotes: ""
  }
];
const STATUS_STEPS = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered"
];
const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    badgeCls: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Circle
  },
  Confirmed: {
    label: "Confirmed",
    badgeCls: "bg-primary/10 text-primary border-primary/30",
    icon: CircleCheck
  },
  Shipped: {
    label: "Shipped",
    badgeCls: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Truck
  },
  Delivered: {
    label: "Delivered",
    badgeCls: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: MapPin
  }
};
const ITEM_NAMES = {
  1: "Premium Linen Shirt — Navy",
  2: "Essential Twill Pants — Khaki",
  3: "Merino Wool Sweater — Oat",
  4: "Minimalist Leather Watch",
  5: "Classic White T-Shirt",
  6: "Urban Cargo Pants — Black"
};
function StatusTimeline({ status }) {
  const activeIdx = STATUS_STEPS.indexOf(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex items-center gap-0 mt-4",
      "data-ocid": "order-status-timeline",
      children: STATUS_STEPS.map((step, idx) => {
        const done = idx <= activeIdx;
        const isLast = idx === STATUS_STEPS.length - 1;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1 last:flex-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-7 h-7 rounded-full border-2 flex items-center justify-center transition-smooth ${done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"}`,
                children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-medium leading-tight text-center whitespace-nowrap ${done ? "text-primary" : "text-muted-foreground"}`,
                children: step
              }
            )
          ] }),
          !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-1 h-0.5 mx-1 mb-4 rounded-full transition-smooth ${idx < activeIdx ? "bg-primary" : "bg-border"}`
            }
          )
        ] }, step);
      })
    }
  );
}
function OrderCard({ order }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      className: "card-elevated overflow-hidden",
      "data-ocid": `order-card-${order.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "w-full px-5 py-4 text-left hover:bg-muted/30 transition-smooth",
            onClick: () => setExpanded((v) => !v),
            "aria-expanded": expanded,
            "data-ocid": `order-toggle-${order.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-sm sm:text-base", children: [
                    "Order #",
                    order.id
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `text-[10px] px-2 py-0.5 font-semibold border ${cfg.badgeCls}`,
                      children: cfg.label
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }),
                  " · ",
                  itemCount,
                  " item",
                  itemCount !== 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-base sm:text-lg", children: [
                  "$",
                  total
                ] }),
                expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.28, ease: "easeInOut" },
            className: "overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-label text-muted-foreground mb-2", children: "Items" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between text-sm",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: ITEM_NAMES[item.productId] ?? `Product #${item.productId}` }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1.5", children: [
                            "· Size ",
                            item.size,
                            " · Qty ",
                            item.quantity
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold ml-4 shrink-0", children: [
                          "$",
                          item.price * item.quantity
                        ] })
                      ]
                    },
                    `${item.productId}-${item.size}`
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mt-3 mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display font-bold text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "$",
                      total
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-label text-muted-foreground mb-1", children: "Order Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTimeline, { status: order.status })
                ] }),
                order.adminNotes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/15 rounded-xl px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary mb-1", children: "Update from us" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: order.adminNotes })
                ] })
              ] })
            ]
          },
          "body"
        ) })
      ]
    }
  );
}
function AccountContent() {
  const { principal, logout } = useAuth();
  const navigate = useNavigate();
  const orders = MOCK_ORDERS;
  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };
  const shortPrincipal = principal ? `${principal.slice(0, 8)}…${principal.slice(-6)}` : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-[80vh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-bold tracking-tight", children: "My Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage your profile and track orders" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleLogout,
          className: "flex items-center gap-1.5 text-muted-foreground hover:text-foreground",
          "data-ocid": "logout-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Sign Out" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-8 lg:py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
          className: "card-elevated p-5",
          "data-ocid": "account-profile",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Internet Identity User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 font-semibold", children: "II Verified" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-muted-foreground mt-0.5 font-mono truncate",
                  title: principal ?? "",
                  children: shortPrincipal
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: "Order History" }),
          orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-muted text-muted-foreground border-border ml-auto text-xs", children: [
            orders.length,
            " orders"
          ] })
        ] }),
        orders.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, delay: i * 0.07 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order })
          },
          order.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.97 },
            animate: { opacity: 1, scale: 1 },
            className: "card-elevated py-14 px-6 text-center",
            "data-ocid": "orders-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-muted-foreground/60" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "No orders yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5 max-w-xs mx-auto", children: "Once you place an order, your full order history and tracking will appear here." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth",
                  onClick: () => navigate({ to: "/" }),
                  "data-ocid": "start-shopping-btn",
                  children: "Start Shopping"
                }
              )
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function AccountPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccountContent, {}) }) });
}
export {
  AccountPage as default
};
