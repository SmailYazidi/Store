import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import { OrderStatus } from "@/lib/models"

interface CreateOrderRequestBody {
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  productId: string
}

export async function POST(req: Request) {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      productId,
    }: CreateOrderRequestBody = await req.json()

    if (!customerName || !customerPhone || !customerEmail || !customerAddress || !productId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const product = await db.collection("products").findOne({ _id: productId })

    if (!product || !product.isVisible || product.quantity < 1) {
      return NextResponse.json({ message: "Product not available" }, { status: 400 })
    }

    const orderCode = uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase()

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

    await db.collection("orders").insertOne(order)

    await db.collection("products").updateOne(
      { _id: productId, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } }
    )

    // TODO: إرسال بريد تحقق مع orderCode إذا لزم الأمر

    return NextResponse.json({ orderCode }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Create order error:", error.message)
    } else {
      console.error("Create order error:", error)
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
