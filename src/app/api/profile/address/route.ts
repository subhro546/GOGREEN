import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json({ message: "Failed to get addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address } = await req.json();
    if (!address || !address.trim()) {
      return NextResponse.json({ message: "Address is required" }, { status: 400 });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        address: address.trim(),
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json({ message: "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Address ID is required" }, { status: 400 });
    }

    // Ensure user owns this address before deleting
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ message: "Failed to delete address" }, { status: 500 });
  }
}
