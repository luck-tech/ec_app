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
const responseSchema = orderWithOrderDetailsSchema;

describe("GET /api/order/:id", () => {
  test("request with parameter", async () => {
    const orderId = 1;
    const res = await sendGetRequest({
      path: `${PATH}/${orderId}`,
      expectedStatusCode: 200,
      userId: USER_ID,
    });

    const actual = responseSchema.parse((await res.json()) as JSONValue);
    const expected = {
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
    };

    expect(actual).toEqual(expected);
  });

  test("request by unauthorized user", async () => {
    const orderId = 1;
    const res = await sendGetRequest({
      path: `${PATH}/${orderId}`,
      expectedStatusCode: 401,
      userId: null,
    });
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);

    expect(actual.message).toBe("Unauthorized");
  });

  test("request with unrelated orderId", async () => {
    const orderId = 3;
    const res = await sendGetRequest({
      path: `${PATH}/${orderId}`,
      expectedStatusCode: 404,
      userId: USER_ID,
    });
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);

    expect(actual.message).toBe("Not Found");
  });

  test("request with non-existent orderId", async () => {
    const orderId = 100;
    const res = await sendGetRequest({
      path: `${PATH}/${orderId}`,
      expectedStatusCode: 404,
      userId: USER_ID,
    });
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);

    expect(actual.message).toBe("Not Found");
  });
});
