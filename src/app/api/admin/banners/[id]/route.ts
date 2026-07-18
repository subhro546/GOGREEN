import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    
    // If it is a default placeholder id, we don't delete from db (since it is just mock data),
    // but wait, we can just return success or prevent deleting default banners.
    if (id.startsWith("default_")) {
      return NextResponse.json({ message: "Default banner cannot be deleted" }, { status: 400 });
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });
    }

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json({ message: "Failed to delete banner" }, { status: 500 });
  }
}
