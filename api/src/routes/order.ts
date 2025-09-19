import express from "express";
import {body, validationResult, Meta} from "express-validator";
import {UnauthorizedError, ValidationError} from "@/lib/errors";
import {ensureAuthUser} from "@/middlewares/authentication";
import {postOrder, getOrderById, getOrders} from "@/models/order";
import {getProduct} from "@/models/product";
import {InsufficientStockError, OrderQueryParams} from "@/types/order";

export const router = express.Router();

// カスタムバリデーター: 商品の存在チェック
const validateProductExists = async (productId: number, meta: Meta) => {
  const req = meta.req;
  const product = await getProduct({
    productIds: productId.toString(),
    userId: req.currentUser!.id,
  });

  if (!product || Array.isArray(product) || product.products.length === 0) {
    throw new Error("specified product does not exist");
  }
  return true;
};

router.post(
  "/",
  ensureAuthUser,
  [
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
  ],
  async (req: express.Request, res: express.Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(result.array().map(error => error.msg));
    }
    try {
      const params: OrderQueryParams[] = req.body;
      const orderResult = await postOrder(params, req.currentUser!.id);
      res.json(orderResult);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({message: "Unauthorized"});
        return;
      }
      if (error instanceof InsufficientStockError) {
        res
          .status(422)
          .json({message: "Validation Failed", errors: error.errors});
        return;
      }
      console.error("Error occurred while creating orders:", error);
      res.status(500).json({error: "Internal Server Error"});
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser) {
      throw new UnauthorizedError();
    }

    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      res.status(400).json({message: "Invalid order ID"});
      return;
    }

    const order = await getOrderById(orderId, currentUser.id);
    if (!order) {
      res.status(404).json({message: "Not Found"});
      return;
    }

    res.json(order);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    console.error("Error occurred while fetching order:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.get("/", ensureAuthUser, async (req, res) => {
  try {
    const orders = await getOrders(req.currentUser!.id); // ensureAuthUserで非nullは保証済み
    if (!orders) {
      res.status(404).json({message: "Not Found"});
      return;
    }

    res.json(orders);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    console.error("Error occurred while fetching orders:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
