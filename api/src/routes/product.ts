import express from "express";
import {validationResult} from "express-validator";
import {UnauthorizedError, ValidationError} from "@/lib/errors";
import {ensureAuthUser} from "@/middlewares/authentication";
import {getProduct, getProductSearch} from "@/models/product";
import {ProductQueryParams} from "@/types/product";
import {getProductSearchValidation} from "@/middlewares/validation";

export const router = express.Router();

router.get(
  "/search",
  ensureAuthUser,
  getProductSearchValidation,
  async (req: express.Request, res: express.Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(result.array().map(error => error.msg));
    }

    const params = req.query;
    const filter = typeof params.filter === "string" ? params.filter : "";
    const page =
      typeof params.page === "string" ? parseInt(params.page, 10) : 1;
    const results = await getProductSearch({
      filter: filter,
      page: page,
      userId: req.currentUser!.id,
    });

    res.json(results);
  },
);

router.get("/", ensureAuthUser, async (req, res) => {
  try {
    const params: ProductQueryParams = req.query;
    const productIds = params.productIds;

    const result = await getProduct({
      productIds: productIds,
      userId: req.currentUser!.id, // ensureAuthUserで非nullは保証済み
    });

    // resultが配列の場合とオブジェクトの場合を処理
    const products = Array.isArray(result) ? result : result.products;

    res.json(products);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    console.error("Error occurred while searching products:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
