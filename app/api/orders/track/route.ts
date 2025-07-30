import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Order code is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("store")

    const order = await db.collection("orders").findOne({ orderCode: code })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Return only necessary information for tracking
    const trackingInfo = {
      _id: order._id,
      orderCode: order.orderCode,
      customerName: order.customerName.split(" ")[0], // Only first name
      productName: order.productName,
      productImage: order.productImage,
      status: order.status,
      createdAt: order.createdAt,
    }

    return NextResponse.json(trackingInfo)
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 })
  }
}
