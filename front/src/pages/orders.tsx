import {JSX, Suspense, useState} from "react";
import {useSuspenseQuery} from "@tanstack/react-query";
import {getOrders} from "@/api/orders";
import {Loading} from "@/components/loading";
import {OrderDetailList} from "@/components/order_detail_list";
import {OrderSummary} from "@/components/order_summary";
import {OrderWithDetails} from "@/types";

export function OrdersPage(): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersPanel />
    </Suspense>
  );
}

export function OrdersPanel(): JSX.Element {
  const {data: orders} = useSuspenseQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const thisYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState<number>(thisYear);
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(thisYear - i);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="year">orders placed in</label>
        <select
          id="year"
          value={targetYear}
          onChange={event => setTargetYear(parseInt(event.target.value))}
          className="border"
          data-test="year-selector"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <OrderList orders={orders} year={targetYear} />
    </div>
  );
}

function OrderList({
  orders,
  year,
}: {
  orders: OrderWithDetails[];
  year: number;
}): JSX.Element {
  const filteredOrders = orders.filter(
    order => new Date(order.createdAt).getFullYear() === year,
  );

  if (filteredOrders.length === 0) {
    return <div data-test="no-orders-message">No orders found</div>;
  }

  return (
    <ul className="flex flex-col gap-y-8" data-test="order-list">
      {filteredOrders.map(order => (
        <li
          className="p-4 border flex flex-col gap-4"
          key={order.id}
          data-test={`order-item-${order.id}`}
        >
          <OrderSummary order={order} />
          <OrderDetailList order={order} />
        </li>
      ))}
    </ul>
  );
}
