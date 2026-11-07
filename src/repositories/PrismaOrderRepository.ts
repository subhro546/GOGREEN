/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../lib/prisma";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { Order } from "@prisma/client";

export async function generateNextOrderId(
  db: { order: { findMany: typeof prisma.order.findMany } } = prisma
): Promise<string> {
  const existingOrders = await db.order.findMany({
    select: { id: true },
  });

  let maxNum = 0;
  for (const o of existingOrders) {
    const match = /^GGN(\d+)$/i.exec(o.id);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = Math.max(maxNum + 1, existingOrders.length + 1);
  return `GGN${String(nextNum).padStart(3, "0")}`;
}

export class PrismaOrderRepository implements IOrderRepository {
  async create(data: any): Promise<Order> {
    const id = data.id || (await generateNextOrderId(prisma));
    return prisma.order.create({
      data: {
        ...data,
        id,
      },
    });
  }

  async update(id: string, data: any): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
    });
  }
}
