export const AUTH_COOKIE_NAME = "app_token";

export const VALIDATION_MESSAGES = {
  // General
  INVALID_PAGE: "Invalid page parameter",
  // Order Creation
  BODY_MUST_BE_ARRAY: "body must be an array",
  BODY_MIN_ONE_ITEM: "body must have at least one item",
  PRODUCT_ID_REQUIRED: "productId is required",
  PRODUCT_ID_MUST_BE_NUMBER: "productId must be a number",
  PRODUCT_NOT_FOUND: "specified product does not exist",
  QUANTITY_REQUIRED: "quantity is required",
  QUANTITY_MUST_BE_NUMBER: "quantity must be a number",
  QUANTITY_MIN_ONE: "quantity must be greater than 1",
};
