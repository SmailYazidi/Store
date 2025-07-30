import { NextResponse } from "next/server"
import Stripe from "stripe"

// Check if Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not found in environment variables")
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null

export async function POST(request: Request) {
  try {
    // If Stripe is not configured, return a mock response for development
    if (!stripe) {
      console.log("Stripe not configured, returning mock payment intent")
      return NextResponse.json({
        clientSecret: "pi_mock_client_secret_for_development",
        message: "Stripe not configured - using mock payment",
      })
    }

    const { orderId, amount, currency = "usd" } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        orderId,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
