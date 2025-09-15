import {PrismaClient} from "@prisma/client";
import {users} from "./seed/users";
import {stocks} from "./seed/stocks";
import {products} from "./seed/products";
import {orders} from "./seed/order";
import {orderDetails} from "./seed/order_details";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
  await prisma.stock.createMany({
    data: stocks,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
  await prisma.order.createMany({
    data: orders,
    skipDuplicates: true,
  });
  await prisma.orderDetail.createMany({
    data: orderDetails,
    skipDuplicates: true,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
