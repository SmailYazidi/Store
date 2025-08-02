import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectDB } from "@/lib/mongodb"
import { validateObjectId } from "@/lib/validation"

interface Category {
  _id: ObjectId
  name: {
    ar: string
    fr: string
    en?: string
  }
  slug: string
  imageUrl?: string
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!validateObjectId(params.id)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid category ID format",
          code: "INVALID_ID_FORMAT"
        },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const category = await db.collection<Category>("categories").findOne(
      { _id: new ObjectId(params.id) },
      { 
        projection: {
          // Explicitly include only necessary fields
          "name.ar": 1,
          "name.fr": 1,
          "name.en": 1,
          slug: 1,
          imageUrl: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    )

    if (!category) {
      return NextResponse.json(
        { 
          success: false,
          error: "Category not found",
          code: "CATEGORY_NOT_FOUND",
          suggestion: "Check the category ID or try listing all categories first"
        },
        { status: 404 }
      )
    }

    // Convert ObjectId to string and dates to ISO strings
    const responseData = {
      ...category,
      _id: category._id.toString(),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    }

    return NextResponse.json(
      { 
        success: true,
        data: responseData 
      },
      { 
        headers: {
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        }
      }
    )

  } catch (error) {
    console.error("Category fetch error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch category details",
        code: "CATEGORY_FETCH_ERROR"
      },
      { status: 500 }
    )
  }
}