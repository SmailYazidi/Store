// /app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const db = await connectDB();
    const productData = await request.json();

    // Validate required fields
    if (
      !productData.name?.ar ||
      !productData.name?.fr ||
      !productData.price ||
      !productData.categoryId
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await db.collection('categories').findOne({
      _id: new ObjectId(productData.categoryId),
    });

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Create new product
    const newProduct = {
      ...productData,
      categoryId: new ObjectId(productData.categoryId),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      purchases: 0,
    };

    const result = await db.collection('products').insertOne(newProduct);

    if (!result.acknowledged) {
      throw new Error('Failed to create product');
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newProduct,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await db
      .collection('products')
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await db.collection('products').countDocuments();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}