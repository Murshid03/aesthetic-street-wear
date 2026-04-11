import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ProductTypes "types/products";
import OrderTypes "types/orders";
import CartTypes "types/cart";
import SettingsTypes "types/settings";
import SettingsLib "lib/settings";
import ProductsApi "mixins/products-api";
import CartApi "mixins/cart-api";
import OrdersApi "mixins/orders-api";
import SettingsApi "mixins/settings-api";

actor {
  // Auth
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage
  include MixinObjectStorage();

  // Products state
  let products = Map.empty<Nat, ProductTypes.Product>();
  let nextProductId = { var val : Nat = 1 };

  // Cart & wishlist state
  let carts = Map.empty<Principal, List.List<CartTypes.CartItem>>();
  let wishlists = Map.empty<Principal, List.List<Nat>>();

  // Orders state
  let orders = Map.empty<Nat, OrderTypes.Order>();
  let nextOrderId = { var val : Nat = 1 };

  // Settings state — initialised from defaults
  let settings = { var val : SettingsTypes.SiteSettings = SettingsLib.defaultSettings() };

  // Mixins
  include ProductsApi(accessControlState, products, nextProductId);
  include CartApi(accessControlState, carts, wishlists);
  include OrdersApi(accessControlState, orders, nextOrderId);
  include SettingsApi(accessControlState, settings);
};
