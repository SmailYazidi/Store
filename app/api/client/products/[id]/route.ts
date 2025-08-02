import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB() // This already includes the "store" database

    // Validate the ID format before creating ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      )
    }

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(params.id) })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}