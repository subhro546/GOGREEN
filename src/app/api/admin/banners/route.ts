import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { src, alt } = body;

    if (!src || !src.trim()) {
      return NextResponse.json({ message: "Banner image URL is required" }, { status: 400 });
    }

    const newBanner = await prisma.banner.create({
      data: {
        src: src.trim(),
        alt: (alt || "Banner").trim(),
      },
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json({ message: "Failed to create banner" }, { status: 500 });
  }
}
