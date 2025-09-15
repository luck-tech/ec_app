import {Order} from "@prisma/client";

const now = new Date();

export const orders: Order[] = [
  {
    id: 1,
    userId: 1,
    createdAt: new Date(now.getFullYear() - 1, 0, 1),
    updatedAt: new Date(now.getFullYear() - 1, 0, 1),
  },
  {
    id: 2,
    userId: 1,
    createdAt: new Date(now.getFullYear(), 0, 1),
    updatedAt: new Date(now.getFullYear(), 0, 1),
  },
  {
    id: 3,
    userId: 2,
    createdAt: new Date(now.getFullYear() - 1, 0, 1),
    updatedAt: new Date(now.getFullYear() - 1, 0, 1),
  },
  {
    id: 4,
    userId: 2,
    createdAt: new Date(now.getFullYear(), 0, 1),
    updatedAt: new Date(now.getFullYear(), 0, 1),
  },
];
