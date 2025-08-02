import { type NextRequest, NextResponse } from "next/server"
import { getAdminFromRequest, verifyAdminPassword, hashPassword } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    return NextResponse.json({
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        createdAt: new Date().toISOString(), // Mock date since we don't store admin in DB
      },
    })
  } catch (error) {
    console.error("Error fetching admin account:", error)
    return NextResponse.json({ error: "حدث خطأ في جلب بيانات الحساب" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "كلمة المرور الحالية والجديدة مطلوبتان" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyAdminPassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    console.log("New password hash for environment variable:")
    console.log(`ADMIN_PASSWORD_HASH=${newPasswordHash}`)

    return NextResponse.json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح. يرجى تحديث متغير البيئة ADMIN_PASSWORD_HASH",
      newHash: newPasswordHash,
    })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "حدث خطأ في تحديث كلمة المرور" }, { status: 500 })
  }
}
