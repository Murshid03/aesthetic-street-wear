import { useNotifications } from "@/hooks/use-notifications";
import { Bell, Check, Trash2, Package, RefreshCw, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
    const { notifications, unreadCount, markRead, clearAll, isLoading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'order_status': return <Package className="w-4 h-4 text-blue-500" />;
            case 'restock_alert': return <RefreshCw className="w-4 h-4 text-emerald-500" />;
            default: return <Info className="w-4 h-4 text-primary" />;
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`btn-ghost w-9 h-9 flex items-center justify-center rounded-xl p-0 relative transition-all ${isOpen ? "bg-accent text-primary" : ""}`}
                aria-label="Notifications"
            >
                <Bell className={`w-4.5 h-4.5 ${unreadCount > 0 ? "animate-pulse" : ""}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 card-elevated rounded-2xl z-50 overflow-hidden shadow-2xl flex flex-col max-h-[500px]"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between bg-white sticky top-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
                                        {unreadCount} New
                                    </Badge>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => clearAll()}
                                    className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Clear All
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[200px] bg-secondary/20">
                            {isLoading ? (
                                <div className="p-10 text-center flex flex-col items-center gap-2">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs text-muted-foreground font-medium">Syncing alerts...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Bell className="w-6 h-6 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">All caught up!</p>
                                    <p className="text-xs text-muted-foreground">No alerts for you right now.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {notifications.map((n) => (
                                        <motion.div
                                            layout
                                            key={n._id}
                                            initial={{ backgroundColor: n.isRead ? 'transparent' : 'rgba(var(--primary-rgb), 0.03)' }}
                                            className={`p-4 transition-colors hover:bg-secondary/50 relative group ${!n.isRead ? "bg-primary/5 shadow-[inset_3px_0_0_0_#var(--primary)]" : ""}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'order_status' ? 'bg-blue-50' : n.type === 'restock_alert' ? 'bg-emerald-50' : 'bg-primary/5'}`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-xs font-bold truncate ${n.isRead ? "text-foreground/70" : "text-foreground"}`}>
                                                            {n.title}
                                                        </p>
                                                        {!n.isRead && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[9px] text-muted-foreground/60 font-medium mt-1.5 uppercase tracking-tighter">
                                                        {formatDistanceToNow(new Date(n.createdAt))} ago
                                                    </p>
                                                </div>
                                            </div>

                                            {!n.isRead && (
                                                <button
                                                    onClick={() => markRead(n._id)}
                                                    className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white border border-border shadow-sm text-primary hover:bg-primary hover:text-white"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-border bg-white text-center">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                Aesthetic Street Wear Alerts
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
