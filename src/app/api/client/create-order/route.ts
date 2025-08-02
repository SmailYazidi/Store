import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import { OrderStatus } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      productId
    } = await req.json()

    if (!customerName || !customerPhone || !customerEmail || !customerAddress || !productId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db() // Use default DB from MONGODB_URI or specify your DB name here

    const product = await db.collection("products").findOne({ _id: productId })

    if (!product || !product.isVisible || product.quantity < 1) {
      return NextResponse.json({ message: "Product not available" }, { status: 400 })
    }

    // Generate unique order code
    const orderCode = uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase()

    // Create order with status payment_pending
    const order = {
      orderCode,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      productId,
      productName: product.name.ar,
      productPrice: product.price,
      productCurrency: product.currency || "usd",
      productImage: product.mainImage,
      quantity: 1,
      status: OrderStatus.PaymentPending,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert the order
    await db.collection("orders").insertOne(order)

    // Decrement product quantity atomically
    await db.collection("products").updateOne(
      { _id: productId, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } }
    )

    // TODO: send verification email with orderCode here if needed

    return NextResponse.json({ orderCode }, { status: 201 })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
