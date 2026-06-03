import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, revenueRaw] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } }
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } }
  });

  const totalRevenue = revenueRaw._sum.totalAmount || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-secondary">Dashboard</h1>
        <p className="text-text-dark/60 mt-1">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/5">
          <p className="text-sm font-medium text-text-dark/60 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-brand-secondary">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/5">
          <p className="text-sm font-medium text-text-dark/60 mb-1">Orders</p>
          <p className="text-3xl font-bold text-brand-secondary">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/5">
          <p className="text-sm font-medium text-text-dark/60 mb-1">Products</p>
          <p className="text-3xl font-bold text-brand-secondary">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/5">
          <p className="text-sm font-medium text-text-dark/60 mb-1">Users</p>
          <p className="text-3xl font-bold text-brand-secondary">{totalUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand/5 overflow-hidden">
        <div className="p-6 border-b border-brand/5">
          <h2 className="text-xl font-bold text-brand-secondary">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-hero/50 text-text-dark/60 text-sm">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium hidden sm:table-cell">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-dark/50">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-hero/50 transition-colors border-t border-brand/5">
                    <td className="p-4 font-mono text-sm">{order.id.slice(-8).toUpperCase()}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.user.name || "Guest"}</p>
                      <p className="text-xs text-text-dark/50">{order.user.email}</p>
                    </td>
                    <td className="p-4 text-sm hidden sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === 'DELIVERED' ? 'bg-brand-secondary text-white' : 
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
