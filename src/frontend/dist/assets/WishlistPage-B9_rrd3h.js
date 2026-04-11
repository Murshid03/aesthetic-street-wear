import { a as useWishlist, u as useCart, r as reactExports, j as jsxRuntimeExports, L as Link, b as ue } from "./index-g3gZ3l8S.js";
import { L as Layout, H as Heart, B as Badge, S as ShoppingCart } from "./Layout-FMaNFeOD.js";
import { c as createLucideIcon, m as motion, B as Button } from "./proxy-BFAMbTv0.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DOhJV5Iv.js";
import { A as AnimatePresence } from "./index-DwMhx5gN.js";
import { A as ArrowRight } from "./arrow-right-2SUMyMmL.js";
import "./index-Dfc3bGNN.js";
import "./Combination-Bjgngukn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function SizePickerDialog({
  item,
  open,
  onClose,
  onConfirm
}) {
  const [selected, setSelected] = reactExports.useState("");
  if (!item) return null;
  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected("");
  };
  const handleClose = () => {
    setSelected("");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v) handleClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "size-picker-dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "Choose a Size" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.product.image,
              alt: item.product.name,
              className: "w-16 h-20 rounded-lg object-cover bg-muted shrink-0",
              onError: (e) => {
                e.target.src = "/assets/images/placeholder.svg";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm line-clamp-2 leading-snug", children: item.product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold text-base mt-1", children: [
              "$",
              item.product.price
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: item.product.sizes.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: `px-3.5 py-2 text-sm font-semibold rounded-lg border transition-smooth ${selected === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50 hover:bg-muted text-foreground"}`,
            onClick: () => setSelected(size),
            "data-ocid": `size-option-${size}`,
            children: size
          },
          size
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: handleClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "btn-primary flex-1",
              disabled: !selected,
              onClick: handleConfirm,
              "data-ocid": "confirm-size",
              children: "Add to Cart"
            }
          )
        ] })
      ] })
    }
  );
}
function WishlistCard({
  item,
  onRemove,
  onMoveToCart
}) {
  const { isInWishlist } = useWishlist();
  const wished = isInWishlist(item.productId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.93, transition: { duration: 0.2 } },
      transition: { duration: 0.3 },
      className: "card-elevated group overflow-hidden flex flex-col",
      "data-ocid": `wishlist-card-${item.productId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden bg-muted aspect-[3/4]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: { id: String(item.productId) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.product.image,
              alt: item.product.name,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              onError: (e) => {
                e.target.src = "/assets/images/placeholder.svg";
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remove from wishlist",
              className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-xs",
              onClick: onRemove,
              "data-ocid": `wishlist-remove-${item.productId}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Heart,
                {
                  className: `w-4 h-4 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`
                }
              )
            }
          ),
          item.product.stockQuantity <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px]", children: "Low Stock" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col flex-1 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: { id: String(item.productId) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground leading-tight hover:text-primary transition-colors line-clamp-2", children: item.product.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: item.product.sizes.join(" · ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg text-foreground", children: [
              "$",
              item.product.price
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: item.product.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "btn-primary w-full text-xs h-9",
              onClick: onMoveToCart,
              "data-ocid": `move-to-cart-${item.productId}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5 mr-1.5" }),
                "Move to Cart"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function EmptyWishlist() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "empty-wishlist",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-9 h-9 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold mb-2", children: "Your wishlist is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed", children: "Save your favourite pieces here. Tap the heart icon on any product to add it to your wishlist." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
          { label: "Shop Shirts", to: "/shirts" },
          { label: "Shop Pants", to: "/pants" },
          { label: "Accessories", to: "/accessories" }
        ].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "h-10 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: cat.to, children: [
          cat.label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })
        ] }) }, cat.to)) })
      ]
    }
  );
}
function WishlistPage() {
  const { items, removeFromWishlist, itemCount } = useWishlist();
  const { addToCart } = useCart();
  const [pendingItem, setPendingItem] = reactExports.useState(null);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const handleMoveToCart = (item) => {
    if (item.product.sizes.length === 1) {
      addToCart(item.product, item.product.sizes[0]);
      removeFromWishlist(item.productId);
      ue.success(`${item.product.name} added to cart`);
      return;
    }
    setPendingItem(item);
    setDialogOpen(true);
  };
  const handleSizeConfirm = (size) => {
    if (!pendingItem) return;
    addToCart(pendingItem.product, size);
    removeFromWishlist(pendingItem.productId);
    ue.success(`${pendingItem.product.name} (${size}) added to cart`);
    setPendingItem(null);
    setDialogOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Wishlist" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-8 lg:py-12 bg-background min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-8 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 text-primary fill-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl lg:text-3xl font-bold leading-tight", children: "My Wishlist" }),
            itemCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: itemCount }),
              " ",
              "saved ",
              itemCount === 1 ? "item" : "items"
            ] })
          ] })
        ] }),
        itemCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-primary shrink-0" }),
          'Tap "Move to Cart" to order'
        ] })
      ] }),
      itemCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyWishlist, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6",
          initial: "hidden",
          animate: "visible",
          variants: {
            visible: { transition: { staggerChildren: 0.07 } },
            hidden: {}
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            WishlistCard,
            {
              item,
              onRemove: () => removeFromWishlist(item.productId),
              onMoveToCart: () => handleMoveToCart(item)
            },
            item.productId
          )) })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SizePickerDialog,
      {
        item: pendingItem,
        open: dialogOpen,
        onClose: () => {
          setPendingItem(null);
          setDialogOpen(false);
        },
        onConfirm: handleSizeConfirm
      }
    )
  ] });
}
export {
  WishlistPage as default
};
