import {Prisma} from "@prisma/client";

// ネストが深すぎて型定義ができないため型アサーションで使用
export type OrderDetailWithOrder = Prisma.OrderDetailGetPayload<{
  include: {order: true};
}>;
