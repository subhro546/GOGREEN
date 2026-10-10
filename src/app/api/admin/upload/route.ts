import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Validate MIME type against approved raster types (explicitly reject SVG)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { message: "Only JPEG, PNG, and WebP images are allowed. Vector or executable formats are forbidden." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "File size must be under 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify binary magic numbers to ensure file content matches approved raster image headers
    const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer.length >= 8 &&
      buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
      buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
    const isWebp = buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { message: "Invalid image file content: Magic bytes do not match an authentic JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }

    // Check for malicious XML/SVG tags in file content
    const sampleText = buffer.subarray(0, Math.min(buffer.length, 1024)).toString("utf-8").toLowerCase();
    if (sampleText.includes("<svg") || sampleText.includes("<?xml") || sampleText.includes("<script") || sampleText.includes("<html")) {
      return NextResponse.json(
        { message: "Embedded script or XML content detected in upload payload" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "gogreen-nursery",
      transformation: [{ width: 800, height: 1000, crop: "limit", quality: "auto" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error instanceof Error ? error.message : "Upload error");
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
