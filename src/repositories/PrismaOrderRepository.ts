import { prisma } from "../lib/prisma";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { Order } from "@prisma/client";

export class PrismaOrderRepository implements IOrderRepository {
  async create(data: any): Promise<Order> {
    return prisma.order.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
    });
  }
}
