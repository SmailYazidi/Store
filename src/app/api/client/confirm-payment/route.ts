import { NextResponse } from "next/server"
import Stripe from "stripe"
import clientPromise from "@/lib/mongodb"
import { OrderStatus } from "@/lib/models"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function POST(req: Request) {
  try {
    const { orderCode }: { orderCode: string } = await req.json()

    if (!orderCode) {
      return NextResponse.json({ message: "Missing orderCode" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find order by orderCode and check status and email verification
    const order = await db.collection("orders").findOne({ orderCode })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    if (!order.emailVerified) {
      return NextResponse.json({ message: "Email not verified" }, { status: 400 })
    }

    if (order.status === OrderStatus.Paid) {
      return NextResponse.json({ message: "Order already paid" }, { status: 400 })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: order.productCurrency || "usd",
            product_data: {
              name: order.productName,
              images: [order.productImage],
            },
            unit_amount: order.productPrice * 100, // amount in cents
          },
          quantity: order.quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/client/order-success/${orderCode}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/client/payment/${orderCode}`,
      metadata: {
        orderId: order._id?.toString() || "",
        orderCode,
      },
    })

    // Update order status to payment_pending and save paymentIntentId/sessionId
    await db.collection("orders").updateOne(
      { orderCode },
      {
        $set: {
          status: OrderStatus.PaymentPending,
          paymentIntentId: session.payment_intent || session.id,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ sessionId: session.id })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Confirm payment error:", error.message)
    } else {
      console.error("Confirm payment error:", error)
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
