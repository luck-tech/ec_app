import express from "express";
import {query, validationResult} from "express-validator";
import {UnauthorizedError, ValidationError} from "@/lib/errors";
import {ensureAuthUser} from "@/middlewares/authentication";
import {getProduct, getProductSearch, ProductItem} from "@/models/product";

export type productSearchParams = {
  filter?: string;
  page?: string;
};

export type productQueryParams = {
  productIds?: string;
};

export interface getProductSearchApiResponse {
  products: ProductItem[];
  hitCount: number;
}

export const router = express.Router();

router.get(
  "/search",
  ensureAuthUser,
  [
    query("page")
      .optional()
      .isInt({min: 1})
      .withMessage("Invalid page parameter"),
  ],
  async (req: express.Request, res: express.Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(result.array().map(error => error.msg));
    }

    const params: productSearchParams = req.query;
    const filter = params.filter || "";
    const page = params.page ? parseInt(params.page, 10) : 1;

    const results: getProductSearchApiResponse = await getProductSearch({
      filter: filter,
      page: page,
      userId: req.currentUser!.id,
    });

    res.json(results);
  },
);

router.get("/", async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser) {
      throw new UnauthorizedError();
    }
    const params: productQueryParams = req.query;
    const productIds = params.productIds;

    const result = await getProduct({
      productIds: productIds,
      userId: currentUser.id,
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
