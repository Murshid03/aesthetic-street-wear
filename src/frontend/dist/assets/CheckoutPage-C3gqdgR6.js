import { j as jsxRuntimeExports, u as useCart, d as useNavigate, r as reactExports, L as Link } from "./index-g3gZ3l8S.js";
import { L as Layout, I as Input, B as Badge, P as Package } from "./Layout-FMaNFeOD.js";
import { P as ProtectedRoute, C as CircleCheck } from "./ProtectedRoute-B9z3BhDk.js";
import { B as Button, m as motion } from "./proxy-BFAMbTv0.js";
import { L as Label } from "./label-CKC9zxjs.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-iW3_WXUc.js";
import { S as ShoppingBag, a as Separator } from "./separator-CPjAY5o4.js";
import { A as ArrowLeft } from "./arrow-left-CCrqQnKs.js";
import { C as ChevronRight } from "./chevron-right-CzcncJKW.js";
import { A as AnimatePresence } from "./index-DwMhx5gN.js";
import "./index-CzKDYSp8.js";
import "./Combination-Bjgngukn.js";
import "./index-SUFTl3Qb.js";
import "./chevron-up-4r12EpeP.js";
const DEFAULT_WHATSAPP = "1234567890";
function generateOrderRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `ASW-${(/* @__PURE__ */ new Date()).getFullYear()}-${rand}`;
}
function SizeRow({ item, onSizeChange }) {
  const sizes = item.product.sizes;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3 border-b border-border last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-16 rounded-lg overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: item.product.image,
        alt: item.product.name,
        className: "w-full h-full object-cover",
        onError: (e) => {
          e.target.src = "/assets/images/placeholder.svg";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: item.product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
        "Qty: ",
        item.quantity
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Size:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: item.size,
            onValueChange: (val) => onSizeChange(item.productId, item.size, val),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-7 text-xs w-24 border-input",
                  "data-ocid": `size-select-${item.productId}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, className: "text-xs", children: s }, s)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-sm text-foreground", children: [
        "$",
        (item.product.price * item.quantity).toLocaleString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
        "$",
        item.product.price.toLocaleString(),
        " each"
      ] })
    ] })
  ] });
}
function ConfirmationScreen({
  orderRef,
  onReset
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      className: "w-full max-w-md text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-8 sm:p-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: {
                delay: 0.15,
                type: "spring",
                stiffness: 220,
                damping: 18
              },
              className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366]/15 mb-6 mx-auto",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-[#25D366]" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "WhatsApp Opened!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "Your order message has been prepared. Complete the order by sending the message to us on WhatsApp." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-xl p-4 mb-6 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Order Reference" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-display font-bold text-lg tracking-widest text-primary",
                "data-ocid": "order-ref",
                children: orderRef
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Save this for order tracking" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                className: "w-full h-11 btn-primary",
                "data-ocid": "track-order-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4 mr-2" }),
                  "Track Your Order"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full h-11",
                onClick: onReset,
                "data-ocid": "continue-shopping-btn",
                children: "Continue Shopping"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs text-muted-foreground", children: "Questions? Contact us on WhatsApp anytime." })
      ]
    }
  ) }) });
}
function CheckoutContent() {
  const { items, clearCart, total } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = reactExports.useState("");
  const [deliveryAddress, setDeliveryAddress] = reactExports.useState("");
  const [orderRef, setOrderRef] = reactExports.useState("");
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const { addToCart, removeFromCart } = useCart();
  const handleSizeChangeReal = (productId, oldSize, newSize) => {
    const item = items.find(
      (i) => i.productId === productId && i.size === oldSize
    );
    if (!item || oldSize === newSize) return;
    const qty = item.quantity;
    removeFromCart(productId, oldSize);
    addToCart(item.product, newSize, qty);
  };
  const handlePlaceOrder = () => {
    const ref = generateOrderRef();
    const lineItems = items.map(
      (i) => `• ${i.product.name} | Size: ${i.size} | Qty: ${i.quantity} | $${(i.product.price * i.quantity).toLocaleString()}`
    );
    const message = [
      "Hello! I would like to place an order from Aesthetic Street Wear:",
      "",
      ...lineItems,
      "",
      `Total: $${total.toLocaleString()}`,
      `Order Ref: ${ref}`,
      ...customerName ? [`
My name: ${customerName}`] : [],
      ...deliveryAddress ? [`Delivery address: ${deliveryAddress}`] : []
    ].join("\n");
    const waNumber = DEFAULT_WHATSAPP;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setOrderRef(ref);
    setConfirmed(true);
    clearCart();
  };
  if (confirmed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationScreen,
      {
        orderRef,
        onReset: () => navigate({ to: "/" })
      }
    );
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "container mx-auto px-4 py-20 text-center",
        "data-ocid": "checkout-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold mb-3", children: "Nothing to checkout" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Add items to your cart before proceeding." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "btn-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Start Shopping" }) })
        ]
      }
    ) });
  }
  const subtotal = total;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          asChild: true,
          className: "text-muted-foreground hover:text-foreground -ml-2",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1.5" }),
            "Back to Cart"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Checkout" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 lg:py-12 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35 },
          className: "font-display text-3xl font-bold mb-8",
          children: "Place Your Order"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.05 },
              className: "card-elevated p-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg mb-5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs items-center justify-center font-bold", children: "1" }),
                  "Your Details",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: "(optional)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "customer-name", className: "text-sm", children: "Full Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "customer-name",
                        placeholder: "e.g. Rahul Sharma",
                        value: customerName,
                        onChange: (e) => setCustomerName(e.target.value),
                        className: "h-11",
                        "data-ocid": "checkout-name-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "delivery-address", className: "text-sm", children: "Delivery Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "delivery-address",
                        placeholder: "Street, City, State, PIN",
                        value: deliveryAddress,
                        onChange: (e) => setDeliveryAddress(e.target.value),
                        className: "h-11",
                        "data-ocid": "checkout-address-input"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.1 },
              className: "card-elevated p-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg mb-5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs items-center justify-center font-bold", children: "2" }),
                  "Confirm Sizes & Items"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "checkout-items-list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 8 },
                    transition: { delay: index * 0.05 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SizeRow,
                      {
                        item,
                        onSizeChange: handleSizeChangeReal
                      }
                    )
                  },
                  `${item.productId}-${item.size}`
                )) }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.15 },
            className: "lg:col-span-2",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-6 sticky top-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-5", children: "Order Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex justify-between text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground truncate mr-2 min-w-0", children: [
                      item.product.name,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "ml-1.5 text-[9px] px-1 py-0",
                          children: item.size
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1", children: [
                        "×",
                        item.quantity
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium shrink-0", children: [
                      "$",
                      (item.product.price * item.quantity).toLocaleString()
                    ] })
                  ]
                },
                `${item.productId}-${item.size}`
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                    "$",
                    subtotal.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shipping" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#25D366]", children: "via WhatsApp" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg", children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-2xl text-primary", children: [
                  "$",
                  total.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full h-13 text-base font-bold rounded-xl text-white transition-smooth hover:opacity-90 active:scale-95 shadow-md",
                  style: { background: "#25D366" },
                  onClick: handlePlaceOrder,
                  "data-ocid": "whatsapp-order-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        viewBox: "0 0 24 24",
                        className: "w-5 h-5 mr-2.5 shrink-0",
                        fill: "currentColor",
                        "aria-hidden": "true",
                        role: "img",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "WhatsApp" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.523 5.845L0 24l6.335-1.493A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.372l-.359-.213-3.72.876.897-3.617-.234-.371A9.775 9.775 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" })
                        ]
                      }
                    ),
                    "Order via WhatsApp"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-3 leading-relaxed", children: "Contact us via WhatsApp to confirm your order. (Shop owner: update the WhatsApp number in admin settings.)" })
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function CheckoutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { redirectTo: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckoutContent, {}) });
}
export {
  CheckoutPage as default
};
