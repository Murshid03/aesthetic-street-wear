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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Check,
  ChevronRight,
  Filter
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
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-300 ${active
              ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
              : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50"
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
      toast.success("Product created successfully", {
        description: `${form.name} has been added to the store.`
      });
      setIsOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product updated", {
        description: `Changes to ${form.name} have been saved.`
      });
      setIsOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      toast.success("Product removed", {
        description: "The product has been permanently deleted."
      });
      setDeleteId(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to delete product"),
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
      price: 0,
      image: ""
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
    if (!form.name?.trim() || form.price === undefined || form.price < 0) {
      toast.error("Valid name and price are required");
      return;
    }
    if (!form.sizes?.length) {
      toast.error("Select at least one size");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      const value = (form as any)[key];
      if (key === "sizes") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "image" && selectedFile) {
        // Skip adding the image string preview if we're uploading a new file
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editing) {
      updateMutation.mutate({ id: editing._id!, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-background/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-foreground font-display font-semibold text-lg">Inventory is loading</p>
        <p className="text-muted-foreground text-sm">Please wait while we fetch your products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-primary mb-2">
            <span className="w-8 h-[1px] bg-primary"></span>
            Management Console
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Inventory <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
            Create and curate your premium fashion collection. Every piece added here defines the brand's visual identity.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="h-12 px-6 rounded-2xl btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Signature Piece
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/50 backdrop-blur-md p-4 rounded-3xl border border-border/60 shadow-sm sticky top-20 z-20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog by name..."
            className="pl-11 h-11 bg-background/50 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex p-1 bg-muted/50 rounded-2xl border border-border/50">
            {["all", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === cat
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {cat === "T-Shirts" ? "T-Shirts" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 sm:py-32 card-elevated rounded-[40px] border-dashed border-2 bg-muted/20"
        >
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6 group">
            <PackageSearch className="w-10 h-10 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">No products found</h2>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed mb-8">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" className="rounded-2xl" onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>
            Reset Filters
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <span>Product Collection</span>
            <span>{filtered.length} Items Listed</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, idx) => (
                <motion.div
                  layout
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className="group relative bg-card hover:bg-muted/30 border border-border/50 hover:border-primary/20 rounded-3xl p-4 transition-all duration-500 overflow-hidden flex items-center gap-6"
                >
                  {/* Product Preview */}
                  <div className="w-20 h-24 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500")}
                    />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 rounded-md h-5 border-primary/20 text-primary bg-primary/5">
                        {p.category}
                      </Badge>
                      {!p.isActive && (
                        <Badge className="bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-wider h-5 rounded-md">
                          Draft
                        </Badge>
                      )}
                      {p.stockQuantity <= 5 && p.isActive && (
                        <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-wider h-5 rounded-md">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:translate-x-1 transition-transform duration-500">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        <Plus className="w-2.5 h-2.5" /> {p.sizes.length} Sizes Available
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Inventory: <span className={p.stockQuantity === 0 ? "text-destructive" : "text-foreground"}>{p.stockQuantity} Pcs</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex items-center gap-6 pr-2">
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Price</p>
                      <p className="font-display font-black text-xl text-foreground">₹{p.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(p)}
                        className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(p._id!)}
                        className="h-10 w-10 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Editor Drawer (Sheet) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 glass-blur-lg border-l-border/30">
          <div className="h-2 bg-primary w-full"></div>
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <SheetHeader className="mb-10 text-left">
              <SheetTitle className="font-display text-4xl font-black italic tracking-tighter">
                {editing ? "Edit Piece" : "New Addition"} <span className="text-primary tracking-normal not-italic">.</span>
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-sm uppercase tracking-widest font-bold pt-2">
                Configure your product details with high precision
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-10 pb-8">
              {/* Product Layout Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Visuals */}
                <div className="lg:col-span-full">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                    Product Visual Identity
                  </Label>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-44 rounded-[2rem] bg-muted flex items-center justify-center overflow-hidden border border-border group relative">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500")}
                        />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold" htmlFor="imgFile">Upload Local Image</Label>
                          <Input
                            id="imgFile"
                            type="file"
                            accept="image/*"
                            className="h-12 bg-background/50 rounded-2xl border-border/50 focus-visible:ring-primary/20 pt-2 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedFile(file);
                                const previewUrl = URL.createObjectURL(file);
                                setForm(f => ({ ...f, image: previewUrl }));
                              }
                            }}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/30" />
                          </div>
                          <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground bg-transparent px-2">
                            <span className="bg-card px-2">Or Image URL</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Input
                            id="imgUrl"
                            placeholder="https://images.unsplash.com/..."
                            className="h-12 bg-background/50 rounded-2xl border-border/50 focus-visible:ring-primary/20"
                            value={selectedFile ? "" : (form.image ?? "")}
                            disabled={!!selectedFile}
                            onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                          />
                          {selectedFile && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[10px] h-6 px-2 text-primary"
                              onClick={() => {
                                setSelectedFile(null);
                                setForm(f => ({ ...f, image: editing?.image ?? "" }));
                              }}
                            >
                              Clear selected file to use URL
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Info */}
                <div className="lg:col-span-full space-y-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Category</Label>
                      <Select
                        value={form.category ?? "Shirts"}
                        onValueChange={(v) => setForm(f => ({ ...f, category: v as Category }))}
                      >
                        <SelectTrigger className="h-12 bg-background/50 rounded-2xl border-border/50">
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                          {CATEGORIES.map(c => (
                            <SelectItem key={c} value={c} className="rounded-xl">
                              {c === "T-Shirts" ? "T-Shirts" : c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Status</Label>
                      <div className="flex items-center h-12 px-4 bg-background/50 rounded-2xl border border-border/50 justify-between">
                        <span className="text-sm font-medium">{form.isActive ? "Published" : "Draft (Hidden)"}</span>
                        <Switch
                          checked={form.isActive ?? true}
                          onCheckedChange={(v) => setForm(f => ({ ...f, isActive: v }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Signature Name</Label>
                    <Input
                      placeholder="e.g. Midnight Oversized Oxford"
                      className="h-12 bg-background/50 rounded-2xl border-border/50"
                      value={form.name ?? ""}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Retail Price (₹)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-primary">₹</span>
                        <Input
                          type="number"
                          className="h-12 pl-10 bg-background/50 rounded-2xl border-border/50"
                          value={form.price ?? ""}
                          onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Base Inventory</Label>
                      <Input
                        type="number"
                        className="h-12 bg-background/50 rounded-2xl border-border/50"
                        value={form.stockQuantity ?? ""}
                        onChange={(e) => setForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Sizing Configuration</Label>
                    <SizeSelector
                      selected={form.sizes ?? []}
                      onChange={(s) => setForm(f => ({ ...f, sizes: s }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Description & Fabric</Label>
                    <Textarea
                      placeholder="Detail the materials and the fit..."
                      className="min-h-[120px] bg-background/50 rounded-2xl border-border/50 focus-visible:ring-primary/10 resize-none p-4"
                      value={form.description ?? ""}
                      onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-8 bg-muted/20 backdrop-blur-md border-t border-border/30 gap-3 sm:flex-row flex-col">
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-2xl h-12 flex-1 font-bold text-xs uppercase tracking-widest">
              Discard
            </Button>
            <Button
              className="rounded-2xl h-12 flex-1 btn-primary font-bold text-xs uppercase tracking-widest"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editing ? "Save Architecture" : "Finalize Addition"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Modern Alert Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-[2.5rem] border-none glass-blur-lg p-10 max-w-sm">
          <AlertDialogHeader>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-display text-2xl font-black text-center">De-register Piece?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground text-sm pt-2 leading-relaxed">
              This will permanently remove the piece from the active collection. Data recovery is not possible once executed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-3 mt-8">
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 rounded-2xl bg-destructive text-white hover:bg-destructive/90 font-bold text-xs uppercase tracking-widest"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Destruction"}
            </AlertDialogAction>
            <AlertDialogCancel className="h-12 rounded-2xl border-none hover:bg-muted font-bold text-xs uppercase tracking-widest">
              Preserve
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
        <div className="bg-background min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminProductsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
