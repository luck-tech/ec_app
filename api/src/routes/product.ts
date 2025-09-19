import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {getProduct, getProductSearch} from "@/models/product";
import {ProductQueryParams} from "@/types/product";
import {
  getProductSearchValidation,
  handleValidationErrors,
} from "@/middlewares/validation";
import {asyncHandler} from "@/lib/request_handler";

export const router = express.Router();

router.get(
  "/search",
  ensureAuthUser,
  getProductSearchValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
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
  }),
);

router.get(
  "/",
  ensureAuthUser,
  asyncHandler(async (req, res) => {
    const params: ProductQueryParams = req.query;
    const productIds = params.productIds;

    const result = await getProduct({
      productIds: productIds,
      userId: req.currentUser!.id, // ensureAuthUserで非nullは保証済み
    });

    // resultが配列の場合とオブジェクトの場合を処理
    const products = Array.isArray(result) ? result : result.products;

    res.json(products);
  }),
);
