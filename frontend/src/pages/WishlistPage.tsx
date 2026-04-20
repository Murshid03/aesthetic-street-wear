import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { WishlistItem } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShoppingCart, Sparkles, X, Package, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function SizePickerDialog({
    item,
    open,
    onClose,
    onConfirm,
}: {
    item: WishlistItem | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (size: string) => void;
}) {
    const [selected, setSelected] = useState<string>("");

    if (!item) return null;

    const handleConfirm = () => {
        if (!selected) return;
        onConfirm(selected);
        setSelected("");
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md rounded-[2rem] p-8 border-none shadow-2xl overflow-hidden glass">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                        Select Fitment
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-6 p-4 rounded-2xl bg-black/5 mb-8">
                    <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 rounded-xl object-cover shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-1 truncate">{item.product.name}</h4>
                        <p className="text-lg font-black text-primary">₹{item.product.price.toLocaleString("en-IN")}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Architectural Grid:</p>
                    <div className="flex flex-wrap gap-2">
                        {item.product.sizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                className={`h-12 flex-1 min-w-[60px] flex items-center justify-center text-[11px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${selected === size
                                    ? "border-black bg-black text-white shadow-lg scale-105"
                                    : "border-black/5 hover:border-black/10 text-black/40"
                                    }`}
                                onClick={() => setSelected(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-8">
                    <Button variant="ghost" className="flex-1 h-14 rounded-full text-[10px] font-black uppercase tracking-widest" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 h-14 rounded-full bg-primary text-white hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-20"
                        disabled={!selected}
                        onClick={handleConfirm}
                    >
                        Confirm Loadout
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function WishlistCard({
    item,
    onRemove,
    onMoveToCart,
}: {
    item: WishlistItem;
    onRemove: () => void;
    onMoveToCart: () => void;
}) {
    const { isInWishlist } = useWishlist();
    const wished = isInWishlist(item.productId);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.2 } }}
            className="group flex flex-col bg-white"
        >
            <div className="relative aspect-[3/4.2] overflow-hidden bg-muted rounded-2xl shadow-sm transition-all duration-500 group-hover:shadow-xl">
                <Link to="/product/$id" params={{ id: String(item.productId) }}>
                    <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
                <button
                    onClick={onRemove}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white shadow-lg"
                >
                    <X className="w-4 h-4" />
                </button>
                {item.product.stockQuantity <= 5 && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Critical Stock</span>
                    </div>
                )}
            </div>

            <div className="py-5 space-y-4">
                <div className="space-y-1">
                    <Link to="/product/$id" params={{ id: String(item.productId) }}>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-black hover:text-primary transition-colors line-clamp-1" style={{ fontFamily: "var(--font-accent)" }}>
                            {item.product.name}
                        </h3>
                    </Link>
                    <p className="text-xs font-bold text-black/40">₹{item.product.price.toLocaleString("en-IN")}</p>
                </div>

                <Button
                    onClick={onMoveToCart}
                    className="w-full h-11 rounded-full bg-black text-white hover:bg-primary transition-all duration-500 font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-3 h-3" />
                    Transfer to Cart
                </Button>
            </div>
        </motion.div>
    );
}

export default function WishlistPage() {
    const { items, removeFromWishlist, itemCount } = useWishlist();
    const { addToCart } = useCart();
    const [pendingItem, setPendingItem] = useState<WishlistItem | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleMoveToCart = (item: WishlistItem) => {
        if (item.product.sizes.length === 1) {
            addToCart(item.product, item.product.sizes[0]);
            removeFromWishlist(item.productId);
            toast.success("Segment Transferred", { description: `${item.product.name} added to loadout.` });
            return;
        }
        setPendingItem(item);
        setDialogOpen(true);
    };

    const handleSizeConfirm = (size: string) => {
        if (!pendingItem) return;
        addToCart(pendingItem.product, size);
        removeFromWishlist(pendingItem.productId);
        toast.success("Fitment Specified", { description: `${pendingItem.product.name} (${size}) added to loadout.` });
        setPendingItem(null);
        setDialogOpen(false);
    };

    return (
        <Layout>
            {/* ── Editorial Header ────────────────────────────────────────── */}
            <section className="pt-20 lg:pt-32 pb-12 lg:pb-20 bg-white border-b border-black/5">
                <div className="container mx-auto px-6 lg:px-12">
                    <nav className="flex items-center justify-center md:justify-start gap-2 lg:gap-3 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-6 lg:mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
                        <Link to="/" className="hover:text-primary transition-colors">Hub</Link>
                        <ChevronRight className="w-2.5 h-2.5" />
                        <span className="text-primary italic">Saved Project</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="max-w-xl text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 lg:mb-6">
                                <div className="w-8 lg:w-12 h-[2px] bg-primary" />
                                <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-primary">Personal Curation</span>
                            </div>
                            <h1 className="text-4xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-display)" }}>
                                MY <br /> <span className="text-primary italic">WISHLIST</span>
                            </h1>
                        </div>

                        {itemCount > 0 && (
                            <div className="flex flex-col items-end gap-2 text-right">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Current Loadout</p>
                                <div className="text-4xl font-black text-black leading-none">{itemCount < 10 ? `0${itemCount}` : itemCount}</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Main Content ────────────────────────────────────────────── */}
            <section className="py-12 lg:py-20 bg-white min-h-[60vh] pb-32">
                <div className="container mx-auto px-6 lg:px-12">
                    {itemCount === 0 ? (
                        <div className="py-32 text-center max-w-md mx-auto">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/5 mb-10">
                                <Heart className="w-10 h-10 text-black/10" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-display)" }}>Archive Empty</h2>
                            <p className="text-black/40 text-sm font-medium leading-relaxed mb-12">No signatures have been curated yet. Explore the primary archive to begin your collection.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Button asChild className="h-14 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest">
                                    <Link to="/shirts">Shop Shirts</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-14 rounded-full border-black/10 text-[10px] font-black uppercase tracking-widest">
                                    <Link to="/accessories">Accessories</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16"
                        >
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <WishlistCard
                                        key={item.productId}
                                        item={item}
                                        onRemove={() => removeFromWishlist(item.productId)}
                                        onMoveToCart={() => handleMoveToCart(item)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            <SizePickerDialog
                item={pendingItem}
                open={dialogOpen}
                onClose={() => {
                    setPendingItem(null);
                    setDialogOpen(false);
                }}
                onConfirm={handleSizeConfirm}
            />
        </Layout>
    );
}
