import express from "express";
import {UnauthorizedError} from "@/lib/errors";
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

router.get("/search", async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser) {
      throw new UnauthorizedError();
    }
    const params: productSearchParams = req.query;
    const filter = params.filter || "";
    const page = params.page ? parseInt(params.page, 10) : 1;

    if (isNaN(page) || page < 1) {
      res.status(400).json({error: "Invalid page parameter"});
      return;
    }

    const results: getProductSearchApiResponse = await getProductSearch({
      filter: filter,
      page: page,
      userId: currentUser.id,
    });

    res.json(results);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    console.error("Error occurred while searching products:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

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
