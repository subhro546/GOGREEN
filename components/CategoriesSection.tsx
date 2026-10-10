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
    <section id="categories" className="w-full py-5 sm:py-7 bg-white border-b border-gray-100 overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div 
          className="w-full flex items-start justify-between sm:justify-evenly gap-2 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.dbName ? `/shop?category=${encodeURIComponent(category.dbName)}` : `/shop`}
              className="flex-1 min-w-[76px] sm:min-w-[90px] md:min-w-[100px] flex flex-col items-center gap-2 group transition-transform duration-200 hover:-translate-y-1 text-center shrink-0 sm:shrink"
            >
              {/* Category shape */}
              <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-brand/5 group-hover:border-brand-secondary transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 bg-brand-hero flex items-center justify-center shrink-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover select-none"
                  loading="eager"
                />
              </div>
              {/* Label */}
              <span className="text-[10px] sm:text-xs font-semibold text-text-dark/70 group-hover:text-brand-secondary transition-colors text-center leading-tight uppercase tracking-wide px-1 line-clamp-2 select-none">
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
