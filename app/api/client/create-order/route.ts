import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { ObjectId } from "mongodb"
import { connectDB } from "@/lib/mongodb"
import { OrderStatus } from "@/lib/models"
import { sendVerificationEmail } from "@/lib/email" // Assume you have an email service

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

    // Validate required fields
    const missingFields = []
    if (!customerName) missingFields.push("customerName")
    if (!customerPhone) missingFields.push("customerPhone")
    if (!customerEmail) missingFields.push("customerEmail")
    if (!customerAddress) missingFields.push("customerAddress")
    if (!productId) missingFields.push("productId")

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: "Missing required fields",
          missingFields 
        },
        { status: 400 }
      )
    }

    // Validate productId format
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID format" },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const session = await db.startSession() // Start transaction session

    try {
      let orderCode: string
      let orderId: ObjectId

      await session.withTransaction(async () => {
        // Check product availability
        const product = await db.collection("products").findOne(
          { 
            _id: new ObjectId(productId),
            isVisible: true,
            quantity: { $gt: 0 }
          },
          { session }
        )

        if (!product) {
          throw new Error("Product not available")
        }

        // Generate unique order code
        orderCode = uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase()

        // Create order
        const order = {
          orderCode,
          customerName,
          customerPhone,
          customerEmail,
          customerAddress,
          productId: new ObjectId(productId),
          productName: product.name.ar,
          productPrice: product.price,
          productCurrency: product.currency || "USD",
          productImage: product.mainImage,
          quantity: 1,
          status: OrderStatus.PaymentPending,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await db.collection("orders").insertOne(order, { session })
        orderId = result.insertedId

        // Update product quantity
        const updateResult = await db.collection("products").updateOne(
          { 
            _id: new ObjectId(productId),
            quantity: { $gt: 0 }
          },
          { $inc: { quantity: -1 } },
          { session }
        )

        if (updateResult.modifiedCount !== 1) {
          throw new Error("Failed to update product quantity")
        }
      })

      // Send verification email outside transaction
      await sendVerificationEmail({
        email: customerEmail,
        orderCode,
        customerName
      })

      return NextResponse.json(
        { 
          success: true,
          orderId: orderId.toString(),
          orderCode
        },
        { status: 201 }
      )

    } finally {
      await session.endSession()
    }

  } catch (error: unknown) {
    console.error("Order creation failed:", error)

    const errorMessage = error instanceof Error 
      ? error.message 
      : "Order creation failed"

    return NextResponse.json(
      { 
        success: false,
        message: errorMessage,
        code: "ORDER_CREATION_ERROR"
      },
      { status: 500 }
    )
  }
}