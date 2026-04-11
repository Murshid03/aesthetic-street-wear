import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OrderTypes "../types/orders";
import OrdersLib "../lib/orders";

mixin (
  accessControlState : AccessControl.AccessControlState,
  orders : Map.Map<Nat, OrderTypes.Order>,
  nextOrderId : { var val : Nat },
) {
  public shared ({ caller }) func createOrder(items : [OrderTypes.OrderItemInput]) : async OrderTypes.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to place an order");
    };
    OrdersLib.createOrder(orders, nextOrderId, caller, items);
  };

  public query ({ caller }) func getUserOrders() : async [OrderTypes.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please log in to view your orders");
    };
    OrdersLib.getUserOrders(orders, caller);
  };

  public query ({ caller }) func getAllOrders() : async [OrderTypes.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    OrdersLib.getAllOrders(orders);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderTypes.OrderStatus, adminNotes : Text) : async ?OrderTypes.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    OrdersLib.updateOrderStatus(orders, orderId, status, adminNotes);
  };
};
