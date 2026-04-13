export type Category = "Shirts" | "TShirts" | "Pants" | "Accessories";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes: string;
  paymentMethod: string;
  paymentStatus: string;
}

export interface SiteSettings {
  shopName: string;
  whatsappNumber: string;
  description: string;
  bannerMessage: string;
  email: string;
  address?: string;
}

export interface WishlistItem {
  productId: string;
  product: Product;
}
