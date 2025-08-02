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

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()

    // Build filter
    const filter: any = {}
    if (categoryId && categoryId !== "all") {
      filter.categoryId = new ObjectId(categoryId)
    }
    if (search) {
      filter.$or = [
        { "name.ar": { $regex: search, $options: "i" } },
        { "name.fr": { $regex: search, $options: "i" } },
        { "description.ar": { $regex: search, $options: "i" } },
        { "description.fr": { $regex: search, $options: "i" } },
      ]
    }

    // Get products with category info
    const products = await db
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
      .toArray()

    const totalCount = await db.collection("products").countDocuments(filter)

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "categoryId", "mainImage"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const { db } = await connectToDatabase()

    // Verify category exists
    const category = await db.collection("categories").findOne({
      _id: new ObjectId(productData.categoryId),
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const newProduct = {
      ...productData,
      categoryId: new ObjectId(productData.categoryId),
      images: productData.images || [],
      quantity: productData.quantity || 0,
      isVisible: productData.isVisible !== false,
      currency: productData.currency || "USD",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(newProduct)

    return NextResponse.json(
      {
        message: "Product created successfully",
        productId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, ...updateData } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // If categoryId is being updated, verify it exists
    if (updateData.categoryId) {
      const category = await db.collection("categories").findOne({
        _id: new ObjectId(updateData.categoryId),
      })

      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }

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
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Update product error:", error)
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
    const productId = searchParams.get("id")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if product has orders
    const hasOrders = await db.collection("orders").findOne({
      productId: productId,
    })

    if (hasOrders) {
      return NextResponse.json({ error: "Cannot delete product with existing orders" }, { status: 400 })
    }

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(productId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
