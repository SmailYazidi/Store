import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    // Validate order code
    if (!code || typeof code !== "string" || code.length !== 12) {
      return NextResponse.json(
        { error: "Valid 12-character order code is required" },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const order = await db.collection("orders").findOne({ 
      orderCode: code.toUpperCase() // Ensure case insensitivity
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order code." },
        { status: 404 }
      )
    }

    // Format response data
    const trackingInfo = {
      orderId: order._id,
      orderCode: order.orderCode,
      customerName: order.customerName.split(" ")[0], // First name only
      productName: order.productName,
      productImage: order.productImage,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery, // Added if available
      createdAt: order.createdAt,
      lastUpdated: order.updatedAt || order.createdAt,
      // Consider adding status history if available
    }

    return NextResponse.json(trackingInfo, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    console.error("Order tracking error:", error)
    return NextResponse.json(
      { 
        error: "We're having trouble retrieving your order. Please try again later.",
        code: "TRACKING_SERVICE_ERROR"
      },
      { status: 500 }
    )
  }
}