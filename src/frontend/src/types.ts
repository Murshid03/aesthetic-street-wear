export type Category = "Shirts" | "TShirts" | "Pants" | "Accessories";

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered";

export interface Product {
  id: number;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  stockQuantity: number;
  sizes: string[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: number;
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  product?: Product;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  adminNotes: string;
}

export interface SiteSettings {
  shopName: string;
  whatsappNumber: string;
  description: string;
  bannerMessage: string;
}

export interface WishlistItem {
  productId: number;
  product: Product;
}
