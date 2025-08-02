import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // Validate the order ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const order = await db.collection("orders").findOne({ 
      _id: new ObjectId(params.id) 
    })

    if (!order) {
      return NextResponse.json(
        { 
          error: "Order not found",
          suggestion: "Please check your order ID and try again"
        },
        { status: 404 }
      )
    }

    // Secure the response by removing sensitive fields
    const { customerEmail, customerPhone, customerAddress, ...safeOrder } = order

    return NextResponse.json({
      ...safeOrder,
      _id: safeOrder._id.toString(), // Convert ObjectId to string
      // Add formatted dates if needed
      createdAt: safeOrder.createdAt.toISOString(),
      updatedAt: safeOrder.updatedAt?.toISOString() || null
    }, {
      headers: {
        'Cache-Control': 'no-store' // Sensitive data shouldn't be cached
      }
    })

  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json(
      { 
        error: "Failed to retrieve order details",
        code: "ORDER_FETCH_ERROR"
      },
      { status: 500 }
    )
  }
}