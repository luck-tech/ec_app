import express from "express";
import {validationResult} from "express-validator";
import {UnauthorizedError, ValidationError} from "@/lib/errors";
import {ensureAuthUser} from "@/middlewares/authentication";
import {postOrder, getOrderById, getOrders} from "@/models/order";
import {InsufficientStockError, OrderQueryParams} from "@/types/order";
import {createOrderValidations} from "@/middlewares/validation";

export const router = express.Router();

router.post(
  "/",
  ensureAuthUser,
  createOrderValidations,
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

router.get("/:id", ensureAuthUser, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      res.status(400).json({message: "Invalid order ID"});
      return;
    }

    const order = await getOrderById(orderId, req.currentUser!.id);
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
