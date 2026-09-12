import { prisma } from "../lib/prisma";
import { IProductRepository } from "../interfaces/IProductRepository";
import { Product } from "@prisma/client";

export class PrismaProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }
}
