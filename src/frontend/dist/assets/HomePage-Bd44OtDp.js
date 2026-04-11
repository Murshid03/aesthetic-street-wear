import { j as jsxRuntimeExports, L as Link, u as useCart, a as useWishlist, r as reactExports } from "./index-g3gZ3l8S.js";
import { L as Layout, B as Badge, H as Heart, S as ShoppingCart } from "./Layout-FMaNFeOD.js";
import { c as createLucideIcon, m as motion, B as Button } from "./proxy-BFAMbTv0.js";
import { A as ArrowRight } from "./arrow-right-2SUMyMmL.js";
import { T as Truck } from "./truck-CjzM8O8g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
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
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Premium Linen Shirt - Navy",
    category: "Shirts",
    description: "Breathable linen construction, relaxed contemporary fit. Perfect for warm days and coastal getaways.",
    price: 189,
    image: "/assets/generated/shirt-navy.dim_600x800.jpg",
    stockQuantity: 15,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 2,
    name: "Essential Twill Pants - Khaki",
    category: "Pants",
    description: "Slim-fit twill pants with clean structure. Versatile enough for any occasion from brunch to boardroom.",
    price: 145,
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    stockQuantity: 20,
    sizes: ["28", "30", "32", "34", "36"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 3,
    name: "Merino Wool Sweater - Camel",
    category: "TShirts",
    description: "Luxuriously soft merino wool in a refined crew neck silhouette. Lightweight warmth, timeless look.",
    price: 220,
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    stockQuantity: 10,
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 4,
    name: "Minimalist Leather Watch",
    category: "Accessories",
    description: "Clean dial, sapphire glass, genuine Italian leather strap. Timeless sophistication on your wrist.",
    price: 310,
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    stockQuantity: 8,
    sizes: ["One Size"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 5,
    name: "Oxford Button-Down - White",
    category: "Shirts",
    description: "Classic Oxford weave, relaxed collar, timeless everyday essential. Pairs with anything in your wardrobe.",
    price: 165,
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    stockQuantity: 25,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 6,
    name: "Cargo Utility Pants - Olive",
    category: "Pants",
    description: "Modern utility silhouette with subtle cargo pockets. Street-ready versatility meets refined tailoring.",
    price: 175,
    image: "/assets/generated/pants-olive.dim_600x800.jpg",
    stockQuantity: 12,
    sizes: ["28", "30", "32", "34"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 7,
    name: "Graphic Tee - Urban Script",
    category: "TShirts",
    description: "Premium 220gsm combed cotton with original urban art print. A statement piece for every occasion.",
    price: 85,
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    stockQuantity: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 8,
    name: "Leather Belt - Black",
    category: "Accessories",
    description: "Full-grain leather with brushed silver buckle. Handcrafted in small batches for lasting quality.",
    price: 75,
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    stockQuantity: 18,
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 9,
    name: "Chambray Overshirt - Indigo",
    category: "Shirts",
    description: "Lightweight chambray overshirt designed for layering. Soft-washed for immediate comfort and effortless drape.",
    price: 145,
    image: "/assets/generated/shirt-navy.dim_600x800.jpg",
    stockQuantity: 5,
    sizes: ["S", "M", "L", "XL"],
    isActive: true,
    createdAt: Date.now() - 1e3,
    updatedAt: Date.now()
  },
  {
    id: 10,
    name: "Slim Chino Trousers - Charcoal",
    category: "Pants",
    description: "Clean-cut slim chino in premium stretch cotton. The most versatile trouser in any modern wardrobe.",
    price: 155,
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    stockQuantity: 14,
    sizes: ["28", "30", "32", "34", "36"],
    isActive: true,
    createdAt: Date.now() - 2e3,
    updatedAt: Date.now()
  },
  {
    id: 11,
    name: "Essential Crew Neck Tee - White",
    category: "TShirts",
    description: "Premium 200gsm cotton jersey crew neck. The foundation of any outfit, elevated to perfection.",
    price: 65,
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    stockQuantity: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isActive: true,
    createdAt: Date.now() - 3e3,
    updatedAt: Date.now()
  },
  {
    id: 12,
    name: "Wool-Blend Scarf - Charcoal",
    category: "Accessories",
    description: "Finely woven wool-blend scarf in versatile charcoal. The perfect finishing touch in cold weather.",
    price: 75,
    image: "/assets/generated/pants-olive.dim_600x800.jpg",
    stockQuantity: 15,
    sizes: ["One Size"],
    isActive: true,
    createdAt: Date.now() - 4e3,
    updatedAt: Date.now()
  }
];
const CATEGORIES = [
  {
    label: "Shirts",
    to: "/shirts",
    image: "/assets/generated/shirt-white.dim_600x800.jpg",
    sub: "Premium cuts & fabrics",
    count: "12 styles"
  },
  {
    label: "T-Shirts",
    to: "/tshirts",
    image: "/assets/generated/sweater-camel.dim_600x800.jpg",
    sub: "Everyday essentials",
    count: "18 styles"
  },
  {
    label: "Pants",
    to: "/pants",
    image: "/assets/generated/pants-khaki.dim_600x800.jpg",
    sub: "Tailored precision fits",
    count: "10 styles"
  },
  {
    label: "Accessories",
    to: "/accessories",
    image: "/assets/generated/watch-leather.dim_600x800.jpg",
    sub: "Finishing touches",
    count: "15 pieces"
  }
];
const TRUST_BADGES = [
  { icon: Truck, label: "Fast Delivery", desc: "Delivered to your door" },
  { icon: Shield, label: "100% Authentic", desc: "Quality guaranteed" },
  { icon: Star, label: "Premium Quality", desc: "Handpicked collections" }
];
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = reactExports.useState(false);
  const wished = isInWishlist(product.id);
  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, product.sizes[0] ?? "One Size");
    setTimeout(() => setAdding(false), 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
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
              className: "absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-smooth hover:bg-card shadow-sm hover:scale-110",
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
          product.stockQuantity <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-semibold", children: "Low Stock" }),
          product.id <= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold", children: "New" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col flex-1 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: { id: String(product.id) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground leading-snug hover:text-primary transition-colors line-clamp-2", children: product.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-1", children: product.sizes.join(" · ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg text-foreground", children: [
              "$",
              product.price
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "btn-primary text-xs h-8 px-3 shrink-0",
                onClick: handleAddToCart,
                disabled: adding,
                "data-ocid": `add-to-cart-${product.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5 mr-1.5" }),
                  adding ? "Added!" : "Add to Cart"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function HomePage() {
  const newArrivals = ALL_PRODUCTS.slice(0, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-primary text-primary-foreground text-center py-2.5 px-4 text-xs sm:text-sm font-medium tracking-wide",
        "data-ocid": "announcement-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✦ New Collection Available — Shop the latest drops now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/shirts",
              className: "inline-flex items-center gap-1 ml-3 font-bold underline underline-offset-2 hover:no-underline",
              children: [
                "Shop Now ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative overflow-hidden bg-foreground text-background",
        "aria-label": "Hero",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/10 to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/15 to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-16 sm:py-20 lg:py-28 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row items-center gap-10 lg:gap-16", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "flex-1 text-center lg:text-left max-w-xl",
                initial: { opacity: 0, x: -32 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.6, ease: "easeOut" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-5 bg-primary/20 text-primary border-primary/30 font-semibold tracking-widest uppercase text-[11px] px-4 py-1", children: "New Collection 2026" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.08] mb-5", children: [
                    "Aesthetic",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Street Wear" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg opacity-75 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed", children: "Premium mens wear for those who move through the world with purpose. Curated essentials, modern silhouettes, uncompromising quality." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        asChild: true,
                        className: "btn-primary text-base h-12 px-8 shadow-lg hover:shadow-primary/30",
                        "data-ocid": "hero-cta-primary",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shirts", children: [
                          "Shop Now ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 w-4 h-4" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        asChild: true,
                        className: "h-12 px-8 border-background/25 text-background hover:bg-background/10 hover:border-background/40",
                        "data-ocid": "hero-cta-secondary",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/accessories", children: "View Accessories" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center gap-6 justify-center lg:justify-start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-background", children: "500+" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-background/60 mt-0.5", children: "Products" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-10 bg-background/20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-background", children: "10K+" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-background/60 mt-0.5", children: "Happy Customers" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-10 bg-background/20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-background", children: "4.9★" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-background/60 mt-0.5", children: "Rating" })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "flex-1 flex justify-center lg:justify-end",
                initial: { opacity: 0, x: 32 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.6, delay: 0.15, ease: "easeOut" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-3xl border border-primary/20 pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-[360px] sm:w-80 sm:h-[440px] lg:w-[380px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/assets/generated/hero-model.dim_800x1000.jpg",
                      alt: "Aesthetic Street Wear — premium mens fashion",
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        e.target.src = "/assets/images/placeholder.svg";
                      }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-4 -left-6 bg-card text-card-foreground rounded-xl px-4 py-3 shadow-lg border border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New Drop" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm", children: "Summer 2026" })
                  ] })
                ] })
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/40 border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border", children: TRUST_BADGES.map((badge) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 py-4 sm:py-3 px-4 sm:px-6 justify-center sm:justify-start",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(badge.icon, { className: "w-5 h-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: badge.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: badge.desc })
          ] })
        ]
      },
      badge.label
    )) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-14 lg:py-20 bg-background",
        "aria-label": "New Arrivals",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-1", children: "Just Dropped" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold", children: "New Arrivals" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/shirts",
                className: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 self-start sm:self-auto",
                "data-ocid": "new-arrivals-view-all",
                children: [
                  "View All ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5", children: newArrivals.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.08 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product })
            },
            product.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-14 lg:py-20 bg-muted/30", "aria-label": "Categories", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-1", children: "Browse by Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold", children: "Shop the Range" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: CATEGORIES.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.96 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
          transition: { duration: 0.4, delay: i * 0.08 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: cat.to,
              className: "group relative rounded-2xl overflow-hidden block aspect-[3/4] bg-muted shadow-sm hover:shadow-md transition-smooth",
              "data-ocid": `category-${cat.label.toLowerCase().replace(/\s+/, "-")}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: cat.image,
                    alt: cat.label,
                    className: "w-full h-full object-cover transition-transform duration-600 group-hover:scale-108",
                    onError: (e) => {
                      e.target.src = "/assets/images/placeholder.svg";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 sm:p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-background text-lg sm:text-xl leading-tight", children: cat.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-background/65 mt-0.5", children: cat.sub }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 inline-flex items-center gap-1 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-smooth translate-y-1 group-hover:translate-y-0", children: [
                    cat.count,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
                  ] })
                ] })
              ]
            }
          )
        },
        cat.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-14 lg:py-20 bg-background",
        "aria-label": "About Aesthetic Street Wear",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -24 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.55, ease: "easeOut" },
              className: "relative",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden aspect-[4/3] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: "/assets/generated/about-brand.dim_800x600.jpg",
                    alt: "Aesthetic Street Wear brand story",
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      e.target.src = "/assets/images/placeholder.svg";
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-5 -right-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg hidden sm:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl", children: "2020" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-80", children: "Est. in Chennai" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 24 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.55, delay: 0.1, ease: "easeOut" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-3", children: "Our Story" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl lg:text-4xl font-bold mb-5", children: [
                  "Born on the Streets,",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "Built for Excellence"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-muted-foreground leading-relaxed", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aesthetic Street Wear was founded with a single vision: to bring premium quality men's fashion to those who demand both style and substance. We believe that what you wear tells a story — and we're here to help you make it a great one." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Every piece in our collection is handpicked for its craftsmanship, fit, and versatility. From sharp Oxford shirts to street-ready cargo pants, each item bridges the gap between elevated fashion and everyday wearability." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Based in Chennai, serving style-conscious men across India with fast delivery and genuine quality you can feel with every wear." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      asChild: true,
                      className: "btn-primary h-11 px-7",
                      "data-ocid": "about-shop-cta",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shirts", children: "Explore Collection" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      asChild: true,
                      className: "h-11 px-7",
                      "data-ocid": "about-accessories-cta",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/accessories", children: "View Accessories" })
                    }
                  )
                ] })
              ]
            }
          )
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/40 py-14 lg:py-20",
        "aria-label": "Featured Collection",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden bg-foreground text-background relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 sm:p-12 flex flex-col justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit mb-4 bg-primary/20 text-primary border-primary/30 font-semibold tracking-wider text-[11px] uppercase", children: "Featured Collection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold mb-4 text-background", children: "Urban Explorer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-background/70 leading-relaxed mb-8 max-w-md", children: "Designed for the man who navigates city streets with purpose. Versatile pieces that transition effortlessly from morning meetings to evening gatherings — without missing a beat." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  className: "btn-primary w-fit h-12 px-8",
                  "data-ocid": "featured-collection-cta",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shirts", children: [
                    "Explore the Edit ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 w-4 h-4" })
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-0.5 aspect-[4/3] lg:aspect-auto", children: ALL_PRODUCTS.slice(0, 4).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/product/$id",
                params: { id: String(product.id) },
                className: "overflow-hidden group",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: product.image,
                    alt: product.name,
                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                    onError: (e) => {
                      e.target.src = "/assets/images/placeholder.svg";
                    }
                  }
                )
              },
              product.id
            )) })
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-14 lg:py-20 bg-background",
        "aria-label": "All Products",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-1", children: "Full Range" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold", children: "All Products" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-8", role: "tablist", children: [
            { label: "Shirts", to: "/shirts" },
            { label: "T-Shirts", to: "/tshirts" },
            { label: "Pants", to: "/pants" },
            { label: "Accessories", to: "/accessories" }
          ].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "rounded-full text-xs border-border hover:border-primary hover:text-primary transition-smooth",
              asChild: true,
              "data-ocid": `filter-${cat.label.toLowerCase()}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: cat.to, children: cat.label })
            },
            cat.label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6", children: ALL_PRODUCTS.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.35, delay: i % 4 * 0.06 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product })
            },
            product.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              className: "h-11 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth",
              "data-ocid": "view-all-products-cta",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shirts", children: "Browse Full Collection" })
            }
          ) })
        ] })
      }
    )
  ] });
}
const HomePage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ALL_PRODUCTS,
  default: HomePage
}, Symbol.toStringTag, { value: "Module" }));
export {
  ALL_PRODUCTS as A,
  HomePage$1 as H,
  Star as S
};
