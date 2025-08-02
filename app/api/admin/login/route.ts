import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "اسم المستخدم وكلمة المرور مطلوبان" }, { status: 400 })
    }

    const db = await connectDB()
    const admin = await db.collection("admins").findOne({
      $or: [{ username }, { email: username }],
    })
//sdshdsh
    if (!admin) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, admin.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 })
    }

    const token = generateToken({
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
      },
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("admin-token")
  return response
}
