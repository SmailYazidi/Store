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

    const db = await connectDB()

    const categories = await db
      .collection("categories")
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "categoryId",
            as: "products",
          },
        },
        {
          $addFields: {
            productCount: { $size: "$products" },
          },
        },
        {
          $project: {
            products: 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "حدث خطأ في جلب التصنيفات" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || !name.ar || !name.fr) {
      return NextResponse.json({ error: "اسم التصنيف باللغتين مطلوب" }, { status: 400 })
    }

    const db = await connectDB()

    // Check for duplicate names
    const existingCategory = await db.collection("categories").findOne({
      $or: [{ "name.ar": name.ar }, { "name.fr": name.fr }],
    })

    if (existingCategory) {
      return NextResponse.json({ error: "اسم التصنيف موجود بالفعل" }, { status: 400 })
    }

    const category = {
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json({
      success: true,
      categoryId: result.insertedId,
    })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "حدث خطأ في إنشاء التصنيف" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { categoryId, name } = await request.json()

    if (!categoryId || !name) {
      return NextResponse.json({ error: "معرف التصنيف والاسم مطلوبان" }, { status: 400 })
    }

    const db = await connectDB()

    // Check for duplicate names (excluding current category)
    const existingCategory = await db.collection("categories").findOne({
      _id: { $ne: new ObjectId(categoryId) },
      $or: [{ "name.ar": name.ar }, { "name.fr": name.fr }],
    })

    if (existingCategory) {
      return NextResponse.json({ error: "اسم التصنيف موجود بالفعل" }, { status: 400 })
    }

    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(categoryId) },
      {
        $set: {
          name,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ error: "حدث خطأ في تحديث التصنيف" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("id")

    if (!categoryId) {
      return NextResponse.json({ error: "معرف التصنيف مطلوب" }, { status: 400 })
    }

    const db = await connectDB()

    // Check if category has products
    const productCount = await db.collection("products").countDocuments({
      categoryId: new ObjectId(categoryId),
    })

    if (productCount > 0) {
      return NextResponse.json({ error: "لا يمكن حذف التصنيف لأنه يحتوي على منتجات" }, { status: 400 })
    }

    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(categoryId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "حدث خطأ في حذف التصنيف" }, { status: 500 })
  }
}
