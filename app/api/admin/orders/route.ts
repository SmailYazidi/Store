// /app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Optional filters
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (customerId) query.customerId = new ObjectId(customerId);

    // Get orders with pagination
    const orders = await db
      .collection('orders')
      .find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await db.collection('orders').countDocuments(query);

    // Populate product and customer details
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // Fetch product details
        const product = await db
          .collection('products')
          .findOne({ _id: new ObjectId(order.productId) });

        // Fetch customer details
        const customer = order.customerId
          ? await db
              .collection('users')
              .findOne({ _id: new ObjectId(order.customerId) })
          : null;

        return {
          ...order,
          productName: product?.name?.fr || order.productName?.fr || 'Unknown Product',
          productImage: product?.mainImage || order.productImage || '',
          customerName: customer?.name || order.customerName || 'Guest',
          customerEmail: customer?.email || order.customerEmail || '',
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: ordersWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
