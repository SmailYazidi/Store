import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getAdminFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get categories with product count
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
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "حدث خطأ في جلب التصنيفات" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const categoryData = await request.json()

    // Validate required fields
    if (!categoryData.name?.ar || !categoryData.name?.fr) {
      return NextResponse.json({ error: "اسم التصنيف باللغتين مطلوب" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if category already exists
    const existingCategory = await db.collection("categories").findOne({
      $or: [{ "name.ar": categoryData.name.ar }, { "name.fr": categoryData.name.fr }],
    })

    if (existingCategory) {
      return NextResponse.json({ error: "التصنيف موجود بالفعل" }, { status: 400 })
    }

    categoryData.createdAt = new Date()
    categoryData.updatedAt = new Date()

    const result = await db.collection("categories").insertOne(categoryData)

    return NextResponse.json({
      success: true,
      message: "تم إضافة التصنيف بنجاح",
      categoryId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "حدث خطأ في إضافة التصنيف" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { categoryId, ...updateData } = await request.json()

    if (!categoryId) {
      return NextResponse.json({ error: "معرف التصنيف مطلوب" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    updateData.updatedAt = new Date()

    const result = await db.collection("categories").updateOne({ _id: new ObjectId(categoryId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "تم تحديث التصنيف بنجاح" })
  } catch (error) {
    console.error("Error updating category:", error)
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

    const { db } = await connectToDatabase()

    // Check if category has products
    const productCount = await db.collection("products").countDocuments({
      categoryId: new ObjectId(categoryId),
    })

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `لا يمكن حذف التصنيف لأنه يحتوي على ${productCount} منتج`,
        },
        { status: 400 },
      )
    }

    const result = await db.collection("categories").deleteOne({ _id: new ObjectId(categoryId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "تم حذف التصنيف بنجاح" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "حدث خطأ في حذف التصنيف" }, { status: 500 })
  }
}
