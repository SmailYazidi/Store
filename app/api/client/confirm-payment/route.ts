import { NextResponse } from "next/server"
import Stripe from "stripe"
import { connectDB } from "@/lib/mongodb"
import { OrderStatus } from "@/lib/models"
import { validateOrderForPayment } from "@/lib/order-utils" // Helper function for validation

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Updated to latest Stripe API version
})

interface PaymentRequest {
  orderCode: string
}

export async function POST(req: Request) {
  try {
    const { orderCode }: PaymentRequest = await req.json()

    // Validate input
    if (!orderCode || typeof orderCode !== "string" || orderCode.length !== 16) {
      return NextResponse.json(
        { 
          message: "Invalid order code",
          details: "Order code must be a 16-character string"
        },
        { status: 400 }
      )
    }

    const db = await connectDB()
    
    // Validate order status and get order details
    const validationResult = await validateOrderForPayment(db, orderCode)
    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          message: validationResult.message,
          code: validationResult.code 
        },
        { status: validationResult.statusCode || 400 }
      )
    }
    const order = validationResult.order!

    // Prepare Stripe metadata
    const metadata = {
      orderId: order._id.toString(),
      orderCode,
      customerEmail: order.customerEmail,
      productId: order.productId.toString()
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: order.productCurrency?.toLowerCase() || "usd",
            product_data: {
              name: order.productName,
              description: `Order #${orderCode}`,
              images: order.productImage ? [order.productImage] : [],
            },
            unit_amount: Math.round(order.productPrice * 100), // Ensure whole number
          },
          quantity: order.quantity || 1,
        },
      ],
      mode: "payment",
      customer_email: order.customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderCode}?canceled=true`,
      metadata,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes expiration
    })

    // Update order with payment details
    await db.collection("orders").updateOne(
      { orderCode },
      {
        $set: {
          status: OrderStatus.PaymentPending,
          paymentSessionId: session.id,
          paymentIntentId: session.payment_intent,
          paymentExpiresAt: new Date(session.expires_at * 1000),
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json(
      { 
        success: true,
        sessionId: session.id,
        paymentUrl: session.url 
      },
      { status: 200 }
    )

  } catch (error: unknown) {
    console.error("Payment initiation error:", error)

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.code || "STRIPE_ERROR",
          type: error.type
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        message: "Payment processing failed",
        code: "PAYMENT_PROCESSING_ERROR"
      },
      { status: 500 }
    )
  }
}