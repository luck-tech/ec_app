import {throwResponseError} from "@/lib/error";
import {Cart, OrderWithDetails} from "@/types";

export const getOrders = async (): Promise<OrderWithDetails[]> => {
  const url = `/api/orders`;
  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

export const getOrder = async (id: number): Promise<OrderWithDetails> => {
  const url = `/api/orders/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

export const createOrder = async (cart: Cart): Promise<{orderId: number}> => {
  const url = `/api/orders`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      Object.entries(cart).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
      })),
    ),
  });
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};
