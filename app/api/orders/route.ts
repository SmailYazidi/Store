import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

function generateOrderCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("store")

    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    const body = await request.json()

    // Get product details
    const product = await db.collection("products").findOne({ _id: new ObjectId(body.productId) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const orderCode = generateOrderCode()

    const order = {
      orderCode,
      customerName: body.name,
      customerPhone: body.phone,
      customerEmail: body.email,
      customerAddress: body.address,
      productId: body.productId,
      productName: body.productName,
      productPrice: product.price,
      productImage: product.mainImage,
      status: "processing",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(order)

    return NextResponse.json({
      message: "Order created successfully",
      orderId: result.insertedId,
      orderCode,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
