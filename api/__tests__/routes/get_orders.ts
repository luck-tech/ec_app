import {z} from "zod";
import {
  JSONValue,
  errorResponseSchema,
  orderWithOrderDetailsSchema,
  parse,
} from "@tests/util/schema";
import {sendGetRequest} from "@tests/util/send_request";
import {orders} from "@db/seed/order";
import {orderDetails} from "@db/seed/order_details";
import {products} from "@db/seed/products";

const PATH = "api/orders";
const USER_ID = 1;
const responseSchema = z.array(orderWithOrderDetailsSchema);

describe("GET /api/orders", () => {
  test("request", async () => {
    const res = await sendGetRequest({
      path: PATH,
      expectedStatusCode: 200,
      userId: USER_ID,
    });
    const actual = responseSchema.parse((await res.json()) as JSONValue);

    const expected = [
      {
        ...orders.find(order => order.id === 2),
        orderDetails: [
          {
            ...orderDetails.find(orderDetail => orderDetail.id === 4),
            product: {
              ...products.find(product => product.id === 1),
            },
          },
          {
            ...orderDetails.find(orderDetail => orderDetail.id === 5),
            product: {
              ...products.find(product => product.id === 2),
            },
          },
          {
            ...orderDetails.find(orderDetail => orderDetail.id === 6),
            product: {
              ...products.find(product => product.id === 3),
            },
          },
        ],
      },
      {
        ...orders.find(order => order.id === 1),
        orderDetails: [
          {
            ...orderDetails.find(orderDetail => orderDetail.id === 1),
            product: {
              ...products.find(product => product.id === 1),
            },
          },
          {
            ...orderDetails.find(orderDetail => orderDetail.id === 2),
            product: {
              ...products.find(product => product.id === 2),
            },
          },
          {
            ...orderDetails.find(orderDetail => orderDetail.id === 3),
            product: {
              ...products.find(product => product.id === 3),
            },
          },
        ],
      },
    ];

    expect(actual).toEqual(expected);
  });

  test("request by unauthorized user", async () => {
    const res = await sendGetRequest({
      path: PATH,
      expectedStatusCode: 401,
      userId: null,
    });
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.message).toBe("Unauthorized");
  });
});
