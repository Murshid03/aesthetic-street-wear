import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Category = {
    #Shirts;
    #TShirts;
    #Pants;
    #Accessories;
  };

  public type Product = {
    id : Nat;
    name : Text;
    category : Category;
    description : Text;
    price : Float;
    image : Storage.ExternalBlob;
    stockQuantity : Nat;
    sizes : [Text];
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type ProductInput = {
    name : Text;
    category : Category;
    description : Text;
    price : Float;
    image : Storage.ExternalBlob;
    stockQuantity : Nat;
    sizes : [Text];
    isActive : Bool;
  };
};
