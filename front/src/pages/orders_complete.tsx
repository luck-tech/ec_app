import {JSX, Suspense} from "react";
import {useParams} from "react-router-dom";
import {useSuspenseQuery} from "@tanstack/react-query";
import {getOrder} from "@/api/orders";
import {Loading} from "@/components/loading";
import {OrderDetailList} from "@/components/order_detail_list";
import {OrderSummary} from "@/components/order_summary";

export function OrdersCompletePage(): JSX.Element {
  const {id} = useParams<{id: string}>();

  return (
    <div className="flex flex-col gap-4">
      <span className="text-lg" data-test="order-complete-message">
        Thank you for your order!
      </span>
      <Suspense fallback={<Loading />}>
        <OrderPanel orderId={Number(id)} />
      </Suspense>
    </div>
  );
}

function OrderPanel({orderId}: {orderId: number}): JSX.Element {
  const {data: order} = useSuspenseQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrder(orderId),
  });

  return (
    <div
      className="p-4 border flex flex-col gap-4"
      data-test={`order-item-${order.id}`}
    >
      <OrderSummary order={order} />
      <OrderDetailList order={order} />
    </div>
  );
}
