import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { validateCategoryInput } from "@/lib/validation" // Assume you have validation utilities

interface CategoryName {
  ar: string
  fr: string
  en?: string // Added English as optional
}

interface Category {
  name: CategoryName
  slug?: string
  imageUrl?: string
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

export async function GET() {
  try {
    const db = await connectDB()

    const categories = await db.collection<Category>("categories")
      .find({ 
        // isActive: true // Uncomment to only fetch active categories
      })
      .sort({ 
        createdAt: -1,
        // "name.ar": 1 // Alternative sorting option
      })
      .project({ 
        // Custom projection to control returned fields
        name: 1,
        slug: 1,
        imageUrl: 1,
        isActive: 1,
        createdAt: 1
      })
      .toArray()

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    })

  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch categories",
        code: "CATEGORIES_FETCH_ERROR"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB()
    const body = await request.json()

    // Validate input
    const validation = validateCategoryInput(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.name.ar)

    const category: Category = {
      name: {
        ar: body.name.ar,
        fr: body.name.fr || body.name.ar, // Fallback to Arabic if French not provided
        en: body.name.en || body.name.ar  // Fallback to Arabic if English not provided
      },
      slug,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive !== false, // Default to true
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Check for existing category with same slug
    const existingCategory = await db.collection("categories")
      .findOne({ slug: category.slug })

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category with this slug already exists",
          code: "DUPLICATE_SLUG_ERROR"
        },
        { status: 409 }
      )
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        categoryId: result.insertedId,
        slug: category.slug
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create category",
        code: "CATEGORY_CREATION_ERROR"
      },
      { status: 500 }
    )
  }
}

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-') // Support Arabic characters
    .replace(/^-+|-+$/g, '')
    .trim()
}