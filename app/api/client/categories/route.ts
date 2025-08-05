import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface CategoryName {
  ar: string
  fr: string
  en?: string
}

interface Category {
  name: CategoryName
  slug?: string
  imageUrl?: string
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

// Inline validation functions
const validateObjectId = (id: string): boolean => {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id
}

const validateCategoryInput = (body: any): { valid: boolean; errors?: string[] } => {
  const errors: string[] = []

  if (!body?.name?.ar) {
    errors.push("Arabic name (name.ar) is required")
  }

  if (body.slug && typeof body.slug !== 'string') {
    errors.push("Slug must be a string")
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()
}

export async function GET() {
  try {
    const db = await connectDB()
    const categories = await db.collection<Category>("categories").find().toArray()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Category list fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        code: "CATEGORY_LIST_ERROR"
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

    const category: Category = {
      name: {
        ar: body.name.ar,
        fr: body.name.fr || body.name.ar,
        en: body.name.en || body.name.ar
      },
      slug: body.slug || generateSlug(body.name.ar),
      imageUrl: body.imageUrl || null,
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        categoryId: result.insertedId
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
