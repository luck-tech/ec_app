import {databaseManager} from "@/db";
import {OrderDetailWithOrder} from "@/types/prisma-types";
import {
  ProductItem,
  ProductQueryParams,
  ProductSearchParams,
} from "@/types/product";

export const getProductSearch = async ({
  filter,
  page,
  userId,
}: ProductSearchParams) => {
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

export const getProduct = async ({productIds, userId}: ProductQueryParams) => {
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
