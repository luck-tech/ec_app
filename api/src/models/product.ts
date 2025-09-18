import {databaseManager} from "@/db";
import {Prisma} from "@prisma/client";

export type ProductItem = {
  id: number; // 商品 ID
  name: string; // 商品名
  price: number; // 商品の価格
  imageName: string; // 商品の画像名
  stockId: number; // 商品に紐づいた在庫 ID
  createdAt: string; // 商品の作成日時
  updatedAt: string; // 商品の更新日時
  quantity: number; // 商品の在庫数（stocks テーブルの quantity カラム）
  lastOrderedAt?: string; // ログイン中のユーザーが対象の商品を最後に注文した日時（orders テーブルの createdAt カラム）
};

export interface getProductSearchParams {
  filter: string;
  page: number;
  userId: number;
}

export interface getProductParams {
  productIds?: string;
  userId: number;
}

type OrderDetailWithOrder = Prisma.OrderDetailGetPayload<{
  include: {
    order: true;
  };
}>;

export const getProductSearch = async ({
  filter,
  page,
  userId,
}: getProductSearchParams) => {
  const prisma = databaseManager.getInstance();

  const limit = 10;
  const offset = (page - 1) * limit;

  const rawProducts = await prisma.product.findMany({
    where: {
      name: {
        contains: filter,
      },
    },
    include: {
      stock: true,
      orderDetails: userId
        ? {
            where: {
              order: {
                userId: userId,
              },
            },
            include: {
              order: true,
            },
            orderBy: {
              order: {
                createdAt: "desc",
              },
            },
            take: 1,
          }
        : false,
    },
    take: limit,
    skip: offset,
  });

  const hitCount = await prisma.product.count({
    where: {
      name: {
        contains: filter,
      },
    },
  });

  const products: ProductItem[] = rawProducts.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    imageName: item.imageName,
    stockId: item.stockId,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    quantity: item.stock?.quantity ?? 0,
    lastOrderedAt: (
      item.orderDetails as OrderDetailWithOrder[]
    )?.[0]?.order?.createdAt?.toISOString(),
  }));

  return {
    products,
    hitCount,
  };
};

export const getProduct = async ({productIds, userId}: getProductParams) => {
  const prisma = databaseManager.getInstance();
  // productIds文字列を分割して数値配列に変換（undefinedの場合は空配列）
  const productIdArray = productIds
    ? productIds.split(",").map(id => parseInt(id.trim(), 10))
    : [];
  // 無効なIDを除外
  const validProductIds = productIdArray.filter(id => !isNaN(id));
  if (validProductIds.length === 0) {
    return [];
  }

  const rawProducts = await prisma.product.findMany({
    where: {
      id: {
        in: validProductIds, // IDの配列で検索
      },
    },
    include: {
      stock: true,
      orderDetails: userId
        ? {
            where: {
              order: {
                userId: userId,
              },
            },
            include: {
              order: true,
            },
            orderBy: {
              order: {
                createdAt: "desc",
              },
            },
            take: 1,
          }
        : false,
    },
  });

  const products: ProductItem[] = rawProducts.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    imageName: item.imageName,
    stockId: item.stockId,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    quantity: item.stock?.quantity ?? 0,
    lastOrderedAt: (
      item.orderDetails as OrderDetailWithOrder[]
    )?.[0]?.order?.createdAt?.toISOString(),
  }));

  return {
    products,
  };
};
