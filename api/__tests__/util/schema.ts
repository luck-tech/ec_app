import {z} from "zod";

export type JSONValue =
  | string
  | number
  | boolean
  | {[x: string]: JSONValue}
  | JSONValue[];

export const parse = <T extends z.ZodTypeAny>(
  schema: T,
  json: JSONValue,
): z.infer<T> => {
  return schema.parse(json);
};

export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(z.string()).optional(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  imageName: z.string(),
  stockId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const orderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const orderDetailsSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productId: z.number(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const productWithDetailsSchema = productSchema.extend({
  quantity: z.number(),
  lastOrderedAt: z.coerce.date().optional(),
});

export const orderDetailWithProductSchema = orderDetailsSchema.extend({
  product: productSchema,
});

export const orderWithOrderDetailsSchema = orderSchema.extend({
  orderDetails: z.array(orderDetailWithProductSchema),
});
