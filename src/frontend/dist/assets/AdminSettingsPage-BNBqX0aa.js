import { j as jsxRuntimeExports, r as reactExports, b as ue } from "./index-g3gZ3l8S.js";
import { L as Layout, b as Settings, I as Input } from "./Layout-FMaNFeOD.js";
import { P as ProtectedRoute } from "./ProtectedRoute-B9z3BhDk.js";
import { c as createLucideIcon, m as motion, B as Button } from "./proxy-BFAMbTv0.js";
import { L as Label } from "./label-CKC9zxjs.js";
import { a as Separator } from "./separator-CPjAY5o4.js";
import { T as Textarea } from "./textarea-CH9HNSll.js";
import { A as AdminLayout } from "./AdminPage-ChhgCrHZ.js";
import "./HomePage-Bd44OtDp.js";
import "./arrow-right-2SUMyMmL.js";
import "./truck-CjzM8O8g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
];
const Megaphone = createLucideIcon("megaphone", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$2);
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
];
const Store = createLucideIcon("store", __iconNode);
const DEFAULT_SETTINGS = {
  shopName: "Aesthetic Street Wear",
  whatsappNumber: "+1234567890",
  description: "Premium mens streetwear — modern silhouettes, curated essentials.",
  bannerMessage: "🆕 New Collection 2026 is here! Free shipping on orders over $200."
};
function SettingSection({
  icon: Icon,
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed pl-9", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-4", children })
  ] });
}
function AdminSettingsContent() {
  const [settings, setSettings] = reactExports.useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = reactExports.useState(DEFAULT_SETTINGS);
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const update = (field, value) => {
    setSettings((s) => ({ ...s, [field]: value }));
    setIsDirty(true);
  };
  const handleSave = () => {
    setSaved(settings);
    setIsDirty(false);
    ue.success("Settings saved successfully");
  };
  const handleReset = () => {
    setSettings(saved);
    setIsDirty(false);
    ue.info("Changes discarded");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label text-primary mb-0", children: "Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Settings" })
        ] })
      ] }),
      isDirty && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          className: "flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: handleReset, children: "Discard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "btn-primary",
                size: "sm",
                onClick: handleSave,
                "data-ocid": "save-settings-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Save Changes"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-5 lg:p-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SettingSection,
        {
          icon: Store,
          title: "Shop Identity",
          description: "Your store's name and public-facing description shown across the site.",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "shop-name", children: "Shop Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "shop-name",
                  value: settings.shopName,
                  onChange: (e) => update("shopName", e.target.value),
                  placeholder: "Aesthetic Street Wear",
                  "data-ocid": "shop-name-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "shop-desc", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "shop-desc",
                  value: settings.description,
                  onChange: (e) => update("description", e.target.value),
                  placeholder: "Tell customers what makes your store unique…",
                  rows: 2,
                  "data-ocid": "shop-desc-input"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SettingSection,
        {
          icon: MessageCircle,
          title: "WhatsApp Integration",
          description: "The WhatsApp number customers use to place orders. Include country code.",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "whatsapp-num", children: "WhatsApp Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "whatsapp-num",
                    value: settings.whatsappNumber,
                    onChange: (e) => update("whatsappNumber", e.target.value),
                    placeholder: "+1234567890",
                    className: "pl-9",
                    "data-ocid": "whatsapp-num-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Format: +[country code][number] — e.g. +14155552671" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Orders will generate a pre-filled WhatsApp link using",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  "wa.me/",
                  settings.whatsappNumber.replace(/\D/g, "")
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SettingSection,
        {
          icon: Megaphone,
          title: "Banner Message",
          description: "A promotional message shown in the site header or as an announcement bar.",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-msg", children: "Banner Text" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "banner-msg",
                  value: settings.bannerMessage,
                  onChange: (e) => update("bannerMessage", e.target.value),
                  placeholder: "e.g. 🆕 New arrivals just dropped! Free shipping over $200.",
                  rows: 2,
                  "data-ocid": "banner-msg-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Live Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary font-medium text-center",
                  "data-ocid": "banner-preview",
                  children: settings.bannerMessage || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic opacity-50", children: "No banner message set" })
                }
              )
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
      isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: handleReset, children: "Discard Changes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "btn-primary",
          onClick: handleSave,
          disabled: !isDirty,
          "data-ocid": "save-settings-bottom-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2" }),
            "Save Settings"
          ]
        }
      )
    ] })
  ] });
}
function AdminSettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 min-h-[calc(100vh-4rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSettingsContent, {}) }) }) }) });
}
export {
  AdminSettingsPage as default
};
