import express from "express";
import {UnauthorizedError} from "@/lib/errors";
import {
  postOrder,
  InsufficientStockError,
  getOrderById,
  getOrders,
} from "@/models/order";

export const router = express.Router();

export type orderQueryParams = {
  productId: number;
  quantity: number;
};

router.post("/", async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser) {
      throw new UnauthorizedError();
    }

    const params: orderQueryParams[] = req.body;
    const result = await postOrder(params, currentUser.id);
    res.json(result);
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
});

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

router.get("/", async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser) {
      throw new UnauthorizedError();
    }

    const orders = await getOrders(currentUser.id);
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
