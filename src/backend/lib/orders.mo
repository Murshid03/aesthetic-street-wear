import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import OrderTypes "../types/orders";

module {
  public type Order = OrderTypes.Order;
  public type OrderItem = OrderTypes.OrderItem;
  public type OrderItemInput = OrderTypes.OrderItemInput;
  public type OrderStatus = OrderTypes.OrderStatus;

  public func createOrder(
    orders : Map.Map<Nat, Order>,
    nextId : { var val : Nat },
    caller : Principal,
    items : [OrderItemInput],
  ) : Order {
    let now = Time.now();
    let id = nextId.val;
    let orderItems : [OrderItem] = items.map<OrderItemInput, OrderItem>(
      func(input) {
        {
          productId = input.productId;
          name = input.name;
          size = input.size;
          quantity = input.quantity;
          price = input.price;
        }
      }
    );
    let order : Order = {
      id;
      userId = caller;
      items = orderItems;
      status = #Pending;
      createdAt = now;
      updatedAt = now;
      adminNotes = "";
    };
    orders.add(id, order);
    nextId.val += 1;
    order;
  };

  public func getUserOrders(
    orders : Map.Map<Nat, Order>,
    caller : Principal,
  ) : [Order] {
    let result = List.empty<Order>();
    for ((_, order) in orders.entries()) {
      if (order.userId == caller) { result.add(order) };
    };
    result.toArray();
  };

  public func getAllOrders(
    orders : Map.Map<Nat, Order>,
  ) : [Order] {
    let result = List.empty<Order>();
    for ((_, order) in orders.entries()) {
      result.add(order);
    };
    result.toArray();
  };

  public func updateOrderStatus(
    orders : Map.Map<Nat, Order>,
    orderId : Nat,
    status : OrderStatus,
    adminNotes : Text,
  ) : ?Order {
    switch (orders.get(orderId)) {
      case null null;
      case (?existing) {
        let now = Time.now();
        let updated : Order = {
          existing with
          status;
          adminNotes;
          updatedAt = now;
        };
        orders.add(orderId, updated);
        ?updated;
      };
    };
  };
};
