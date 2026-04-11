import { u as useCart, d as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-g3gZ3l8S.js";
import { L as Layout, B as Badge, S as ShoppingCart } from "./Layout-FMaNFeOD.js";
import { u as useAuth, m as motion, B as Button } from "./proxy-BFAMbTv0.js";
import { S as ShoppingBag, a as Separator } from "./separator-CPjAY5o4.js";
import { A as AnimatePresence } from "./index-DwMhx5gN.js";
import { A as ArrowLeft } from "./arrow-left-CCrqQnKs.js";
import { T as Trash2 } from "./trash-2-DBqbi0yz.js";
import { M as Minus } from "./minus-DP7xKCEp.js";
import { P as Plus } from "./plus-CrcobU_9.js";
function QuantityControl({
  quantity,
  onDecrease,
  onIncrease
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-border rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Decrease quantity",
        className: "w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth disabled:opacity-40",
        onClick: onDecrease,
        disabled: quantity <= 1,
        "data-ocid": "qty-decrease",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-9 text-center text-sm font-semibold text-foreground tabular-nums select-none", children: quantity }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Increase quantity",
        className: "w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth",
        onClick: onIncrease,
        "data-ocid": "qty-increase",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
      }
    )
  ] });
}
function CartItemRow({
  item,
  onRemove,
  onQtyChange
}) {
  const lineTotal = item.product.price * item.quantity;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 16 },
      transition: { duration: 0.25 },
      className: "flex gap-4 py-5",
      "data-ocid": `cart-item-${item.productId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/product/$id",
            params: { id: String(item.productId) },
            className: "shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-muted block",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: item.product.image,
                alt: item.product.name,
                className: "w-full h-full object-cover hover:scale-105 transition-transform duration-300",
                onError: (e) => {
                  e.target.src = "/assets/images/placeholder.svg";
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/product/$id",
                  params: { id: String(item.productId) },
                  className: "font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug",
                  children: item.product.name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs px-2 py-0.5", children: item.product.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Size:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: item.size })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Remove item",
                className: "shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
                onClick: onRemove,
                "data-ocid": `remove-item-${item.productId}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              QuantityControl,
              {
                quantity: item.quantity,
                onDecrease: () => onQtyChange(item.quantity - 1),
                onIncrease: () => onQtyChange(item.quantity + 1)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "$",
                item.product.price,
                " × ",
                item.quantity
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-base text-foreground", children: [
                "$",
                lineTotal.toFixed(2)
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function EmptyCart() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "empty-cart",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-9 h-9 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold mb-2", children: "Your cart is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed", children: "Looks like you haven't added any pieces yet. Explore our collection and find your style." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "btn-primary h-11 px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Start Shopping" }) })
      ]
    }
  );
}
function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = reactExports.useState(false);
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    setCheckoutLoading(true);
    navigate({ to: "/checkout" });
    setCheckoutLoading(false);
  };
  const isEmpty = items.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Shopping Cart" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-8 lg:py-12 bg-background min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-7 h-7 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl lg:text-3xl font-bold", children: "Shopping Cart" }),
        !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/15 text-primary border-primary/25 font-semibold text-xs", children: [
          items.length,
          " ",
          items.length === 1 ? "item" : "items"
        ] })
      ] }),
      isEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCart, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-elevated divide-y divide-border px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CartItemRow,
            {
              item,
              onRemove: () => removeFromCart(item.productId, item.size),
              onQtyChange: (q) => updateQuantity(item.productId, item.size, q)
            },
            `${item.productId}-${item.size}`
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium",
              "data-ocid": "continue-shopping",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Continue Shopping"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, delay: 0.1 },
            className: "card-elevated p-6 sticky top-24",
            "data-ocid": "order-summary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold mb-5", children: "Order Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5 text-sm mb-4", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start justify-between gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground min-w-0 leading-snug", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium line-clamp-1 block", children: item.product.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
                        item.size,
                        " × ",
                        item.quantity
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold shrink-0 tabular-nums", children: [
                      "$",
                      (item.product.price * item.quantity).toFixed(2)
                    ] })
                  ]
                },
                `${item.productId}-${item.size}`
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-sm mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium tabular-nums", children: [
                    "$",
                    total.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold text-xs", children: "Confirmed via WhatsApp" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold", children: "Grand Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-xl text-primary tabular-nums", children: [
                  "$",
                  total.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "btn-primary w-full h-12 text-sm font-semibold shadow-sm",
                  onClick: handleCheckout,
                  disabled: checkoutLoading,
                  "data-ocid": "proceed-to-checkout",
                  children: checkoutLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" }),
                    "Processing…"
                  ] }) : "Proceed to Checkout"
                }
              ),
              !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center mt-3", children: [
                "You'll be asked to",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/login",
                    className: "text-primary hover:underline font-semibold",
                    children: "sign in"
                  }
                ),
                " ",
                "before checkout"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-2", children: "Orders confirmed via WhatsApp" })
            ]
          }
        ) })
      ] })
    ] }) })
  ] });
}
export {
  CartPage as default
};
