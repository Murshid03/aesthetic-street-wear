import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProductInput {
    stockQuantity: bigint;
    name: string;
    description: string;
    isActive: boolean;
    sizes: Array<string>;
    category: Category;
    image: ExternalBlob;
    price: number;
}
export interface OrderItem {
    name: string;
    size: string;
    productId: bigint;
    quantity: bigint;
    price: number;
}
export interface OrderItemInput {
    name: string;
    size: string;
    productId: bigint;
    quantity: bigint;
    price: number;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    userId: Principal;
    createdAt: bigint;
    updatedAt: bigint;
    items: Array<OrderItem>;
    adminNotes: string;
}
export interface SiteSettings {
    description: string;
    whatsappNumber: string;
    shopName: string;
    bannerMessage: string;
}
export interface CartItem {
    size: string;
    productId: bigint;
    quantity: bigint;
}
export interface Product {
    id: bigint;
    stockQuantity: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    sizes: Array<string>;
    updatedAt: bigint;
    category: Category;
    image: ExternalBlob;
    price: number;
}
export enum Category {
    Accessories = "Accessories",
    Pants = "Pants",
    Shirts = "Shirts",
    TShirts = "TShirts"
}
export enum OrderStatus {
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Shipped = "Shipped",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: bigint, size: string, quantity: bigint): Promise<void>;
    addToWishlist(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createOrder(items: Array<OrderItemInput>): Promise<Order>;
    createProduct(input: ProductInput): Promise<Product>;
    deleteProduct(id: bigint): Promise<boolean>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getSettings(): Promise<SiteSettings>;
    getUserOrders(): Promise<Array<Order>>;
    getWishlist(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: bigint, size: string): Promise<void>;
    removeFromWishlist(productId: bigint): Promise<void>;
    updateCartItem(productId: bigint, size: string, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus, adminNotes: string): Promise<Order | null>;
    updateProduct(id: bigint, input: ProductInput): Promise<Product | null>;
    updateSettings(updated: SiteSettings): Promise<void>;
}
