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
    const search = searchParams.get("search")
    const categoryId = searchParams.get("categoryId")

    const db = await connectDB()

    // Build filter
    const filter: any = {}
    if (search) {
      filter.$or = [{ "name.ar": { $regex: search, $options: "i" } }, { "name.fr": { $regex: search, $options: "i" } }]
    }
    if (categoryId && categoryId !== "all") {
      filter.categoryId = categoryId
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      db
        .collection("products")
        .aggregate([
          { $match: filter },
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
        .toArray(),
      db.collection("products").countDocuments(filter),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
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

    const requiredFields = ["name", "price", "categoryId"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `الحقل ${field} مطلوب` }, { status: 400 })
      }
    }

    const db = await connectDB()

    // Verify category exists
    const category = await db.collection("categories").findOne({
      _id: new ObjectId(productData.categoryId),
    })

    if (!category) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 400 })
    }

    const product = {
      ...productData,
      categoryId: new ObjectId(productData.categoryId),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(product)

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
    })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "حدث خطأ في إنشاء المنتج" }, { status: 500 })
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

    const db = await connectDB()

    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId)
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update product error:", error)
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

    const db = await connectDB()
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(productId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "حدث خطأ في حذف المنتج" }, { status: 500 })
  }
}
