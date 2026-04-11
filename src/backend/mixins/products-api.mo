import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProductTypes "../types/products";
import ProductsLib "../lib/products";

mixin (
  accessControlState : AccessControl.AccessControlState,
  products : Map.Map<Nat, ProductTypes.Product>,
  nextProductId : { var val : Nat },
) {
  // Seed sample products on first deploy
  var _seeded : Bool = false;
  if (not _seeded) {
    ProductsLib.seedSampleProducts(products, nextProductId);
    _seeded := true;
  };

  public shared ({ caller }) func createProduct(input : ProductTypes.ProductInput) : async ProductTypes.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    ProductsLib.createProduct(products, nextProductId, input);
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductTypes.ProductInput) : async ?ProductTypes.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    ProductsLib.updateProduct(products, id, input);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    ProductsLib.deleteProduct(products, id);
  };

  public query func getProduct(id : Nat) : async ?ProductTypes.Product {
    ProductsLib.getProduct(products, id);
  };

  public query func getAllProducts() : async [ProductTypes.Product] {
    ProductsLib.getAllProducts(products);
  };

  public query func getProductsByCategory(category : ProductTypes.Category) : async [ProductTypes.Product] {
    ProductsLib.getProductsByCategory(products, category);
  };
};
