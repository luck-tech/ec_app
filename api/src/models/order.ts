import {databaseManager} from "@/db";
import {InsufficientStockError, OrderQueryParams} from "@/types/order";

export const postOrder = async (params: OrderQueryParams[], userId: number) => {
  const prisma = databaseManager.getInstance();

  return await prisma.$transaction(async tx => {
    const errors: string[] = [];

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
