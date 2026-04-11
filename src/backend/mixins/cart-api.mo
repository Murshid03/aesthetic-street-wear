import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CartTypes "../types/cart";
import CartLib "../lib/cart";

mixin (
  accessControlState : AccessControl.AccessControlState,
  carts : Map.Map<Principal, List.List<CartTypes.CartItem>>,
  wishlists : Map.Map<Principal, List.List<Nat>>,
) {
  public shared ({ caller }) func addToCart(productId : Nat, size : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to use the cart");
    };
    CartLib.addToCart(carts, caller, productId, size, quantity);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, size : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to use the cart");
    };
    CartLib.updateCartItem(carts, caller, productId, size, quantity);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat, size : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to use the cart");
    };
    CartLib.removeFromCart(carts, caller, productId, size);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to use the cart");
    };
    CartLib.clearCart(carts, caller);
  };

  public query ({ caller }) func getCart() : async [CartTypes.CartItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to view the cart");
    };
    CartLib.getCart(carts, caller);
  };

  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to use the wishlist");
    };
    CartLib.addToWishlist(wishlists, caller, productId);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to use the wishlist");
    };
    CartLib.removeFromWishlist(wishlists, caller, productId);
  };

  public query ({ caller }) func getWishlist() : async [Nat] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to view the wishlist");
    };
    CartLib.getWishlist(wishlists, caller);
  };
};
