/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { prisma } from '../src/lib/prisma';

const CategoriesSection = async () => {
  const dbCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const categories = [
    ...dbCategories.map((cat) => ({
      name: cat.name,
      dbName: cat.name,
      image: cat.image,
    })),
    {
      name: "All Plants",
      dbName: "",
      image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section id="categories" className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto items-start gap-4 sm:gap-8 pb-4 scrollbar-thin scrollbar-thumb-brand-secondary/20 scrollbar-track-transparent snap-x snap-mandatory">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.dbName ? `/shop?category=${encodeURIComponent(category.dbName)}` : `/shop`}
              className="flex flex-col items-center gap-2 group shrink-0 snap-start"
            >
              {/* Category shape */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-brand/5 group-hover:border-brand-secondary transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 bg-brand-hero shrink-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Label */}
              <span className="text-[10px] sm:text-xs font-semibold text-text-dark/70 group-hover:text-brand-secondary transition-colors text-center leading-tight max-w-[70px] sm:max-w-[80px] uppercase tracking-wide">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
