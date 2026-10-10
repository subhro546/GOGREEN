import { prisma } from '../src/lib/prisma';
import FeaturedProductsSlider from './FeaturedProductsSlider';

const FeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    take: 12,
    orderBy: { createdAt: 'desc' },
  });

  return <FeaturedProductsSlider products={products} />;
};

export default FeaturedProducts;
