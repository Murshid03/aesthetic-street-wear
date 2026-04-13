import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";

// Lazy pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ShirtsPage = lazy(() => import("@/pages/ShirtsPage"));
const TShirtsPage = lazy(() => import("@/pages/TShirtsPage"));
const PantsPage = lazy(() => import("@/pages/PantsPage"));
const AccessoriesPage = lazy(() => import("@/pages/AccessoriesPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AdminProductsPage = lazy(() => import("@/pages/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("@/pages/AdminOrdersPage"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

// Root
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const shirtsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shirts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ShirtsPage />
    </Suspense>
  ),
});

const tshirtsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tshirts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TShirtsPage />
    </Suspense>
  ),
});

const pantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pants",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PantsPage />
    </Suspense>
  ),
});

const accessoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accessories",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AccessoriesPage />
    </Suspense>
  ),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProductPage />
    </Suspense>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CartPage />
    </Suspense>
  ),
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <WishlistPage />
    </Suspense>
  ),
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute>
        <AccountPage />
      </ProtectedRoute>
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute adminOnly>
        <AdminPage />
      </ProtectedRoute>
    </Suspense>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute adminOnly>
        <AdminProductsPage />
      </ProtectedRoute>
    </Suspense>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/orders",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute adminOnly>
        <AdminOrdersPage />
      </ProtectedRoute>
    </Suspense>
  ),
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute adminOnly>
        <AdminSettingsPage />
      </ProtectedRoute>
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CheckoutPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shirtsRoute,
  tshirtsRoute,
  pantsRoute,
  accessoriesRoute,
  productRoute,
  cartRoute,
  wishlistRoute,
  accountRoute,
  adminRoute,
  adminProductsRoute,
  adminOrdersRoute,
  adminSettingsRoute,
  loginRoute,
  checkoutRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const loadUser = useAuth((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <CartProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </CartProvider>
  );
}
