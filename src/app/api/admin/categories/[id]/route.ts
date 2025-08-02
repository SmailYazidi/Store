/* import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    const body = await request.json()
    const updateData = {
      name: {
        ar: body.name.ar,
        fr: body.name.fr,
      },
      updatedAt: new Date(),
    }

    await db.collection("categories").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    return NextResponse.json({ message: "Category updated successfully" })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    // Check if category has products
    const productsCount = await db.collection("products").countDocuments({
      category: new ObjectId(params.id),
    })

    if (productsCount > 0) {
      return NextResponse.json({ error: "Cannot delete category with existing products" }, { status: 400 })
    }

    await db.collection("categories").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
 */