import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyAdminToken } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      admin: {
        username: adminVerification.username,
        lastLogin: new Date(),
      },
    })
  } catch (error) {
    console.error("Get admin account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminVerification = await verifyAdminToken(request)
    if (!adminVerification.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get current admin password
    const adminPassword = await db.collection("adminPasswords").findOne({})

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, adminPassword.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await db.collection("adminPasswords").updateOne(
      { _id: adminPassword._id },
      {
        $set: {
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Update admin password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
