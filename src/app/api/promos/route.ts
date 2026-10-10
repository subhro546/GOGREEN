import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const DEFAULT_PROMOS = [
  {
    id: 1,
    title: 'A Living Gift - Upto 30% Off',
    subtitle: 'Express true emotions with a gift that grows forever.',
    image: 'https://images.unsplash.com/photo-1616844868137-7ee9659b9903?q=80&w=800&auto=format&fit=crop',
    link: '/shop',
    bgColor: 'bg-white/20',
    titleColor: 'text-[#8b2323]',
    colSpan: 'lg:col-span-2',
    height: 'h-[300px] md:h-[350px]',
  },
  {
    id: 2,
    title: 'Miniature Garden - Upto 30% Off',
    subtitle: 'Enjoy a living garden even in tiny spaces.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Indoor%20Plants',
    bgColor: 'bg-white/20',
    titleColor: 'text-[#1c5c2d]',
    colSpan: 'lg:col-span-1',
    height: 'h-[220px]',
  },
  {
    id: 3,
    title: 'Organic Seeds - 50% Off',
    subtitle: 'Best quality seeds for organic lovers. No chemical No preservatives.',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Seeds',
    bgColor: 'bg-white/20',
    titleColor: 'text-[#8b2323]',
    colSpan: 'lg:col-span-1',
    height: 'h-[220px]',
  },
  {
    id: 4,
    title: 'Microgreen Seeds - 50% Off',
    subtitle: 'Grow own food full of nutrients, flavour, and freshness.',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    link: '/shop?category=Seeds',
    bgColor: 'bg-white/20',
    titleColor: 'text-[#1c5c2d]',
    colSpan: 'lg:col-span-2',
    height: 'h-[300px] md:h-[350px]',
  },
  {
    id: 5,
    title: 'Event Gifts - Starting ₹119',
    subtitle: "Corporate, Marriages, Conferences, Parties? You're covered.",
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    link: '/shop',
    bgColor: 'bg-white/20',
    titleColor: 'text-[#4a4a4a]',
    colSpan: 'lg:col-span-1',
    height: 'h-[220px]',
  }
];

export async function GET() {
  try {
    const dbPromos = await prisma.promoBanner.findMany({
      orderBy: { id: "asc" },
    });

    if (dbPromos.length === 0) {
      // Seed dynamically
      for (const promo of DEFAULT_PROMOS) {
        await prisma.promoBanner.upsert({
          where: { id: promo.id },
          update: {},
          create: promo,
        });
      }
      return NextResponse.json(DEFAULT_PROMOS);
    }

    return NextResponse.json(dbPromos);
  } catch (error) {
    console.error("Get promos error:", error);
    return NextResponse.json({ message: "Failed to get promos" }, { status: 500 });
  }
}
