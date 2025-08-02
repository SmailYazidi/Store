import { connectDB } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

async function getAdminFromSession(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map(cookie => cookie.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );

  const sessionId = cookies["sessionId"];
  if (!sessionId) return null;

  const db = await connectDB();
  // تأكد من أن اسم collection صحيح حسب مشروعك
  const session = await db.collection("adminSessions").findOne({ sessionId });
  if (!session) return null;

  return session.adminId; 
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromSession(request);
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const db = await connectDB();

    const query: any = {};

    if (search) {
      query.$or = [
        { orderCode: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection("orders").countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الطلبات" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromSession(request);
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "معرف الطلب والحالة مطلوبان" }, { status: 400 });
    }

    const db = await connectDB();

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم تحديث حالة الطلب بنجاح" });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "حدث خطأ في تحديث الطلب" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromSession(request);
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const db = await connectDB();

    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(orderId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "حدث خطأ في حذف الطلب" }, { status: 500 });
  }
}
