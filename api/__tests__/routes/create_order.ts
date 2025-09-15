import {z} from "zod";
import {JSONValue, errorResponseSchema, parse} from "@tests/util/schema";
import {sendPostRequest} from "@tests/util/send_request";
import {products} from "@db/seed/products";

const PATH = "api/orders";
const USER_ID = 2;
const responseSchema = z.object({
  orderId: z.number(),
});

const sendInvalidPostRequest = async (body: JSONValue) => {
  return await sendPostRequest({
    path: PATH,
    expectedStatusCode: 422,
    userId: USER_ID,
    body,
  });
};

describe("POST /api/orders", () => {
  test("request with multiple products", async () => {
    const orderInfo = [
      {productId: 31, quantity: 1},
      {productId: 32, quantity: 2},
      {productId: 33, quantity: 3},
    ];

    const res = await sendPostRequest({
      path: PATH,
      expectedStatusCode: 200,
      userId: USER_ID,
      body: orderInfo,
    });

    const actual = parse(responseSchema, (await res.json()) as JSONValue);
    expect(actual.orderId).toBe(5);

    const prisma = jestPrisma.client;

    const order = await prisma.order.findUniqueOrThrow({where: {id: 5}});
    expect(order.userId).toBe(USER_ID);

    for (const {productId, quantity} of orderInfo) {
      const orderDetail = await prisma.orderDetail.findFirst({
        where: {orderId: order.id, productId, quantity},
      });
      expect(orderDetail).not.toBeNull();

      const product = await prisma.product.findUniqueOrThrow({
        where: {id: productId},
        include: {stock: true},
      });
      expect(product.stock.quantity).toBe(10 - quantity);
    }
  });

  test("request with object", async () => {
    const res = await sendInvalidPostRequest({});
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("body must be an array");
  });

  test("request with empty array", async () => {
    const res = await sendInvalidPostRequest([]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("body must have at least one item");
  });

  test("request with missing productId", async () => {
    const res = await sendInvalidPostRequest([{quantity: 1}]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("productId is required");
  });

  test("request with non-integer productId", async () => {
    const res = await sendInvalidPostRequest([{productId: "a", quantity: 1}]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("productId must be a number");
  });

  test("request with non-existent productId", async () => {
    const res = await sendInvalidPostRequest([{productId: 100, quantity: 1}]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("specified product does not exist");
  });

  test("request with missing quantity", async () => {
    const res = await sendInvalidPostRequest([{productId: 1}]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("quantity is required");
  });

  test("request with non-integer quantity", async () => {
    const res = await sendInvalidPostRequest([{productId: 1, quantity: "a"}]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("quantity must be a number");
  });

  test("request with quantity less than 1", async () => {
    const res = await sendInvalidPostRequest([{productId: 1, quantity: 0}]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain("quantity must be greater than 1");
  });

  test("request with too much quantity", async () => {
    const product = products[0];
    const res = await sendInvalidPostRequest([
      {productId: product.id, quantity: 100},
    ]);
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.errors).toContain(`${product.name} is out of stock`);
  });

  test("request by unauthorized user", async () => {
    const res = await sendPostRequest({
      path: PATH,
      expectedStatusCode: 401,
      userId: null,
    });
    const actual = parse(errorResponseSchema, (await res.json()) as JSONValue);
    expect(actual.message).toBe("Unauthorized");
  });
});
