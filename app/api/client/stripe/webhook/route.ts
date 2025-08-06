import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define OrderStatus enum locally
enum OrderStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  PAID = "paid",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  REJECTED = "rejected",
  PAYMENT_PENDING = "payment_pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const db = await connectDB();
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: OrderStatus.PAID,
            paymentMethod: "card",
            paymentStatus: "paid",
            updatedAt: new Date(),
          },
        }
      );

      console.log(`✅ Order ${orderId} marked as paid`);
    }
  }

  return NextResponse.json({ received: true });
}
