import {databaseManager} from "@/db";
import {User} from "@prisma/client";

export type UserWithoutPassword = Omit<User, "password">;

export const selectUserColumnsWithoutPassword = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export const getUser = async (userId: number) => {
  const prisma = databaseManager.getInstance();
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      ...selectUserColumnsWithoutPassword,
    },
  });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const prisma = databaseManager.getInstance();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      ...selectUserColumnsWithoutPassword,
    },
  });
  return user;
};

export const getUserByEmailWithPassword = async (email: string) => {
  const prisma = databaseManager.getInstance();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};
