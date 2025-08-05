import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { paymentMethod, paymentStatus } = await req.json();
    const { id } = params;

    if (!paymentMethod || !paymentStatus) {
      return NextResponse.json(
        { message: 'Missing paymentMethod or paymentStatus' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const orders = db.collection('orders');

    const result = await orders.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          paymentMethod,
          paymentStatus,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Payment method updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
