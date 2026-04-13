import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { PackageSearch, Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminPage";

const CATEGORIES: Category[] = ["Shirts", "TShirts", "Pants", "Accessories"];
const CATEGORY_TABS = [
  { label: "All", value: "" },
  ...CATEGORIES.map((c) => ({
    label: c === "TShirts" ? "T-Shirts" : c,
    value: c,
  })),
];

const ALL_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "28", "30", "32", "34", "36",
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
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-smooth ${active
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
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [form, setForm] = useState<Partial<Product>>({});

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin_products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newP: any) => api.post("/products", newP),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product added");
      setIsOpen(false);
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product updated");
      setIsOpen(false);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

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
      updateMutation.mutate({ id: editing._id!, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading products…</p>
      </div>
    );
  }

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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth ${activeTab === tab.value
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
                    key={p._id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
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
                                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500";
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
                      ₹{p.price}
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
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteId(p._id!)}
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price">Price (₹) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min={0}
                  value={form.price ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: Number(e.target.value) }))
                  }
                  placeholder="0"
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
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
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
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
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
      <ProtectedRoute adminOnly>
        <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminProductsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
