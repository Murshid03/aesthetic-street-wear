import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Product } from "@/types";
import { PackageSearch, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminPage";
import { ALL_PRODUCTS } from "./HomePage";

const CATEGORIES: Category[] = ["Shirts", "TShirts", "Pants", "Accessories"];
const CATEGORY_TABS = [
  { label: "All", value: "" },
  ...CATEGORIES.map((c) => ({
    label: c === "TShirts" ? "T-Shirts" : c,
    value: c,
  })),
];

const ALL_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "One Size",
];

function SizeSelector({
  selected,
  onChange,
}: { selected: string[]; onChange: (s: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_SIZES.map((size) => {
        const active = selected.includes(size);
        return (
          <button
            key={size}
            type="button"
            onClick={() =>
              onChange(
                active
                  ? selected.filter((s) => s !== size)
                  : [...selected, size],
              )
            }
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-smooth ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [form, setForm] = useState<Partial<Product>>({});

  const filtered = activeTab
    ? products.filter((p) => p.category === activeTab)
    : products;

  const countFor = (val: string) =>
    val ? products.filter((p) => p.category === val).length : products.length;

  const openCreate = () => {
    setEditing(null);
    setForm({
      category: "Shirts",
      sizes: ["S", "M", "L", "XL"],
      isActive: true,
      stockQuantity: 10,
    });
    setIsOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.name?.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (!form.sizes?.length) {
      toast.error("Select at least one size");
      return;
    }
    if (editing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? ({ ...p, ...form, updatedAt: Date.now() } as Product)
            : p,
        ),
      );
      toast.success("Product updated");
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: form.name!.trim(),
        category: (form.category as Category) ?? "Shirts",
        description: form.description ?? "",
        price: Number(form.price),
        image: form.image?.trim() || "/assets/images/placeholder.svg",
        stockQuantity: Number(form.stockQuantity ?? 10),
        sizes: form.sizes ?? ["S", "M", "L", "XL"],
        isActive: form.isActive ?? true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product added");
    }
    setIsOpen(false);
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDelete = () => {
    if (deleteId === null) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    toast.success("Product deleted");
    setDeleteId(null);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-label text-primary mb-1">Admin</p>
          <h1 className="font-display text-3xl font-bold">Products</h1>
        </div>
        <Button
          className="btn-primary"
          onClick={openCreate}
          data-ocid="add-product-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">New Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid={`category-tab-${tab.value || "all"}`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1 py-0.5 rounded-full ${activeTab === tab.value ? "bg-primary-foreground/20 text-primary-foreground" : "bg-border"}`}
            >
              {countFor(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground card-elevated"
          data-ocid="products-empty"
        >
          <PackageSearch className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">No products in this category</p>
          <Button className="btn-primary mt-4" onClick={openCreate}>
            Add Product
          </Button>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                    Stock
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`admin-product-row-${p.id}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/assets/images/placeholder.svg";
                            }}
                          />
                        </div>
                        <span className="font-medium line-clamp-1 min-w-0">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {p.category === "TShirts" ? "T-Shirts" : p.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${p.price}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground hidden md:table-cell">
                      {p.stockQuantity}
                    </td>
                    <td className="py-3 px-4 text-center hidden lg:table-cell">
                      <Badge
                        className={
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                            : "bg-muted text-muted-foreground text-xs"
                        }
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8"
                          onClick={() => openEdit(p)}
                          aria-label="Edit product"
                          data-ocid={`edit-product-${p.id}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => confirmDelete(p.id)}
                          aria-label="Delete product"
                          data-ocid={`delete-product-${p.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="prod-name">Product Name *</Label>
              <Input
                id="prod-name"
                value={form.name ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Premium Linen Shirt"
                data-ocid="prod-name-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price">Price ($) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min={0}
                  value={form.price ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: Number(e.target.value) }))
                  }
                  placeholder="0"
                  data-ocid="prod-price-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prod-stock">Stock Qty</Label>
                <Input
                  id="prod-stock"
                  type="number"
                  min={0}
                  value={form.stockQuantity ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stockQuantity: Number(e.target.value),
                    }))
                  }
                  placeholder="10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-category">Category</Label>
              <select
                id="prod-category"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.category ?? "Shirts"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as Category,
                  }))
                }
                data-ocid="prod-category-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "TShirts" ? "T-Shirts" : c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Sizes *</Label>
              <SizeSelector
                selected={form.sizes ?? []}
                onChange={(s) => setForm((f) => ({ ...f, sizes: s }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-image">Image URL</Label>
              <Input
                id="prod-image"
                value={form.image ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://... or /assets/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short product description…"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="prod-active"
                checked={form.isActive ?? true}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                data-ocid="prod-active-toggle"
              />
              <Label htmlFor="prod-active" className="cursor-pointer">
                Active — visible in store
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary"
              onClick={handleSave}
              data-ocid="save-product-btn"
            >
              {editing ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the product from your store. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="confirm-delete-btn"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminProductsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
