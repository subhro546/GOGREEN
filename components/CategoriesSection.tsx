/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const CategoriesSection = () => {
  const categories = [
    { name: "Indoor Plants", dbName: "Indoor Plant", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80" },
    { name: "Air Purifying", dbName: "Air Purifying", image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80" },
    { name: "Low Maintenance", dbName: "Low Maintenance", image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=400&q=80" },
    { name: "All Plants", dbName: "", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif text-text-dark text-center mb-16 italic">
          Categories
        </h2>

        {/* Scrollable container for smaller screens, grid for larger */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 scrollbar-hide">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.dbName ? `/shop?category=${encodeURIComponent(category.dbName)}` : `/shop`}
              className="relative flex-none w-64 sm:w-auto h-80 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-medium translate-y-2 group-hover:translate-y-0 transition-transform">
                  {category.name}
                </h3>
                <div className="w-8 h-1 bg-brand-hero mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
