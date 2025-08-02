import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectDB() // This already includes the "store" database

    const products = await db.collection("products")
      .find({ isVisible: true })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB() // This already includes the "store" database

    const body = await request.json()
    const product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(product)

    return NextResponse.json({
      message: "Product created successfully",
      productId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" }, 
      { status: 500 }
    )
  }
}