import {getProduct} from "@/models/product";
import {CustomValidator, query} from "express-validator";
import {body} from "express-validator";

export const validateProductExists: CustomValidator = async (value, {req}) => {
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

export const createOrderValidations = [
  body()
    .isArray()
    .withMessage("body must be an array")
    .bail()
    .isArray({min: 1})
    .withMessage("body must have at least one item"),

  body("*.productId")
    .notEmpty()
    .withMessage("productId is required")
    .isInt()
    .withMessage("productId must be a number")
    .custom(validateProductExists),

  body("*.quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number")
    .isInt({min: 1})
    .withMessage("quantity must be greater than 1"),
];

export const getProductSearchValidation = [
  query("page")
    .optional()
    .isInt({min: 1})
    .withMessage("Invalid page parameter"),
];
