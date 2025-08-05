import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const categories = await db.collection("categories").find().toArray();

    return NextResponse.json({
      success: true,
      data: categories.map((category) => ({
        ...category,
        _id: category._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "خطأ في جلب التصنيفات" },
      { status: 500 }
    );
  }
}
