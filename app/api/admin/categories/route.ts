import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyAdminToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || !name.ar || !name.fr) {
      return NextResponse.json({ error: "Category name in both Arabic and French is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if category with same name exists
    const existingCategory = await db.collection("categories").findOne({
      $or: [{ "name.ar": name.ar }, { "name.fr": name.fr }],
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    const newCategory = {
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(newCategory)

    return NextResponse.json(
      {
        message: "Category created successfully",
        categoryId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId, name } = await request.json()

    if (!categoryId || !name || !name.ar || !name.fr) {
      return NextResponse.json({ error: "Category ID and name in both languages are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if another category with same name exists
    const existingCategory = await db.collection("categories").findOne({
      _id: { $ne: new ObjectId(categoryId) },
      $or: [{ "name.ar": name.ar }, { "name.fr": name.fr }],
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
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
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category updated successfully" })
  } catch (error) {
    console.error("Update category error:", error)
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
    const categoryId = searchParams.get("id")

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if category has products
    const hasProducts = await db.collection("products").findOne({
      categoryId: new ObjectId(categoryId),
    })

    if (hasProducts) {
      return NextResponse.json({ error: "Cannot delete category with existing products" }, { status: 400 })
    }

    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(categoryId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
