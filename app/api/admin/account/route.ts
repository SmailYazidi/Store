import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getAdminFromRequest, hashPassword, verifyPassword } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const db = await connectDB()
    const adminData = await db
      .collection("admins")
      .findOne({ _id: new ObjectId(admin.id) }, { projection: { passwordHash: 0 } })

    if (!adminData) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    return NextResponse.json({
      admin: {
        id: adminData._id.toString(),
        username: adminData.username,
        email: adminData.email,
        createdAt: adminData.createdAt,
      },
    })
  } catch (error) {
    console.error("Get admin error:", error)
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

    const db = await connectDB()
    const adminData = await db.collection("admins").findOne({
      _id: new ObjectId(admin.id),
    })

    if (!adminData) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    const isValidPassword = await verifyPassword(currentPassword, adminData.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 })
    }

    const hashedNewPassword = await hashPassword(newPassword)

    await db.collection("admins").updateOne(
      { _id: new ObjectId(admin.id) },
      {
        $set: {
          passwordHash: hashedNewPassword,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "حدث خطأ في تحديث كلمة المرور" }, { status: 500 })
  }
}
