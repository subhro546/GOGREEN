import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const promoId = parseInt(id);

    if (isNaN(promoId) || promoId < 1 || promoId > 5) {
      return NextResponse.json({ message: "Invalid promo banner ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, subtitle, image, link, bgColor, titleColor } = body;

    const updateData: Record<string, string> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (link !== undefined) updateData.link = link.trim();
    if (bgColor !== undefined) updateData.bgColor = bgColor.trim();
    if (titleColor !== undefined) updateData.titleColor = titleColor.trim();

    const updatedPromo = await prisma.promoBanner.update({
      where: { id: promoId },
      data: updateData,
    });

    return NextResponse.json(updatedPromo);
  } catch (error) {
    console.error("Update promo error:", error);
    return NextResponse.json({ message: "Failed to update promo banner" }, { status: 500 });
  }
}
