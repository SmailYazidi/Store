import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  const blob = await put(filename, req.body!, {
    access: "public",
  });

  const cleanFilename = blob.pathname.split("/").pop(); // get "1234567890-img.jpg"

  return NextResponse.json({ filename: cleanFilename });
}
