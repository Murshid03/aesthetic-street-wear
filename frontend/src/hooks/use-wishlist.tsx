import type { Product, WishlistItem } from "@/types";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useAuth } from "./use-auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface WishlistContextValue {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string | undefined) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Use a user-specific key for the wishlist
  const WISHLIST_KEY = useMemo(() => {
    return user?._id ? `asw_wishlist_${user._id}` : null;
  }, [user?._id]);

  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist when user changes
  useEffect(() => {
    if (WISHLIST_KEY) {
      try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        setItems(raw ? (JSON.parse(raw) as WishlistItem[]) : []);
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [WISHLIST_KEY]);

  // Save wishlist whenever items change
  useEffect(() => {
    if (WISHLIST_KEY && items.length >= 0) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    }
  }, [items, WISHLIST_KEY]);

  const addToWishlist = (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please login to manage your wishlist."
      });
      navigate({ to: "/login" });
      return;
    }

    const pid = product._id || (product as any).id;
    setItems((prev) => {
      if (prev.find((i) => i.productId === pid)) return prev;
      return [...prev, { productId: pid, product }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const isInWishlist = (productId: string | undefined) =>
    productId ? items.some((i) => i.productId === productId) : false;

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

