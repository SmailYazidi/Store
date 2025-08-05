// app/api/client/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

enum OrderStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  PAID = "paid",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

type PaymentMethod = "card" | "cash_on_delivery";

const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateOrderCode = () =>
  `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, name, email, phone, address } = body;

  if (!productId || !name || !email || !phone || !address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const db = await connectDB();
    const productObjectId = new ObjectId(productId);

    const product = await db.collection("products").findOne({
      _id: productObjectId,
      quantity: { $gt: 0 },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not available" }, { status: 400 });
    }

    const verificationCode = generateVerificationCode();
    const orderCode = generateOrderCode();

    const order = {
      orderCode,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      productId: productObjectId,
      productName: product.name,
      productPrice: product.price,
      productImage: product.mainImage || null,
      currency: product.currency,
      status: OrderStatus.PENDING,
      paymentMethod: null as PaymentMethod | null,
      paymentStatus: "pending",
      verificationCode,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    await db.collection("products").updateOne(
      { _id: productObjectId },
      { $inc: { quantity: -1 } }
    );

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: { ...order, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
