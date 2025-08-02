import { type NextRequest, NextResponse } from "next/server"
import { verifyPassword, generateToken } from "@/lib/auth"

const hardcodedAdmin = {
  _id: "688e631eb5e25dc30fcdf14c",
  username: "admin",
  email: "admin@store.com",
  passwordHash: "$2a$12$9hJvlE5Wh3uJP3pyDVPX6.8DKK8zIx5avJBIavUXSgfQhfZTGhnLC", // bcrypt hash for "admin"
  createdAt: new Date(1754092800000),
  updatedAt: new Date(1754092800000),
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      )
    }

    const inputMatches =
      username === hardcodedAdmin.username || username === hardcodedAdmin.email

    if (!inputMatches) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, hardcodedAdmin.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      )
    }

    const token = generateToken({
      id: hardcodedAdmin._id,
      username: hardcodedAdmin.username,
      email: hardcodedAdmin.email,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: hardcodedAdmin._id,
        username: hardcodedAdmin.username,
        email: hardcodedAdmin.email,
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
