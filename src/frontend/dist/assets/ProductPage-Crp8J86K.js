import { c as useParams, u as useCart, a as useWishlist, r as reactExports, j as jsxRuntimeExports, L as Link, b as ue } from "./index-g3gZ3l8S.js";
import { L as Layout, S as ShoppingCart, H as Heart, B as Badge } from "./Layout-FMaNFeOD.js";
import { B as Button, m as motion } from "./proxy-BFAMbTv0.js";
import { A as ALL_PRODUCTS } from "./HomePage-Bd44OtDp.js";
import { C as ChevronRight } from "./chevron-right-CzcncJKW.js";
import { M as Minus } from "./minus-DP7xKCEp.js";
import { P as Plus } from "./plus-CrcobU_9.js";
import { A as ArrowLeft } from "./arrow-left-CCrqQnKs.js";
import "./arrow-right-2SUMyMmL.js";
import "./truck-CjzM8O8g.js";
const CATEGORY_ROUTE = {
  Shirts: "/shirts",
  TShirts: "/tshirts",
  Pants: "/pants",
  Accessories: "/accessories"
};
const CATEGORY_LABEL = {
  Shirts: "Shirts",
  TShirts: "T-Shirts & Tops",
  Pants: "Pants & Trousers",
  Accessories: "Accessories"
};
function RelatedProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden bg-muted aspect-[3/4]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: { id: String(product.id) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: product.image,
          alt: product.name,
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
          "aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
          className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm",
          onClick: () => wished ? removeFromWishlist(product.id) : addToWishlist(product),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `w-4 h-4 ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col flex-1 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: { id: String(product.id) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-xs text-foreground leading-snug hover:text-primary transition-colors line-clamp-2", children: product.name }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-base", children: [
          "$",
          product.price
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "btn-primary text-[10px] h-7 px-2",
            onClick: () => {
              addToCart(product, product.sizes[0] ?? "One Size");
              ue.success("Added to cart!");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3 h-3 mr-1" }),
              "Add"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const product = ALL_PRODUCTS.find((p) => String(p.id) === id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = reactExports.useState("");
  const [quantity, setQuantity] = reactExports.useState(1);
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-8 h-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold mb-3", children: "Product Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "This product doesn't exist or may have been removed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Back to Home" }) })
    ] }) });
  }
  const wished = isInWishlist(product.id);
  const activeSize = selectedSize || "";
  const categoryRoute = CATEGORY_ROUTE[product.category];
  const categoryLabel = CATEGORY_LABEL[product.category];
  const related = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);
  const handleAddToCart = () => {
    if (!activeSize) {
      ue.error("Please select a size first");
      return;
    }
    addToCart(product, activeSize, quantity);
    ue.success(`${product.name} added to cart!`, {
      description: `Size: ${activeSize} · Qty: ${quantity}`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 pt-6 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-1.5 text-sm text-muted-foreground mb-8",
        "aria-label": "breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: categoryRoute,
              className: "hover:text-foreground transition-colors",
              children: categoryLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium line-clamp-1 max-w-[200px]", children: product.name })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5 },
          className: "relative",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden bg-muted aspect-[3/4] shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: product.image,
                alt: product.name,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  e.target.src = "/assets/images/placeholder.svg";
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
                className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-smooth hover:bg-card hover:scale-110",
                onClick: () => wished ? removeFromWishlist(product.id) : addToWishlist(product),
                "data-ocid": "product-wishlist-toggle",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Heart,
                  {
                    className: `w-5 h-5 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`
                  }
                )
              }
            ),
            product.stockQuantity <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-4 left-4 bg-destructive text-destructive-foreground", children: [
              "Only ",
              product.stockQuantity,
              " left"
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.1 },
          className: "flex flex-col gap-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "mb-3 text-primary border-primary/30 font-semibold text-xs",
                  children: categoryLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl lg:text-4xl font-bold tracking-tight mb-3 leading-tight", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl font-bold text-primary", children: [
                "$",
                product.price
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: product.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
                  "Select Size",
                  activeSize && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary ml-2 font-bold", children: activeSize })
                ] }),
                !activeSize && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Required to add to cart" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", "data-ocid": "size-selector", children: product.sizes.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedSize(size),
                  className: `min-w-[48px] px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeSize === size ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border hover:border-primary/60 bg-card"}`,
                  "data-ocid": `size-btn-${size}`,
                  children: size
                },
                size
              )) }),
              !activeSize && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Please select a size to proceed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-3", children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "inline-flex items-center border-2 border-border rounded-lg overflow-hidden",
                  "data-ocid": "quantity-selector",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors",
                        onClick: () => setQuantity((q) => Math.max(1, q - 1)),
                        "aria-label": "Decrease quantity",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 text-center text-sm font-bold", children: quantity }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors",
                        onClick: () => setQuantity((q) => q + 1),
                        "aria-label": "Increase quantity",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "btn-primary flex-1 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed",
                  onClick: handleAddToCart,
                  disabled: !activeSize,
                  "data-ocid": "product-add-to-cart",
                  title: !activeSize ? "Select a size first" : "Add to cart",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-5 h-5 mr-2" }),
                    activeSize ? "Add to Cart" : "Select a Size First"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 h-12 border-2",
                  onClick: () => wished ? removeFromWishlist(product.id) : addToWishlist(product),
                  "data-ocid": "product-wishlist-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        className: `w-5 h-5 mr-2 ${wished ? "fill-primary text-primary" : ""}`
                      }
                    ),
                    wished ? "Wishlisted" : "Add to Wishlist"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: categoryRoute,
                className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors",
                "data-ocid": "back-to-category",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                  "Back to ",
                  categoryLabel
                ]
              }
            )
          ]
        }
      )
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-16 pt-12 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-1", children: "More from the collection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl lg:text-3xl font-bold", children: "You May Also Like" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: categoryRoute,
            className: "text-sm font-semibold text-primary hover:underline underline-offset-2 hidden sm:inline-flex items-center gap-1",
            children: [
              "View All ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6", children: related.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.4, delay: i * 0.07 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RelatedProductCard, { product: p })
        },
        p.id
      )) })
    ] })
  ] }) }) });
}
export {
  ProductPage as default
};
