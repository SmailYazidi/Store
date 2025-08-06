import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

// Define local IOrder interface (partial)
interface IOrder {
  _id: ObjectId;
  productName: string;
  productPrice: number;
  productCurrency?: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const db = await connectDB();

    const order = await db.collection<IOrder>("orders").findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: order.productCurrency || "usd",
            product_data: {
              name: order.productName,
            },
            unit_amount: Math.round(order.productPrice * 100),
          },
          quantity: order.quantity,
        },
      ],
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/order-success/${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/payment/${order._id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
