/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@prisma/client";

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  create(data: any): Promise<Product>;
}
