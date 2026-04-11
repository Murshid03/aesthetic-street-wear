import Map "mo:core/Map";
import List "mo:core/List";
import CartTypes "../types/cart";

module {
  public type CartItem = CartTypes.CartItem;

  public func addToCart(
    carts : Map.Map<Principal, List.List<CartItem>>,
    caller : Principal,
    productId : Nat,
    size : Text,
    quantity : Nat,
  ) {
    let cart = switch (carts.get(caller)) {
      case (?c) c;
      case null {
        let c = List.empty<CartItem>();
        carts.add(caller, c);
        c;
      };
    };
    // If item with same productId+size exists, update quantity
    let existingIdx = cart.findIndex(func(item : CartItem) : Bool {
      item.productId == productId and item.size == size
    });
    switch (existingIdx) {
      case (?idx) {
        let existing = cart.at(idx);
        cart.put(idx, { existing with quantity = existing.quantity + quantity });
      };
      case null {
        cart.add({ productId; size; quantity });
      };
    };
  };

  public func updateCartItem(
    carts : Map.Map<Principal, List.List<CartItem>>,
    caller : Principal,
    productId : Nat,
    size : Text,
    quantity : Nat,
  ) {
    switch (carts.get(caller)) {
      case null {};
      case (?cart) {
        if (quantity == 0) {
          // Remove the item when quantity is set to 0
          let filtered = cart.filter(func(item : CartItem) : Bool {
            not (item.productId == productId and item.size == size)
          });
          cart.clear();
          cart.append(filtered);
        } else {
          cart.mapInPlace(func(item : CartItem) : CartItem {
            if (item.productId == productId and item.size == size) {
              { item with quantity }
            } else { item }
          });
        };
      };
    };
  };

  public func removeFromCart(
    carts : Map.Map<Principal, List.List<CartItem>>,
    caller : Principal,
    productId : Nat,
    size : Text,
  ) {
    switch (carts.get(caller)) {
      case null {};
      case (?cart) {
        let filtered = cart.filter(func(item : CartItem) : Bool {
          not (item.productId == productId and item.size == size)
        });
        cart.clear();
        cart.append(filtered);
      };
    };
  };

  public func clearCart(
    carts : Map.Map<Principal, List.List<CartItem>>,
    caller : Principal,
  ) {
    switch (carts.get(caller)) {
      case null {};
      case (?cart) { cart.clear() };
    };
  };

  public func getCart(
    carts : Map.Map<Principal, List.List<CartItem>>,
    caller : Principal,
  ) : [CartItem] {
    switch (carts.get(caller)) {
      case null [];
      case (?cart) cart.toArray();
    };
  };

  public func addToWishlist(
    wishlists : Map.Map<Principal, List.List<Nat>>,
    caller : Principal,
    productId : Nat,
  ) {
    let wishlist = switch (wishlists.get(caller)) {
      case (?w) w;
      case null {
        let w = List.empty<Nat>();
        wishlists.add(caller, w);
        w;
      };
    };
    // Only add if not already in wishlist
    let alreadyIn = wishlist.find(func(id : Nat) : Bool { id == productId });
    switch (alreadyIn) {
      case null { wishlist.add(productId) };
      case (?_) {};
    };
  };

  public func removeFromWishlist(
    wishlists : Map.Map<Principal, List.List<Nat>>,
    caller : Principal,
    productId : Nat,
  ) {
    switch (wishlists.get(caller)) {
      case null {};
      case (?wishlist) {
        let filtered = wishlist.filter(func(id : Nat) : Bool { id != productId });
        wishlist.clear();
        wishlist.append(filtered);
      };
    };
  };

  public func getWishlist(
    wishlists : Map.Map<Principal, List.List<Nat>>,
    caller : Principal,
  ) : [Nat] {
    switch (wishlists.get(caller)) {
      case null [];
      case (?wishlist) wishlist.toArray();
    };
  };
};
