import {z} from "zod";
import {sendGetRequest} from "@tests/util/send_request";
import {
  JSONValue,
  errorResponseSchema,
  parse,
  productWithDetailsSchema,
} from "@tests/util/schema";
import {products} from "@db/seed/products";
import {orders} from "@db/seed/order";
import {stocks} from "@db/seed/stocks";

const PATH = "api/products";
const USER_ID = 1;
const responseSchema = z.array(productWithDetailsSchema);

describe("GET /api/products", () => {
  test("request with parameters", async () => {
    const productIds = [1, 4];
    const res = await sendGetRequest({
      path: `${PATH}?productIds=${productIds.join(",")}`,
      expectedStatusCode: 200,
      userId: USER_ID,
    });

    const actual = parse(responseSchema, (await res.json()) as JSONValue);
    const expected = [
      {
        ...products.find(product => product.id === 1),
        quantity: stocks.find(stock => stock.id === 1)!.quantity,
        lastOrderedAt: orders.find(order => order.id === 2)!.createdAt,
      },
      {
        ...products.find(product => product.id === 4),
        quantity: stocks.find(stock => stock.id === 4)!.quantity,
      },
    ];

    expect(actual).toEqual(expected);
  });

  test("request without parameter", async () => {
    const res = await sendGetRequest({
      path: PATH,
      expectedStatusCode: 200,
      userId: USER_ID,
    });
    const actual = parse(responseSchema, (await res.json()) as JSONValue);

    expect(actual.length).toBe(0);
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
