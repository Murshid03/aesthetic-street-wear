import type { CartItem, Product } from "@/types";
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

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Use a user-specific key for the cart
  const CART_KEY = useMemo(() => {
    return user?._id ? `asw_cart_${user._id}` : null;
  }, [user?._id]);

  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart when user changes
  useEffect(() => {
    if (CART_KEY) {
      try {
        const raw = localStorage.getItem(CART_KEY);
        setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
      } catch {
        setItems([]);
      }
    } else {
      // Clear cart items if no user is logged in
      setItems([]);
    }
  }, [CART_KEY]);

  // Save cart whenever items change
  useEffect(() => {
    if (CART_KEY && items.length >= 0) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, CART_KEY]);

  const addToCart = (product: Product, size: string, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please login to add items to your cart."
      });
      navigate({ to: "/login" });
      return;
    }

    const pid = product._id || (product as any).id;
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === pid && i.size === size,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === pid && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId: pid, product, size, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

