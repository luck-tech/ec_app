import {z} from "zod";
import {
  JSONValue,
  errorResponseSchema,
  productWithDetailsSchema,
  parse,
} from "@tests/util/schema";
import {sendGetRequest} from "@tests/util/send_request";
import {products} from "@db/seed/products";
import {stocks} from "@db/seed/stocks";
import {orders} from "@db/seed/order";

const PATH = "api/products/search";
const USER_ID = 1;
const responseSchema = z.object({
  products: z.array(productWithDetailsSchema),
  hitCount: z.number(),
});

describe("GET /api/products/search", () => {
  test("request without parameters", async () => {
    const res = await sendGetRequest({
      path: PATH,
      expectedStatusCode: 200,
      userId: USER_ID,
    });

    const actual = parse(responseSchema, (await res.json()) as JSONValue);
    const expectedFirstProduct = {
      ...products.find(product => product.id === 1),
      quantity: stocks.find(stock => stock.id === 1)!.quantity,
      lastOrderedAt: orders.find(order => order.id === 2)!.createdAt,
    };
    const expectedHitCount = products.length;

    expect(actual.products.length).toBe(10);
    expect(actual.products[0]).toEqual(expectedFirstProduct);
    expect(actual.hitCount).toBe(expectedHitCount);
  });

  test("request with filter parameter", async () => {
    const filter = "pen";
    const res = await sendGetRequest({
      path: `${PATH}?filter=${filter}`,
      expectedStatusCode: 200,
      userId: USER_ID,
    });

    const actual = parse(responseSchema, (await res.json()) as JSONValue);
    const expectedProductIds = products
      .filter(product => product.name.includes(filter))
      .map(product => product.id);

    expect(actual.products.length).toBe(expectedProductIds.length);
    expect(actual.hitCount).toBe(expectedProductIds.length);

    const actualProductIds = actual.products.map(product => product.id);
    for (const expectedProductId of expectedProductIds) {
      expect(actualProductIds).toContain(expectedProductId);
    }
  });

  test("request with page parameter", async () => {
    const page = 2;
    const res = await sendGetRequest({
      path: `${PATH}?page=${page}`,
      expectedStatusCode: 200,
      userId: USER_ID,
    });

    const actual = parse(responseSchema, (await res.json()) as JSONValue);
    const expectedProductIds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const expectedHitCount = products.length;

    expect(actual.products.length).toBe(expectedProductIds.length);
    expect(actual.hitCount).toBe(expectedHitCount);

    const actualProductIds = actual.products.map(product => product.id);
    for (const expectedProductId of expectedProductIds) {
      expect(actualProductIds).toContain(expectedProductId);
    }
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
