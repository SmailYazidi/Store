import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    const client = await clientPromise
    const db = client.db("store")

    // Get admin password from database
    const adminData = await db.collection("adminpassword").findOne({})

    if (!adminData) {
      // Create default admin password if none exists
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.collection("adminpassword").insertOne({
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Check if the provided password matches the default
      const isValid = await bcrypt.compare(password, hashedPassword)
      if (isValid) {
        return NextResponse.json({
          message: "Login successful",
          token: "admin-token-" + Date.now(),
        })
      }
    } else {
      const isValid = await bcrypt.compare(password, adminData.password)
      if (isValid) {
        return NextResponse.json({
          message: "Login successful",
          token: "admin-token-" + Date.now(),
        })
      }
    }

    return NextResponse.json({ message: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
