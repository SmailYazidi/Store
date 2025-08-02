import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find admin password record
    const adminPassword = await db.collection("adminPasswords").findOne({})

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 404 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPassword.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign({ adminId: adminPassword._id, username }, JWT_SECRET, { expiresIn: "24h" })

    // Create response with token in cookie
    const response = NextResponse.json({ message: "Login successful", token }, { status: 200 })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
