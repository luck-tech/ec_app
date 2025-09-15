import {OrderWithDetails} from "@/types";
import {JSX} from "react";

export function OrderSummary({order}: {order: OrderWithDetails}): JSX.Element {
  const totalPrice = order.orderDetails.reduce(
    (a, b) => a + b.price * b.quantity,
    0,
  );
  const totalQuantity = order.orderDetails.reduce((a, b) => a + b.quantity, 0);
  const orderDate = new Date(order.createdAt);

  return (
    <ul className="flex flex-col gap-1">
      <li data-test="order-date">
        Order date: {orderDate.getFullYear()}/{orderDate.getMonth() + 1}/
        {orderDate.getDate()}
      </li>
      <li data-test="order-total-price">Total price: {totalPrice} coins</li>
      <li data-test="order-total-quantity">Total quantity: {totalQuantity}</li>
    </ul>
  );
}
