import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function POST(request: Request) {
  try {
    const { orderId, amount, currency } = await request.json();

    // Validate input
    if (!orderId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await connectDB();
    const db = client.db();

    // Verify order exists and is verified
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderId),
      isVerified: true,
      status: 'verified',
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or not verified' },
        { status: 404 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}