import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/mongodb';
import { parse } from 'cookie';

async function getAdminIdFromSession(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const cookies = parse(cookie);
  const sessionId = cookies.sessionId;
  if (!sessionId) return null;

  const db = await connectDB();
  const session = await db.collection('admin_sessions').findOne({ _id: sessionId });
  if (!session) return null;

  // Check if session is expired
  if (new Date() > new Date(session.expiresAt)) {
    await db.collection('admin_sessions').deleteOne({ _id: sessionId });
    return null;
  }

  return session.adminId;
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await getAdminIdFromSession(request);
    if (!adminId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return new NextResponse('Missing passwords', { status: 400 });
    }

    const db = await connectDB();
    const admin = await db.collection('admin_passwords').findOne({ _id: adminId });

    if (!admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const validPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!validPassword) {
      return new NextResponse('Current password incorrect', { status: 403 });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await db.collection('admin_passwords').updateOne(
      { _id: adminId },
      {
        $set: {
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        },
      }
    );

    return new NextResponse('Password updated successfully', { status: 200 });

  } catch (error) {
    console.error('Change password error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} export async function GET(request: NextRequest) {
  try {
    const adminId = await getAdminIdFromSession(request);
    if (!adminId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json({ adminId });
  } catch (err) {
    console.error('GET /admin/account error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
