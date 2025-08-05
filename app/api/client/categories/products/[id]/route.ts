import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const categoryId = params.id; // No need to await here in API routes

    if (!ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "معرف التصنيف غير صالح" },
        { status: 400 }
      );
    }

    const products = await db
      .collection("products")
      .find({ 
        categoryId: new ObjectId(categoryId), 
        isVisible: true 
      })
      .toArray();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "فشل في جلب المنتجات" },
      { status: 500 }
    );
  }
}