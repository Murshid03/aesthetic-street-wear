import { r as reactExports, j as jsxRuntimeExports, L as Link, u as useCart, a as useWishlist, b as ue } from "./index-g3gZ3l8S.js";
import { L as Layout, S as ShoppingCart, H as Heart, B as Badge } from "./Layout-FMaNFeOD.js";
import { m as motion, B as Button } from "./proxy-BFAMbTv0.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-iW3_WXUc.js";
import { A as ALL_PRODUCTS } from "./HomePage-Bd44OtDp.js";
import { S as SlidersHorizontal } from "./sliders-horizontal-BZmt0ZaU.js";
import "./index-CzKDYSp8.js";
import "./Combination-Bjgngukn.js";
import "./index-SUFTl3Qb.js";
import "./chevron-up-4r12EpeP.js";
import "./arrow-right-2SUMyMmL.js";
import "./truck-CjzM8O8g.js";
function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.4, delay: index % 4 * 0.08 },
      className: "card-elevated group overflow-hidden flex flex-col transition-smooth hover:shadow-md hover:-translate-y-0.5",
      "data-ocid": `product-card-${product.id}`,
      children: [
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
              className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm hover:scale-110",
              onClick: () => wished ? removeFromWishlist(product.id) : addToWishlist(product),
              "data-ocid": `wishlist-toggle-${product.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Heart,
                {
                  className: `w-4 h-4 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`
                }
              )
            }
          ),
          product.stockQuantity <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-semibold", children: "Low Stock" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col flex-1 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "self-start text-primary border-primary/30 text-[10px] px-2 py-0.5 font-semibold",
              children: "Pants"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: { id: String(product.id) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground leading-snug hover:text-primary transition-colors line-clamp-2", children: product.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 truncate", children: product.sizes.join(" · ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg text-foreground", children: [
              "$",
              product.price
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "btn-primary text-xs h-8 px-3",
                onClick: () => {
                  addToCart(product, product.sizes[0] ?? "One Size");
                  ue.success("Added to cart!", { description: product.name });
                },
                "data-ocid": `add-to-cart-${product.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Add to Cart"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const WAIST_OPTIONS = ["28", "30", "32", "34", "36"];
function PantsPage() {
  const [sizeFilter, setSizeFilter] = reactExports.useState("all");
  const [sortBy, setSortBy] = reactExports.useState("newest");
  const pants = reactExports.useMemo(() => {
    let filtered = ALL_PRODUCTS.filter((p) => p.category === "Pants");
    if (sizeFilter !== "all") {
      filtered = filtered.filter((p) => p.sizes.includes(sizeFilter));
    }
    if (sortBy === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [sizeFilter, sortBy]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-10 lg:py-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "flex items-center gap-2 text-sm text-muted-foreground mb-5",
          "aria-label": "breadcrumb",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Pants" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-6 h-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold tracking-tight mb-3", children: "Pants & Trousers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl leading-relaxed text-sm sm:text-base", children: "Precision-tailored fits for every wardrobe. From slim chinos to utility cargo silhouettes — each pair engineered to move with you through the day." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-primary font-semibold mt-3", children: [
            pants.length,
            " product",
            pants.length !== 1 ? "s" : ""
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 border-b border-border sticky top-0 z-10 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center gap-2 sm:gap-3",
        "data-ocid": "filter-bar-pants",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-xs hidden sm:inline", children: "Waist:" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSizeFilter("all"),
                className: `px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${sizeFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:border-primary/50"}`,
                "data-ocid": "filter-all",
                children: "All Sizes"
              }
            ),
            WAIST_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setSizeFilter(s),
                className: `px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${sizeFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:border-primary/50"}`,
                "data-ocid": `filter-size-${s}`,
                children: [
                  s,
                  '"'
                ]
              },
              s
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sortBy, onValueChange: setSortBy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-36 sm:w-40 text-xs",
                "data-ocid": "sort-select-pants",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort by" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest First" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "price-asc", children: "Price: Low → High" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "price-desc", children: "Price: High → Low" })
            ] })
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-10 lg:py-14 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: pants.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6", children: pants.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i }, p.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        className: "text-center py-24",
        "data-ocid": "empty-state-pants",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-8 h-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "No pants found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Try a different size or browse the full collection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSizeFilter("all"), children: "Clear Filter" })
        ]
      }
    ) }) })
  ] });
}
export {
  PantsPage as default
};
