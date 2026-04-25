export type Category = "Shirts" | "T-Shirts" | "Pants" | "Accessories";

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface Product {
  _id: string; // MongoDB ID
  id?: string; // Compatibility
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  stockQuantity: number;
  sizes: string[];
  isSoldOut: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'order_status' | 'restock_alert' | 'general';
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  product?: Product;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  customerName: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes: string;
  trackingId?: string;
  paymentMethod: string;
}

export interface SiteSettings {
  shopName: string;
  whatsappNumber: string;
  description: string;
  bannerMessage: string;
  email: string;
  address?: string;
}

export type Settings = SiteSettings;

export interface WishlistItem {
  productId: string;
  product: Product;
}
