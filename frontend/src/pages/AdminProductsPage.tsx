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
    <div className="flex flex-wrap gap-2 mt-4">
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
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${active
              ? "bg-black text-white border-black shadow-lg scale-105"
              : "bg-white border-black/5 text-black/40 hover:border-black/20 hover:text-black"
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
    onSuccess: (res) => {
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
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Syncing Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>PRODUCT <br /> <span className="text-primary italic text-3xl md:text-4xl">INVENTORY</span></h1>
        </div>
        <Button
          onClick={openCreate}
          className="h-16 px-10 rounded-full bg-black text-white hover:bg-primary transition-all font-black text-[10px] uppercase tracking-[0.4em] shadow-xl"
        >
          <Plus className="w-4 h-4 mr-3" />
          Add Product
        </Button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-12 xl:col-span-6 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
          <Input
            placeholder="Search Active Catalog..."
            className="h-16 pl-14 pr-6 bg-black/5 rounded-3xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="lg:col-span-12 xl:col-span-6 flex flex-wrap gap-2">
          {["all", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${activeTab === cat
                ? "bg-black text-white border-black shadow-xl"
                : "bg-white border-black/5 text-black/40 hover:border-black/20 hover:text-black"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-40 text-center bg-black/5 rounded-[3rem]">
          <PackageSearch className="w-12 h-12 text-black/10 mx-auto mb-8" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">No matching sequences found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center justify-between px-10 text-[9px] font-black uppercase tracking-[0.4em] text-black/20">
            <span>Product Details</span>
            <span>Availability</span>
          </div>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => (
              <motion.div
                layout
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-[2.5rem] bg-white border border-black/5 hover:shadow-2xl transition-all duration-500 group flex flex-col md:flex-row items-center gap-10"
              >
                <div className="w-24 h-32 rounded-3xl overflow-hidden bg-muted shrink-0 group-hover:scale-105 transition-transform duration-700">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 text-center md:text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-black text-white rounded-full">{p.category}</span>
                    {!p.isActive && <span className="text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-black/5 text-black/40 rounded-full">DRAFT</span>}
                    {p.isSoldOut && <span className="text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-rose-500 text-white rounded-full">EXTINCT</span>}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-black truncate">{p.name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Valuation</span>
                      <span className="text-sm font-black">₹{p.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-px h-6 bg-black/5" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Inventory</span>
                      <span className={`text-sm font-black ${p.stockQuantity <= 5 ? "text-rose-500" : ""}`}>{p.stockQuantity} Fragments</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(p)}
                    className="w-12 h-12 rounded-2xl bg-black/5 hover:bg-black hover:text-white transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSoldOutMutation.mutate(p._id!)}
                    className={`w-12 h-12 rounded-2xl transition-all ${p.isSoldOut ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"}`}
                  >
                    {p.isSoldOut ? <RefreshCw className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(p._id!)}
                    className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col p-10 bg-white border-l border-black/5 shadow-2xl">
          <SheetHeader className="mb-12 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Product Details</span>
            </div>
            <SheetTitle className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
              {editing ? "EDIT" : "ADD"} <br /> <span className="text-primary italic">PRODUCT</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-10 custom-scrollbar">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Product Image</Label>
              <div className="flex gap-6">
                <div className="w-32 h-44 rounded-[2rem] bg-black/5 overflow-hidden border border-black/5 shrink-0">
                  {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-black/5" /></div>}
                </div>
                <div className="flex-1 space-y-4">
                  <Input
                    type="file"
                    className="h-10 text-[9px] font-black uppercase pt-1.5 cursor-pointer rounded-2xl border-black/5 bg-black/5"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setSelectedFile(file); setForm(f => ({ ...f, image: URL.createObjectURL(file) })); }
                    }}
                  />
                  <div className="text-[9px] font-black uppercase tracking-widest text-black/20 text-center">OR</div>
                  <Input
                    placeholder="Image URL"
                    className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-base font-bold outline-none"
                    value={selectedFile ? "" : (form.image ?? "")}
                    onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v as Category }))}>
                  <SelectTrigger className="h-14 px-6 bg-black/5 rounded-2xl text-xs font-bold border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs font-bold uppercase">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Visibility Status</Label>
                <div className="flex items-center h-14 px-6 bg-black/5 rounded-2xl justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest">{form.isActive ? "ACTIVE" : "HIDDEN"}</span>
                  <Switch checked={form.isActive} onCheckedChange={(v) => setForm(f => ({ ...f, isActive: v }))} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Product Name</Label>
              <Input
                placeholder="Product Title"
                className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-base font-bold outline-none"
                value={form.name ?? ""}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Price (₹)</Label>
                <Input
                  type="number"
                  className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-base font-bold outline-none"
                  value={form.price === undefined ? "" : form.price}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm(f => ({ ...f, price: val === "" ? undefined : Number(val) }));
                  }}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Stock Quantity</Label>
                <Input
                  type="number"
                  className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-base font-bold outline-none"
                  value={form.stockQuantity === undefined ? "" : form.stockQuantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm(f => ({ ...f, stockQuantity: val === "" ? undefined : Number(val) }));
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Dimensional Fit (Sizes)</Label>
              <SizeSelector selected={form.sizes ?? []} onChange={(s) => setForm(f => ({ ...f, sizes: s }))} />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Description</Label>
              <Textarea
                placeholder="Product description and details..."
                className="min-h-[150px] p-6 bg-black/5 rounded-[2rem] border-2 border-transparent focus:border-black transition-all text-base font-bold resize-none"
                value={form.description ?? ""}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <SheetFooter className="pt-10 border-t border-black/5">
            <Button
              className="w-full h-16 rounded-full bg-black text-white hover:bg-primary transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.4em] shadow-xl"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" /> : editing ? "SAVE CHANGES" : "ADD PRODUCT"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[3rem] border-none bg-white p-12 shadow-2xl max-w-sm">
          <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-8">
            <Trash2 className="w-8 h-8 text-rose-500" />
          </div>
          <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter text-center">DE-REGISTER?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-black/40 text-sm font-medium leading-relaxed pt-2">
            This will permanently terminate the artifact's presence in the collection. Recovering the sequence is impossible.
          </AlertDialogDescription>
          <div className="flex flex-col gap-3 mt-10">
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="h-16 rounded-full bg-rose-500 text-white hover:bg-rose-600 font-black text-[10px] uppercase tracking-[0.3em]">
              CONFIRM TERMINATION
            </AlertDialogAction>
            <AlertDialogCancel className="h-16 rounded-full border-none bg-black/5 text-black hover:bg-black hover:text-white font-black text-[10px] uppercase tracking-[0.3em]">
              PRESERVE
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
