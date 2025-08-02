import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from '@/lib/mongodb';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new NextResponse('Missing credentials', { status: 400 });
    }

    const db = await connectDB();
    const admin = await db.collection('admin_passwords').findOne({ username });

    if (!admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // إنشاء session مع صلاحية 24 ساعة
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.collection('admin_sessions').insertOne({
      _id: sessionId,
      adminId: admin._id,
      expiresAt,
      createdAt: new Date(),
    });

    // إعداد الكوكي
    const cookie = serialize('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    return new NextResponse(
      JSON.stringify({ message: 'Login successful' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
        },
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
