import { prisma } from "../../../lib/prisma";
import OrdersTable from "../../../../components/admin/OrdersTable";

export const dynamic = 'force-dynamic';

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true } } }
      }
    }
  });

  // Serialize Date objects to strings to pass them safely from Server to Client component
  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-secondary">Orders</h1>
        <p className="text-text-dark/60 mt-1">Manage customer orders and shipments.</p>
      </div>

      <OrdersTable initialOrders={serializedOrders} />
    </div>
  );
}

