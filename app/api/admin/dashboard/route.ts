import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const db = await connectDB();

    const session = await db.collection("sessions").findOne({ _id: sessionId });
    if (!session) {
      return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
    }

    const [totalOrders, totalProducts, totalCategories, ordersByStatus, recentOrders] = await Promise.all([
      db.collection("orders").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("categories").countDocuments(),
      db
        .collection("orders")
        .aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      db.collection("orders").find().sort({ createdAt: -1 }).limit(5).toArray(),
    ]);

    const totalRevenue = await db
      .collection("orders")
      .aggregate([
        { $match: { status: { $in: ["Paid", "Delivered"] } } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$productPrice", "$quantity"] } },
          },
        },
      ])
      .toArray();

    const stats = {
      totalOrders,
      totalProducts,
      totalCategories,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentOrders,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الإحصائيات" }, { status: 500 });
  }
}
