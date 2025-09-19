import {getProduct} from "@/models/product";
import {CustomValidator, query, body} from "express-validator";
import {VALIDATION_MESSAGES} from "@/constants/index";

export const validateProductExists: CustomValidator = async (value, {req}) => {
  const productId = parseInt(value, 10);

  const product = await getProduct({
    productIds: productId.toString(),
    userId: req.currentUser!.id,
  });

  if (!product || Array.isArray(product) || product.products.length === 0) {
    throw new Error(VALIDATION_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return true;
};

export const createOrderValidations = [
  body()
    .isArray()
    .withMessage(VALIDATION_MESSAGES.BODY_MUST_BE_ARRAY)
    .bail()
    .isArray({min: 1})
    .withMessage(VALIDATION_MESSAGES.BODY_MIN_ONE_ITEM),

  body("*.productId")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRODUCT_ID_REQUIRED)
    .isInt()
    .withMessage(VALIDATION_MESSAGES.PRODUCT_ID_MUST_BE_NUMBER)
    .custom(validateProductExists),

  body("*.quantity")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.QUANTITY_REQUIRED)
    .isNumeric()
    .withMessage(VALIDATION_MESSAGES.QUANTITY_MUST_BE_NUMBER)
    .isInt({min: 1})
    .withMessage(VALIDATION_MESSAGES.QUANTITY_MIN_ONE),
];

export const getProductSearchValidation = [
  query("page")
    .optional()
    .isInt({min: 1})
    .withMessage(VALIDATION_MESSAGES.INVALID_PAGE),
];
