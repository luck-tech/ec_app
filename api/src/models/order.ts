import {databaseManager} from "@/db";

export type orderQueryParams = {
  productId: number;
  quantity: number;
};

export class InsufficientStockError extends Error {
  constructor(public errors: string[]) {
    super("Insufficient stock");
    this.name = "InsufficientStockError";
  }
}

export const postOrder = async (params: orderQueryParams[], userId: number) => {
  const prisma = databaseManager.getInstance();

  return await prisma.$transaction(async tx => {
    const errors: string[] = [];

    // バリデーション
    if (!Array.isArray(params)) {
      errors.push("body must be an array");
    } else if (params.length === 0) {
      errors.push("body must have at least one item");
    } else {
      // 各パラメータの基本バリデーション
      for (const param of params) {
        if (!param.productId) {
          errors.push("productId is required");
          break;
        }
        if (isNaN(param.productId)) {
          errors.push("productId must be a number");
          break;
        }
        if (param.quantity === undefined || param.quantity === null) {
          errors.push("quantity is required");
          break;
        }
        if (isNaN(param.quantity)) {
          errors.push("quantity must be a number");
          break;
        }
        if (param.quantity < 1) {
          errors.push("quantity must be greater than 1");
          break;
        }
      }
    }

    if (errors.length > 0) {
      throw new InsufficientStockError(errors);
    }

    // 商品情報と在庫情報を取得
    const productIds = params.map(p => p.productId);
    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        stock: true,
      },
    });

    // 商品存在チェック
    if (products.length !== params.length) {
      errors.push("specified product does not exist");
    }

    // 在庫チェック
    for (const param of params) {
      const product = products.find(p => p.id === param.productId);
      if (product && product.stock && product.stock.quantity < param.quantity) {
        errors.push(`${product.name} is out of stock`);
      }
    }

    if (errors.length > 0) {
      throw new InsufficientStockError(errors);
    }

    // 注文レコードを作成
    const order = await tx.order.create({
      data: {
        userId,
      },
    });

    // 注文詳細レコードを作成し、在庫を減算
    for (const param of params) {
      const product = products.find(p => p.id === param.productId)!;

      // 注文詳細を作成
      await tx.orderDetail.create({
        data: {
          orderId: order.id,
          productId: param.productId,
          price: product.price,
          quantity: param.quantity,
        },
      });

      // 在庫を減算
      await tx.stock.update({
        where: {
          id: product.stockId,
        },
        data: {
          quantity: {
            decrement: param.quantity,
          },
        },
      });
    }

    return {orderId: order.id};
  });
};

export const getOrderById = async (orderId: number, userId: number) => {
  const prisma = databaseManager.getInstance();

  const rawProducts = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!rawProducts) {
    return null;
  }

  return {
    id: orderId,
    userId: userId,
    createdAt: rawProducts.createdAt,
    updatedAt: rawProducts.updatedAt,
    orderDetails: rawProducts.orderDetails.map(od => ({
      id: od.id,
      orderId: od.orderId,
      productId: od.productId,
      price: od.price,
      quantity: od.quantity,
      createdAt: od.createdAt,
      updatedAt: od.updatedAt,
      product: {
        id: od.product.id,
        name: od.product.name,
        price: od.product.price,
        imageName: od.product.imageName,
        stockId: od.product.stockId,
        createdAt: od.product.createdAt,
        updatedAt: od.product.updatedAt,
      },
    })),
  };
};

export const getOrders = async (userId: number) => {
  const prisma = databaseManager.getInstance();

  // 配列
  const rawProducts = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!rawProducts) {
    return null;
  }

  const orders = rawProducts.map(order => ({
    id: order.id,
    userId: order.userId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderDetails: order.orderDetails.map(od => ({
      id: od.id,
      productId: od.productId,
      orderId: od.orderId,
      price: od.price,
      quantity: od.quantity,
      createdAt: od.createdAt,
      updatedAt: od.updatedAt,
      product: {
        id: od.product.id,
        name: od.product.name,
        price: od.product.price,
        imageName: od.product.imageName,
        stockId: od.product.stockId,
        createdAt: od.product.createdAt,
        updatedAt: od.product.updatedAt,
      },
    })),
  }));

  return orders;
};
