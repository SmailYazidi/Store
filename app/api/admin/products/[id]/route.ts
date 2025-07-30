import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    const body = await request.json()
    const updateData = {
      ...body,
      category: new ObjectId(body.category),
      updatedAt: new Date(),
    }

    await db.collection("products").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    const body = await request.json()

    await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    // Get product to delete images
    const product = await db.collection("products").findOne({ _id: new ObjectId(params.id) })

    if (product) {
      // Delete images from Vercel Blob
      for (const imageUrl of product.images) {
        try {
          await fetch("/api/delete-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: imageUrl }),
          })
        } catch (error) {
          console.error("Error deleting image:", error)
        }
      }

      // Delete related orders
      await db.collection("orders").deleteMany({ productId: params.id })
    }

    // Delete product
    await db.collection("products").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
