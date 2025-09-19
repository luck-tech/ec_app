import express from "express";
import {ValidationError, NotFoundError, BadRequestError} from "@/lib/errors";
import {ensureAuthUser} from "@/middlewares/authentication";
import {postOrder, getOrderById, getOrders} from "@/models/order";
import {OrderQueryParams} from "@/types/order";
import {
  createOrderValidations,
  handleValidationErrors,
} from "@/middlewares/validation";
import {asyncHandler} from "@/lib/request_handler";

export const router = express.Router();

router.post(
  "/",
  ensureAuthUser,
  createOrderValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const params: OrderQueryParams[] = req.body;
    const orderResult = await postOrder(params, req.currentUser!.id);
    if (!orderResult.success && orderResult.errors) {
      throw new ValidationError(orderResult.errors);
    }
    res.json(orderResult);
  }),
);

router.get(
  "/:id",
  ensureAuthUser,
  asyncHandler(async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestError();
    }

    const order = await getOrderById(orderId, req.currentUser!.id);
    if (!order) {
      throw new NotFoundError();
    }

    res.json(order);
  }),
);

router.get(
  "/",
  ensureAuthUser,
  asyncHandler(async (req, res) => {
    const orders = await getOrders(req.currentUser!.id); // ensureAuthUserで非nullは保証済み
    if (!orders) {
      throw new NotFoundError();
    }

    res.json(orders);
  }),
);
