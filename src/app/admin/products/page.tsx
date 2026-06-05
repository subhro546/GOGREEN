/* eslint-disable @next/next/no-img-element */
import { prisma } from "../../../lib/prisma";
import DeleteProductButton from "../../../../components/admin/DeleteProductButton";
import UpdateStockButton from "../../../../components/admin/UpdateStockButton";
import AddProductSection from "../../../../components/admin/AddProductSection";
import UpdateImageButton from "../../../../components/admin/UpdateImageButton";
import EditProductButton from "../../../../components/admin/EditProductButton";

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">Products</h1>
          <p className="text-text-dark/60 mt-1">Manage your plant catalog.</p>
        </div>
        <AddProductSection />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-hero/50 text-text-dark/60 text-sm">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium hidden sm:table-cell">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-dark/50">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const parsedImages = (() => {
                    try {
                      const parsed = JSON.parse(product.images);
                      return Array.isArray(parsed) ? parsed : [];
                    } catch {
                      return [];
                    }
                  })();
                  const imageUrl = parsedImages[0] || '';

                  return (
                    <tr key={product.id} className="hover:bg-brand-hero/50 transition-colors border-t border-brand/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-hero border border-brand/5 shrink-0 flex items-center justify-center">
                            {imageUrl ? (
                              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">🪴</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-text-dark">{product.name}</p>
                            <p className="text-xs text-text-dark/50 font-mono hidden sm:block">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-hero text-brand-secondary">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-brand-secondary">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <UpdateStockButton productId={product.id} currentStock={product.stock} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <EditProductButton product={product} />
                          <UpdateImageButton productId={product.id} currentImage={imageUrl} />
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
