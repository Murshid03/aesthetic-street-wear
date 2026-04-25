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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Product } from "@/types";
import {
  PackageSearch,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Search,
  Image as ImageIcon,
  ChevronRight,
  Filter,
  AlertCircle,
  RefreshCw,
  Box,
  Layers
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminPage";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES: Category[] = ["Shirts", "T-Shirts", "Pants", "Accessories"];

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
    <div className="flex flex-wrap gap-1.5 mt-2">
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
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-200 ${active
              ? "bg-black text-white border-black shadow-md scale-105"
              : "bg-white border-black/8 text-black/40 hover:border-black/20 hover:text-black"
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
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<Partial<Product>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      toast.success("Product added successfully");
      setIsOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product updated successfully");
      setIsOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product deleted successfully");
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to delete product"),
  });

  const toggleSoldOutMutation = useMutation({
    mutationFn: (id: string) => api.put(`/products/${id}/toggle-sold-out`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesTab = activeTab === "all" || p.category === activeTab;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      category: "Shirts",
      sizes: ["S", "M", "L", "XL"],
      isActive: true,
      stockQuantity: 10,
      price: undefined,
      image: "",
      description: ""
    });
    setSelectedFile(null);
    setIsOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setSelectedFile(null);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.name?.trim() || !form.description?.trim() || form.price === undefined || form.price < 0) {
      toast.error("Please enter a name and description");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      const value = (form as any)[key];
      if (key === "sizes") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "image" && selectedFile) {
        // Skip
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });

    if (selectedFile) formData.append("image", selectedFile);

    if (editing) {
      updateMutation.mutate({ id: editing._id!, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Product <span className="text-primary italic">Inventory</span>
          </h1>
        </div>
        <Button
          onClick={openCreate}
          className="h-10 px-4 rounded-full bg-black text-white hover:bg-primary transition-all font-black text-[9px] uppercase tracking-[0.3em] shadow-lg shrink-0"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/25 group-focus-within:text-black transition-colors" />
          <Input
            placeholder="Search catalog..."
            className="h-11 pl-10 pr-4 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border transition-all duration-400 ${activeTab === cat
                ? "bg-black text-white border-black shadow-md"
                : "bg-white border-black/8 text-black/40 hover:border-black/20 hover:text-black"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center bg-black/5 rounded-3xl">
          <PackageSearch className="w-10 h-10 text-black/10 mx-auto mb-4" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">No products found.</p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => (
              <motion.div
                layout
                key={p._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="p-3 sm:p-4 rounded-2xl bg-white border border-black/5 hover:shadow-xl transition-all duration-400 group"
              >
                <div className="flex items-center gap-3">
                  {/* Product Image */}
                  <div className="w-14 h-18 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" style={{ height: "4.5rem" }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[7px] font-black uppercase tracking-[0.25em] px-2 py-0.5 bg-black text-white rounded-full">{p.category}</span>
                      {!p.isActive && <span className="text-[7px] font-black uppercase tracking-[0.25em] px-2 py-0.5 bg-black/8 text-black/40 rounded-full">Draft</span>}
                      {p.isSoldOut && <span className="text-[7px] font-black uppercase tracking-[0.25em] px-2 py-0.5 bg-rose-500 text-white rounded-full">Sold Out</span>}
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-black truncate leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-3 text-[8px] font-bold text-black/40">
                      <span className="font-black text-black">₹{p.price.toLocaleString("en-IN")}</span>
                      <span className={`${p.stockQuantity <= 5 ? "text-rose-500 font-black" : ""}`}>Stock: {p.stockQuantity}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(p)}
                      className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black hover:text-white transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSoldOutMutation.mutate(p._id!)}
                      className={`w-9 h-9 rounded-xl transition-all ${p.isSoldOut ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"}`}
                    >
                      {p.isSoldOut ? <RefreshCw className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(p._id!)}
                      className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Product Edit/Add Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md w-full flex flex-col p-0 bg-white border-l border-black/5 shadow-2xl overflow-hidden">
          {/* Sheet Header */}
          <SheetHeader className="px-5 pt-5 pb-4 text-left border-b border-black/5 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-[2px] bg-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-primary">Product Details</span>
            </div>
            <SheetTitle className="text-2xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
              {editing ? "Edit" : "Add"} <span className="text-primary italic">Product</span>
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            <div className="px-5 py-4 space-y-5">
              {/* Image */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Product Image</Label>
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-2xl bg-black/5 overflow-hidden border border-black/5 shrink-0">
                    {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-black/10" /></div>}
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input
                      type="file"
                      className="h-9 text-[8px] font-black uppercase pt-1.5 cursor-pointer rounded-xl border-black/8 bg-black/5"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { setSelectedFile(file); setForm(f => ({ ...f, image: URL.createObjectURL(file) })); }
                      }}
                    />
                    <div className="text-[8px] font-black uppercase tracking-widest text-black/20 text-center">OR</div>
                    <Input
                      placeholder="Image URL"
                      className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
                      value={selectedFile ? "" : (form.image ?? "")}
                      onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Category + Visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v as Category }))}>
                    <SelectTrigger className="h-11 px-4 bg-black/5 rounded-xl text-xs font-bold border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs font-bold uppercase">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Visibility</Label>
                  <div className="flex items-center h-11 px-4 bg-black/5 rounded-xl justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest">{form.isActive ? "Active" : "Hidden"}</span>
                    <Switch checked={form.isActive} onCheckedChange={(v) => setForm(f => ({ ...f, isActive: v }))} />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Product Name</Label>
                <Input
                  placeholder="Product Title"
                  className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
                  value={form.name ?? ""}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Price (₹)</Label>
                  <Input
                    type="number"
                    className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
                    value={form.price === undefined ? "" : form.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm(f => ({ ...f, price: val === "" ? undefined : Number(val) }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Stock</Label>
                  <Input
                    type="number"
                    className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
                    value={form.stockQuantity === undefined ? "" : form.stockQuantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm(f => ({ ...f, stockQuantity: val === "" ? undefined : Number(val) }));
                    }}
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Available Sizes</Label>
                <SizeSelector selected={form.sizes ?? []} onChange={(s) => setForm(f => ({ ...f, sizes: s }))} />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Description</Label>
                <Textarea
                  placeholder="Product description and details..."
                  className="min-h-[100px] p-4 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-sm font-bold resize-none"
                  value={form.description ?? ""}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Sticky Action Footer - always visible */}
          <div className="px-5 py-4 border-t border-black/5 bg-white shrink-0 safe-bottom">
            <Button
              className="w-full h-14 rounded-full bg-primary text-white hover:bg-black transition-all duration-400 font-bold text-[11px] uppercase tracking-[0.35em] shadow-xl touch-target"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending)
                ? <Loader2 className="animate-spin w-4 h-4" />
                : editing ? "Save Changes" : "Add Product"
              }
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-none bg-white p-8 shadow-2xl max-w-sm">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-5">
            <Trash2 className="w-6 h-6 text-rose-500" />
          </div>
          <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter text-center">Delete Product?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-black/40 text-sm font-medium leading-relaxed pt-1">
            This will permanently delete the product. This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex flex-col gap-2.5 mt-6">
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="h-12 rounded-full bg-rose-500 text-white hover:bg-rose-600 font-black text-[9px] uppercase tracking-[0.3em]">
              Confirm Delete
            </AlertDialogAction>
            <AlertDialogCancel className="h-12 rounded-full border-none bg-black/5 text-black hover:bg-black hover:text-white font-black text-[9px] uppercase tracking-[0.3em]">
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-white min-h-screen">
          <AdminLayout>
            <AdminProductsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
