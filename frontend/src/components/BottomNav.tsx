import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export function BottomNav() {
    const { pathname } = useLocation();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    const navItems = [
        { icon: Home, label: "Home", to: "/" },
        { icon: Search, label: "Shop", to: "/shirts" },
        { icon: Heart, label: "Saved", to: "/wishlist", count: wishlistCount },
        { icon: ShoppingBag, label: "Cart", to: "/cart", count: cartCount },
        { icon: User, label: "Profile", to: "/account" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
            {/* Background with advanced glassmorphism and shadow */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl border-t border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" />

            <div className="relative container mx-auto px-6 h-20 flex items-center justify-between pointer-events-auto pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${isActive ? "text-primary" : "text-black/30 hover:text-black/60"
                                }`}
                        >
                            <div className="relative">
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[8px] font-black text-white shadow-lg animate-scale-in">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300">
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
