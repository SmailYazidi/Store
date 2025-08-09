import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (!query.trim()) {
    return NextResponse.json([])
  }

  try {
    const db = await connectDB()
    const products = await db
      .collection("products")
      .find({
        $or: [
          { "name.fr": { $regex: query, $options: "i" } },
          { "name.en": { $regex: query, $options: "i" } },
        ],
      })
      .limit(20)
      .toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

