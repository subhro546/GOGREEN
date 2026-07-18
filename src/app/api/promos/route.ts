import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const DEFAULT_PROMOS = [
  {
    id: 1,
    title: 'A Living Gift - Upto 30% Off',
    subtitle: 'Express true emotions with a gift that grows forever.',
    image: 'https://images.unsplash.com/photo-1616844868137-7ee9659b9903?q=80&w=800&auto=format&fit=crop',
    link: '/shop',
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
    link: '/shop?category=Indoor%20Plants',
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
    link: '/shop?category=Seeds',
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
    link: '/shop',
    bgColor: 'bg-[#fdf4e7]',
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
