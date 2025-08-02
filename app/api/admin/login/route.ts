import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { getIronSession } from "iron-session/edge"
import { sessionOptions } from "@/lib/session"

// واجهة الجلسة
export interface AdminSession {
  adminLoggedIn?: boolean
}

// دالة الحصول على الجلسة
async function getSession(request: Request) {
  return getIronSession<AdminSession>(request, sessionOptions)
}

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!password) {
    return NextResponse.json({ error: "كلمة المرور مطلوبة" }, { status: 400 })
  }

  const db = await connectDB()
  const stored = await db.collection("admin_passwords").findOne({})

  if (!stored || !stored.passwordHash) {
    return NextResponse.json({ error: "لا توجد كلمة مرور محفوظة" }, { status: 500 })
  }

  const isMatch = await bcrypt.compare(password, stored.passwordHash)

  if (!isMatch) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
  }

  const session = await getSession(request)
  session.adminLoggedIn = true
  await session.save()

  return NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" })
}
