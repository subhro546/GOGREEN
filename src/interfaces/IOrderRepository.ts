import { Order } from "@prisma/client";

export interface IOrderRepository {
  create(data: any): Promise<Order>;
  update(id: string, data: any): Promise<Order>;
}
