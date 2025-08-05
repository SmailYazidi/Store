import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { orderCode } = await req.json();

    if (!orderCode) {
      return NextResponse.json({ message: 'Order code is required' }, { status: 400 });
    }

    const db = await connectDB();
    const orders = db.collection('orders');

    const order = await orders.findOne({ orderCode });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Return the order details (omit sensitive info if needed)
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
