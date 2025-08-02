import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context
  try {
    const client = await clientPromise
    const db = client.db("store")

    const category = await db.collection("categories").findOne({ _id: new ObjectId(params.id) })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

