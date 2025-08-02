import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword, generateAdminToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "كلمة المرور مطلوبة" }, { status: 400 })
    }

    const isValidPassword = await verifyAdminPassword(password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
    }

    const token = generateAdminToken()

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" })
  response.cookies.delete("admin-token")
  return response
}
