import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import ProductTypes "../types/products";

module {
  public type Product = ProductTypes.Product;
  public type ProductInput = ProductTypes.ProductInput;
  public type Category = ProductTypes.Category;

  // Sample products seeded at startup
  public func seedSampleProducts(
    products : Map.Map<Nat, Product>,
    nextId : { var val : Nat },
  ) {
    let now = Time.now();
    let samples : [(Text, Category, Text, Float, [Text], Nat)] = [
      ("Classic Oxford Shirt", #Shirts, "Timeless Oxford shirt in premium cotton. Perfect for casual and semi-formal occasions.", 49.99, ["S", "M", "L", "XL", "XXL"], 50),
      ("Flannel Check Shirt", #Shirts, "Warm flannel shirt with a bold check pattern. Ideal for layering in cooler weather.", 44.99, ["S", "M", "L", "XL"], 40),
      ("Slim Fit Dress Shirt", #Shirts, "Crisp slim-fit dress shirt with a subtle texture. Great for office or evening wear.", 54.99, ["S", "M", "L", "XL", "XXL"], 30),
      ("Oversized Graphic Tee", #TShirts, "Bold street-art graphic tee in 100% cotton. A staple for any street-wear wardrobe.", 29.99, ["S", "M", "L", "XL", "XXL"], 80),
      ("Essential Plain Tee", #TShirts, "Ultra-soft, heavyweight plain tee available in a neutral palette. Wear alone or layer it.", 24.99, ["S", "M", "L", "XL", "XXL"], 100),
      ("Logo Drop Shoulder Tee", #TShirts, "Relaxed drop-shoulder fit with embroidered logo detail. The cornerstone of every outfit.", 34.99, ["S", "M", "L", "XL"], 60),
      ("Slim Fit Chinos", #Pants, "Tailored slim-fit chinos in a stretch-cotton blend. Smart enough for work, casual enough for weekends.", 59.99, ["28", "30", "32", "34", "36"], 45),
      ("Cargo Jogger Pants", #Pants, "Street-ready cargo joggers with zip pockets and a tapered leg. Comfort meets utility.", 54.99, ["S", "M", "L", "XL", "XXL"], 35),
      ("Straight Leg Denim", #Pants, "Classic straight-leg jeans in rigid denim. Timeless cut that pairs with everything.", 64.99, ["28", "30", "32", "34", "36"], 55),
      ("Leather Bifold Wallet", #Accessories, "Minimalist full-grain leather bifold wallet with 6 card slots and a cash compartment.", 39.99, ["One Size"], 70),
      ("Snapback Cap", #Accessories, "Structured snapback cap with embroidered logo. Adjustable fit suits all head sizes.", 27.99, ["One Size"], 90),
      ("Canvas Tote Bag", #Accessories, "Heavy-duty canvas tote with reinforced handles and inner zip pocket. Perfect for daily carry.", 32.99, ["One Size"], 65),
    ];

    for ((name, category, description, price, sizes, stock) in samples.values()) {
      let id = nextId.val;
      let emptyBlob : Storage.ExternalBlob = "" : Blob;
      let product : Product = {
        id;
        name;
        category;
        description;
        price;
        image = emptyBlob;
        stockQuantity = stock;
        sizes;
        isActive = true;
        createdAt = now;
        updatedAt = now;
      };
      products.add(id, product);
      nextId.val += 1;
    };
  };

  public func createProduct(
    products : Map.Map<Nat, Product>,
    nextId : { var val : Nat },
    input : ProductInput,
  ) : Product {
    let now = Time.now();
    let id = nextId.val;
    let product : Product = {
      id;
      name = input.name;
      category = input.category;
      description = input.description;
      price = input.price;
      image = input.image;
      stockQuantity = input.stockQuantity;
      sizes = input.sizes;
      isActive = input.isActive;
      createdAt = now;
      updatedAt = now;
    };
    products.add(id, product);
    nextId.val += 1;
    product;
  };

  public func updateProduct(
    products : Map.Map<Nat, Product>,
    id : Nat,
    input : ProductInput,
  ) : ?Product {
    switch (products.get(id)) {
      case null null;
      case (?existing) {
        let now = Time.now();
        let updated : Product = {
          existing with
          name = input.name;
          category = input.category;
          description = input.description;
          price = input.price;
          image = input.image;
          stockQuantity = input.stockQuantity;
          sizes = input.sizes;
          isActive = input.isActive;
          updatedAt = now;
        };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteProduct(
    products : Map.Map<Nat, Product>,
    id : Nat,
  ) : Bool {
    switch (products.get(id)) {
      case null false;
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  public func getProduct(
    products : Map.Map<Nat, Product>,
    id : Nat,
  ) : ?Product {
    products.get(id);
  };

  public func getAllProducts(
    products : Map.Map<Nat, Product>,
  ) : [Product] {
    let result = List.empty<Product>();
    for ((_, p) in products.entries()) {
      if (p.isActive) { result.add(p) };
    };
    result.toArray();
  };

  public func getProductsByCategory(
    products : Map.Map<Nat, Product>,
    category : Category,
  ) : [Product] {
    let result = List.empty<Product>();
    for ((_, p) in products.entries()) {
      if (p.isActive and p.category == category) { result.add(p) };
    };
    result.toArray();
  };
};
