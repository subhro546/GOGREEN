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
    <section id="categories" className="w-full py-3 sm:py-4 bg-white dark:bg-[#0b130e] border-b border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div 
          className="w-full flex items-start justify-start sm:justify-evenly gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide pt-3.5 sm:pt-4 pb-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.dbName ? `/shop?category=${encodeURIComponent(category.dbName)}` : `/shop`}
              className="w-[78px] sm:w-[92px] md:w-[104px] flex flex-col items-center gap-1.5 sm:gap-2 group transition-transform duration-200 hover:-translate-y-1 text-center shrink-0"
            >
              {/* Category shape - strictly uniform square */}
              <div className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] md:w-24 md:h-24 aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-brand/10 dark:border-white/10 group-hover:border-brand-secondary dark:group-hover:border-emerald-400 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 bg-brand-hero/40 dark:bg-emerald-950/20 flex items-center justify-center shrink-0 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover select-none"
                  loading="eager"
                />
              </div>
              {/* Label - uniform 2-row height container */}
              <span className="text-[10px] sm:text-xs font-semibold text-text-dark/75 dark:text-gray-200 group-hover:text-brand-secondary dark:group-hover:text-emerald-400 transition-colors text-center leading-tight uppercase tracking-wide px-0.5 line-clamp-2 select-none h-7 sm:h-8 flex items-center justify-center">
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
