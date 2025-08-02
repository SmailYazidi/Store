import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getAdminFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const db = await connectDB()

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

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      db.collection("orders").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("orders").countDocuments(filter),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "حدث خطأ في جلب الطلبات" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "معرف الطلب والحالة مطلوبان" }, { status: 400 })
    }

    const db = await connectDB()
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
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "حدث خطأ في تحديث الطلب" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")

    if (!orderId) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 })
    }

    const db = await connectDB()
    const result = await db.collection("orders").deleteOne({
      _id: new ObjectId(orderId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete order error:", error)
    return NextResponse.json({ error: "حدث خطأ في حذف الطلب" }, { status: 500 })
  }
}
