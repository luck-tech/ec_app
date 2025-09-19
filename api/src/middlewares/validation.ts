import { getProduct } from "@/models/product";
import { CustomValidator } from "express-validator";

export const validateProductExists: CustomValidator = async (value, { req }) => {
  const productId = parseInt(value, 10);

  const product = await getProduct({
    productIds: productId.toString(),
    userId: req.currentUser!.id,
  });

  if (!product || Array.isArray(product) || product.products.length === 0) {
    throw new Error("specified product does not exist");
  }

  return true;
};