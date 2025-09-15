import {JSX} from "react";
import {OrderWithDetails} from "@/types";

export function OrderDetailList({
  order,
}: {
  order: OrderWithDetails;
}): JSX.Element {
  return (
    <ul className="flex flex-col gap-4">
      {order.orderDetails.map(({id, product, price, quantity}) => (
        <li
          key={id}
          className="flex flex-row gap-4"
          data-test={`order-detail-item`}
        >
          <img
            src={`/image/${product.imageName}`}
            className="h-32"
            data-test="order-detail-image"
          />
          <div className="flex flex-col justify-center">
            <div className="font-bold text-lg" data-test="order-detail-name">
              {product.name}
            </div>
            <div data-test="order-detail-price">price: {price} coins</div>
            <div data-test="order-detail-quantity">quantity: {quantity}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
