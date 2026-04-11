import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const DEFAULT_WHATSAPP = "1234567890";

function generateOrderRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `ASW-${new Date().getFullYear()}-${rand}`;
}

interface SizeRowProps {
  item: CartItem;
  onSizeChange: (productId: number, oldSize: string, newSize: string) => void;
}

function SizeRow({ item, onSizeChange }: SizeRowProps) {
  const sizes = item.product.sizes;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-14 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{item.product.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Qty: {item.quantity}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Size:</span>
          <Select
            value={item.size}
            onValueChange={(val) =>
              onSizeChange(item.productId, item.size, val)
            }
          >
            <SelectTrigger
              className="h-7 text-xs w-24 border-input"
              data-ocid={`size-select-${item.productId}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="font-display font-bold text-sm text-foreground">
          ${(item.product.price * item.quantity).toLocaleString()}
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">
          ${item.product.price.toLocaleString()} each
        </p>
      </div>
    </div>
  );
}

function ConfirmationScreen({
  orderRef,
  onReset,
}: { orderRef: string; onReset: () => void }) {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md text-center"
        >
          <div className="card-elevated p-8 sm:p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366]/15 mb-6 mx-auto"
            >
              <CheckCircle2 className="w-8 h-8 text-[#25D366]" />
            </motion.div>

            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              WhatsApp Opened!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Your order message has been prepared. Complete the order by
              sending the message to us on WhatsApp.
            </p>

            <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Order Reference
              </p>
              <p
                className="font-display font-bold text-lg tracking-widest text-primary"
                data-ocid="order-ref"
              >
                {orderRef}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Save this for order tracking
              </p>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-11 btn-primary"
                data-ocid="track-order-btn"
              >
                <Link to="/account">
                  <Package className="w-4 h-4 mr-2" />
                  Track Your Order
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={onReset}
                data-ocid="continue-shopping-btn"
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Questions? Contact us on WhatsApp anytime.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}

function CheckoutContent() {
  const { items, clearCart, total } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Size change handler using both removeFromCart and addToCart
  const { addToCart, removeFromCart } = useCart();
  const handleSizeChangeReal = (
    productId: number,
    oldSize: string,
    newSize: string,
  ) => {
    const item = items.find(
      (i) => i.productId === productId && i.size === oldSize,
    );
    if (!item || oldSize === newSize) return;
    const qty = item.quantity;
    removeFromCart(productId, oldSize);
    addToCart(item.product, newSize, qty);
  };

  const handlePlaceOrder = () => {
    const ref = generateOrderRef();
    const lineItems = items.map(
      (i) =>
        `• ${i.product.name} | Size: ${i.size} | Qty: ${i.quantity} | $${(i.product.price * i.quantity).toLocaleString()}`,
    );
    const message = [
      "Hello! I would like to place an order from Aesthetic Street Wear:",
      "",
      ...lineItems,
      "",
      `Total: $${total.toLocaleString()}`,
      `Order Ref: ${ref}`,
      ...(customerName ? [`\nMy name: ${customerName}`] : []),
      ...(deliveryAddress ? [`Delivery address: ${deliveryAddress}`] : []),
    ].join("\n");

    const waNumber = DEFAULT_WHATSAPP;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setOrderRef(ref);
    setConfirmed(true);
    clearCart();
  };

  if (confirmed) {
    return (
      <ConfirmationScreen
        orderRef={orderRef}
        onReset={() => navigate({ to: "/" })}
      />
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div
          className="container mx-auto px-4 py-20 text-center"
          data-ocid="checkout-empty"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">
            Nothing to checkout
          </h1>
          <p className="text-muted-foreground mb-8">
            Add items to your cart before proceeding.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const subtotal = total;

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Top bar */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <Link to="/cart">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Cart
              </Link>
            </Button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Checkout
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-display text-3xl font-bold mb-8"
          >
            Place Your Order
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — details + items */}
            <div className="lg:col-span-3 space-y-6">
              {/* Customer details */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="card-elevated p-6"
              >
                <h2 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="inline-flex w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs items-center justify-center font-bold">
                    1
                  </span>
                  Your Details
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    (optional)
                  </span>
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="customer-name" className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="customer-name"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="h-11"
                      data-ocid="checkout-name-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="delivery-address" className="text-sm">
                      Delivery Address
                    </Label>
                    <Input
                      id="delivery-address"
                      placeholder="Street, City, State, PIN"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="h-11"
                      data-ocid="checkout-address-input"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Order items with size confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="card-elevated p-6"
              >
                <h2 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="inline-flex w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs items-center justify-center font-bold">
                    2
                  </span>
                  Confirm Sizes & Items
                </h2>
                <div data-ocid="checkout-items-list">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.productId}-${item.size}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SizeRow
                          item={item}
                          onSizeChange={handleSizeChangeReal}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Right — summary + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <div className="card-elevated p-6 sticky top-24">
                <h2 className="font-display font-bold text-xl mb-5">
                  Order Summary
                </h2>

                {/* Item list */}
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground truncate mr-2 min-w-0">
                        {item.product.name}
                        <Badge
                          variant="outline"
                          className="ml-1.5 text-[9px] px-1 py-0"
                        >
                          {item.size}
                        </Badge>
                        <span className="ml-1">×{item.quantity}</span>
                      </span>
                      <span className="font-medium shrink-0">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-[#25D366]">
                      via WhatsApp
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-bold text-2xl text-primary">
                    ${total.toLocaleString()}
                  </span>
                </div>

                {/* WhatsApp Order Button */}
                <Button
                  className="w-full h-13 text-base font-bold rounded-xl text-white transition-smooth hover:opacity-90 active:scale-95 shadow-md"
                  style={{ background: "#25D366" }}
                  onClick={handlePlaceOrder}
                  data-ocid="whatsapp-order-btn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2.5 shrink-0"
                    fill="currentColor"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>WhatsApp</title>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.523 5.845L0 24l6.335-1.493A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.372l-.359-.213-3.72.876.897-3.617-.234-.371A9.775 9.775 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
                  </svg>
                  Order via WhatsApp
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
                  Contact us via WhatsApp to confirm your order. (Shop owner:
                  update the WhatsApp number in admin settings.)
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <CheckoutContent />
    </ProtectedRoute>
  );
}
