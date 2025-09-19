import express from "express";
import {validationResult} from "express-validator";
import {ValidationError, NotFoundError, BadRequestError} from "@/lib/errors";
import {ensureAuthUser} from "@/middlewares/authentication";
import {postOrder, getOrderById, getOrders} from "@/models/order";
import {OrderQueryParams} from "@/types/order";
import {createOrderValidations} from "@/middlewares/validation";

export const router = express.Router();

router.post(
  "/",
  ensureAuthUser,
  createOrderValidations,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(result.array().map(error => error.msg));
    }
    try {
      const params: OrderQueryParams[] = req.body;
      const orderResult = await postOrder(params, req.currentUser!.id);
      if (!orderResult.success && orderResult.errors) {
        throw new ValidationError(orderResult.errors);
      }
      res.json(orderResult);
    } catch (error) {
      next(error);
    }
  },
);

router.get("/:id", ensureAuthUser, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestError();
    }

    const order = await getOrderById(orderId, req.currentUser!.id);
    if (!order) {
      throw new NotFoundError();
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/", ensureAuthUser, async (req, res, next) => {
  try {
    const orders = await getOrders(req.currentUser!.id); // ensureAuthUserで非nullは保証済み
    if (!orders) {
      throw new NotFoundError();
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
});
