import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // If Cloudinary is configured, upload to Cloudinary directly
    if (cloudName && uploadPreset) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadData = new FormData();
      uploadData.append("file", base64);
      uploadData.append("upload_preset", uploadPreset);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (cloudinaryRes.ok) {
        const json = await cloudinaryRes.json();
        return NextResponse.json({ url: json.secure_url });
      }
    }

    // Fallback: Convert to data URI for simple demo/local hosting
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url: dataUri });
  } catch (e) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
