import Link from 'next/link';
import Image from 'next/image';

const promos = [
  {
    id: 1,
    title: 'A Living Gift - Upto 30% Off',
    subtitle: 'Express true emotions with a gift that grows forever.',
    image: 'https://images.unsplash.com/photo-1616844868137-7ee9659b9903?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Gifts',
    bgColor: 'bg-[#f4f7e6]',
    titleColor: 'text-[#8b2323]',
    colSpan: 'lg:col-span-2',
    height: 'h-[300px] md:h-[350px]',
  },
  {
    id: 2,
    title: 'Miniature Garden - Upto 30% Off',
    subtitle: 'Enjoy a living garden even in tiny spaces.',
    image: 'https://images.unsplash.com/photo-1416879594411-96f7c8fbd245?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Miniature%20Gardens',
    bgColor: 'bg-[#e9f2d1]',
    titleColor: 'text-[#1c5c2d]',
    colSpan: 'lg:col-span-1',
    height: 'h-[220px]',
  },
  {
    id: 3,
    title: 'Organic Seeds - 50% Off',
    subtitle: 'Best quality seeds for organic lovers. No chemical No preservatives.',
    image: 'https://images.unsplash.com/photo-1592194996534-4b0091b65b12?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Seeds',
    bgColor: 'bg-[#f3ead1]',
    titleColor: 'text-[#8b2323]',
    colSpan: 'lg:col-span-1',
    height: 'h-[220px]',
  },
  {
    id: 4,
    title: 'Microgreen Seeds - 50% Off',
    subtitle: 'Grow own food full of nutrients, flavour, and freshness.',
    image: 'https://images.unsplash.com/photo-1595858801931-e8d975a6c0c2?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Seeds&subcategory=Microgreens',
    bgColor: 'bg-[#f5f8f0]',
    titleColor: 'text-[#1c5c2d]',
    colSpan: 'lg:col-span-2',
    height: 'h-[300px] md:h-[350px]',
  },
  {
    id: 5,
    title: 'Event Gifts - Starting ₹119',
    subtitle: "Corporate, Marriages, Conferences, Parties? You're covered.",
    image: 'https://images.unsplash.com/photo-1599598425947-33001c3e6eb8?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Event%20Gifts',
    bgColor: 'bg-[#fdf4e7]',
    titleColor: 'text-[#4a4a4a]',
    colSpan: 'lg:col-span-1',
    height: 'h-[220px]',
  }
];

export default function PromoGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column (Wide Promos) */}
          <div className="flex flex-col gap-6 lg:w-[60%]">
            {[promos[0], promos[3]].map((promo) => (
              <div 
                key={promo.id} 
                className={`${promo.bgColor} ${promo.height} rounded-md relative overflow-hidden flex items-center transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
              >
                {/* Background Image placed on the right */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-3/5">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover object-left mask-image-gradient-left"
                    style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)' }}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-2/3 md:w-1/2 p-6 md:p-10 flex flex-col justify-center h-full">
                  <h3 className={`text-2xl md:text-3xl font-bold ${promo.titleColor} mb-3 leading-tight`}>
                    {promo.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base mb-6 max-w-[280px]">
                    {promo.subtitle}
                  </p>
                  <div>
                    <Link 
                      href={promo.link}
                      className="inline-block bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold py-2 px-6 rounded transition-colors text-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (Square/Tall Promos) */}
          <div className="flex flex-col gap-6 lg:w-[40%]">
            {[promos[1], promos[2], promos[4]].map((promo) => (
              <div 
                key={promo.id} 
                className={`${promo.bgColor} ${promo.height} rounded-md relative overflow-hidden flex items-center transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
              >
                {/* Background Image */}
                <div className="absolute right-0 top-0 bottom-0 w-3/5">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover object-left"
                    style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)' }}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-2/3 p-6 flex flex-col justify-center h-full">
                  <h3 className={`text-xl font-bold ${promo.titleColor} mb-2 leading-tight`}>
                    {promo.title}
                  </h3>
                  <p className="text-gray-700 text-xs md:text-sm mb-4 max-w-[200px]">
                    {promo.subtitle}
                  </p>
                  <div>
                    <Link 
                      href={promo.link}
                      className="inline-block bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold py-1.5 px-4 rounded transition-colors text-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
