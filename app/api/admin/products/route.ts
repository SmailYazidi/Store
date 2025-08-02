import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [{ "name.ar": { $regex: search, $options: "i" } }, { "name.fr": { $regex: search, $options: "i" } }]
    }

    if (categoryId && categoryId !== "all") {
      query.categoryId = categoryId
    }

    const skip = (page - 1) * limit

    // Get products with category info
    const products = await db
      .collection("products")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray()

    const totalCount = await db.collection("products").countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "حدث خطأ في جلب المنتجات" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const productData = await request.json()

    // Validate required fields
    if (!productData.name?.ar || !productData.name?.fr || !productData.price || !productData.categoryId) {
      return NextResponse.json({ error: "البيانات المطلوبة ناقصة" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Convert categoryId to ObjectId
    productData.categoryId = new ObjectId(productData.categoryId)
    productData.createdAt = new Date()
    productData.updatedAt = new Date()

    const result = await db.collection("products").insertOne(productData)

    return NextResponse.json({
      success: true,
      message: "تم إضافة المنتج بنجاح",
      productId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "حدث خطأ في إضافة المنتج" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { productId, ...updateData } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Convert categoryId to ObjectId if provided
    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId)
    }

    updateData.updatedAt = new Date()

    const result = await db.collection("products").updateOne({ _id: new ObjectId(productId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "تم تحديث المنتج بنجاح" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "حدث خطأ في تحديث المنتج" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("id")

    if (!productId) {
      return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(productId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "حدث خطأ في حذف المنتج" }, { status: 500 })
  }
}
