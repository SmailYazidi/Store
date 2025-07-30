import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db("store")

    const [products, totalCount] = await Promise.all([
      db
        .collection("products")
        .find({
          category: new ObjectId(params.id),
          isVisible: true,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),

      db.collection("products").countDocuments({
        category: new ObjectId(params.id),
        isVisible: true,
      }),
    ])

    const hasMore = skip + products.length < totalCount

    return NextResponse.json({
      products,
      hasMore,
      totalCount,
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching category products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
