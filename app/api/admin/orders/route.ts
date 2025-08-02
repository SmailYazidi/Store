import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyAdminToken } from "@/lib/auth"
import { OrderStatus } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()

    // Build filter
    const filter: any = {}
    if (status && status !== "all") {
      filter.status = status
    }
    if (search) {
      filter.$or = [
        { orderCode: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ]
    }

    // Get orders with pagination
    const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Get total count
    const totalCount = await db.collection("orders").countDocuments(filter)

    // Get status counts for dashboard
    const statusCounts = await db
      .collection("orders")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
      statusCounts,
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
    }

    // Validate status
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("orders").deleteOne({
      _id: new ObjectId(orderId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order deleted successfully" })
  } catch (error) {
    console.error("Delete order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
