import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { order_id, code } = await request.json();

    if (!order_id || !code) {
      return NextResponse.json(
        { success: false, message: 'يجب إدخال رمز الطلب ورمز التحقق' },
        { status: 400 }
      );
    }

    if (code.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق يجب أن يكون 6 أرقام' },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Try to find the order using order_id and verificationCode
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(order_id),
      verificationCode: code,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق غير صحيح أو الطلب غير موجود' },
        { status: 404 }
      );
    }

    if (order.isVerified) {
      return NextResponse.json(
        { success: false, message: 'تم التحقق من هذا الطلب مسبقًا' },
        { status: 400 }
      );
    }

    // Update order as verified
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(order_id) },
      {
        $set: {
          isVerified: true,
          status: 'verified',
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error('فشل في تحديث حالة الطلب');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم التحقق بنجاح',
        orderId: order._id.toString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء التحقق',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
