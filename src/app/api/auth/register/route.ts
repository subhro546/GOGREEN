import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, address } = await req.json();

    if (!name || !email || !password || !address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string") {
      return NextResponse.json(
        { message: "Invalid input types" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { message: "Password exceeds maximum permitted length" },
        { status: 400 }
      );
    }

    const cleanName = name.trim().slice(0, 100);

    let cleanAddress = "";
    if (typeof address === "string") {
      cleanAddress = address.trim().slice(0, 500);
    } else if (address && typeof address === "object") {
      const recipient = (address.recipientName || address.fullName || address.name || cleanName).trim();
      const phoneStr = (address.phone || "").trim().replace(/\s+/g, "").replace(/^\+91/, "").replace(/^0/, "");
      const line1 = (address.line1 || address.street || "").trim();
      const line2 = (address.line2 || "").trim();
      const city = (address.city || "").trim();
      const state = (address.state || "").trim();
      const pincode = (address.pincode || address.zip || "").trim();

      cleanAddress = [
        recipient,
        phoneStr ? `Ph: ${phoneStr}` : "",
        line1,
        line2,
        `${city}${state ? ", " + state : ""}${pincode ? " - " + pincode : ""}`,
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 500);
    }

    if (!cleanAddress) {
      return NextResponse.json(
        { message: "A valid shipping address is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with explicit USER role only
    await prisma.user.create({
      data: {
        name: cleanName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "USER", // STRICTLY USER ROLE FOR ALL PUBLIC REGISTRATIONS
        addresses: {
          create: {
            address: cleanAddress,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error instanceof Error ? error.message : "Internal error");
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
