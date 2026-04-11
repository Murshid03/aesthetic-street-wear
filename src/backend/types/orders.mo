module {
  public type OrderStatus = {
    #Pending;
    #Confirmed;
    #Shipped;
    #Delivered;
  };

  public type OrderItem = {
    productId : Nat;
    name : Text;
    size : Text;
    quantity : Nat;
    price : Float;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [OrderItem];
    status : OrderStatus;
    createdAt : Int;
    updatedAt : Int;
    adminNotes : Text;
  };

  public type OrderItemInput = {
    productId : Nat;
    name : Text;
    size : Text;
    quantity : Nat;
    price : Float;
  };
};
