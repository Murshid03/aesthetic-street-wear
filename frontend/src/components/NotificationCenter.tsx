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
                        className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-80 lg:w-72 bg-white rounded-3xl border border-black/5 z-50 overflow-hidden shadow-2xl flex flex-col max-h-[60vh] sm:max-h-[450px]"
                    >
                        <div className="px-5 py-3 border-b border-black/5 flex items-center justify-between bg-white sticky top-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Alerts</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-primary text-white text-[9px] font-black h-4 px-1.5 rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => clearAll()}
                                    className="text-[9px] uppercase tracking-widest font-black text-black/30 hover:text-rose-500 transition-colors"
                                >
                                    Flush All
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[150px] bg-white">
                            {isLoading ? (
                                <div className="p-10 text-center flex flex-col items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    <span className="text-[9px] text-black/40 font-black uppercase tracking-widest">Syncing...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-10 text-center flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                        <Bell className="w-4 h-4 text-black/10" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black/20">System Empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/[0.03]">
                                    {notifications.map((n) => (
                                        <motion.div
                                            layout
                                            key={n._id}
                                            className={`p-4 transition-colors hover:bg-black/[0.02] relative group ${!n.isRead ? "bg-primary/[0.02]" : ""}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-primary/5' : 'bg-black/5'}`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${n.isRead ? "text-black/40" : "text-black"}`}>
                                                            {n.title}
                                                        </p>
                                                        {!n.isRead && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-black/60 leading-relaxed mt-0.5 line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[8px] text-black/30 font-black mt-1.5 uppercase tracking-widest">
                                                        {formatDistanceToNow(new Date(n.createdAt))} ago
                                                    </p>
                                                </div>
                                            </div>

                                            {!n.isRead && (
                                                <button
                                                    onClick={() => markRead(n._id)}
                                                    className="absolute right-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white border border-black/5 shadow-sm text-black hover:bg-black hover:text-white"
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

                        <div className="px-5 py-3 border-t border-black/5 bg-black/[0.01] text-center">
                            <span className="text-[8px] text-black/20 font-black uppercase tracking-[0.3em]">
                                ASW // ALERT PROTOCOL
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
