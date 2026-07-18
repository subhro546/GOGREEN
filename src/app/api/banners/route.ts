import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const DEFAULT_BANNERS = [
  {
    id: "default_1",
    src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80",
    alt: "Beautiful indoor plants collection",
  },
  {
    id: "default_2",
    src: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1400&q=80",
    alt: "Fresh green plants for your home",
  },
  {
    id: "default_3",
    src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=80",
    alt: "Premium plant nursery",
  },
];

export async function GET() {
  try {
    const dbBanners = await prisma.banner.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (dbBanners.length === 0) {
      return NextResponse.json(DEFAULT_BANNERS);
    }

    return NextResponse.json(dbBanners);
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json({ message: "Failed to get banners" }, { status: 500 });
  }
}
