/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { prisma } from '../src/lib/prisma';

const CategoriesSection = async () => {
  const dbCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const categories = [
    ...dbCategories.map((cat) => ({
      name: cat.name + (cat.name.toLowerCase().endsWith('plant') || cat.name.toLowerCase().endsWith('plants') ? '' : ' Plants'),
      dbName: cat.name,
      image: cat.image,
      tag: cat.tag,
    })),
    {
      name: "All Plants",
      dbName: "",
      image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80",
      tag: "Browse All",
    },
  ];


  return (
    <section id="categories" className="py-20 bg-[#0f1f13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-green-900/60 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-700/50">
            Shop by Category
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white italic">
            Find Your Perfect Plant
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Whether you want fresh air, low-effort greens, or a statement piece — we&apos;ve got it all.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.dbName ? `/shop?category=${encodeURIComponent(category.dbName)}` : `/shop`}
              className="relative h-36 sm:h-64 lg:h-80 rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Uniform dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 transition-opacity duration-300 group-hover:from-black/85" />

              {/* Tag */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/30">
                  {category.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-5">
                <h3 className="text-white text-sm sm:text-xl font-bold drop-shadow-md">
                  {category.name}
                </h3>
                <div className="hidden sm:flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <span className="text-green-300 text-sm font-semibold">Shop Now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
