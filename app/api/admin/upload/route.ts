import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  try {
    const blob = await put(filename, req.body!, {
      access: "public",
    });

    const cleanFilename = blob.pathname.split("/").pop(); // get "1234567890-img.jpg"

    return NextResponse.json({ filename: cleanFilename });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Optional: explicitly reject unsupported methods
export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
