import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ""

export interface AdminUser {
  id: string
  username: string
  role: string
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) {
    console.error("ADMIN_PASSWORD_HASH not set in environment variables")
    return false
  }

  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

export function generateAdminToken(): string {
  const adminUser: AdminUser = {
    id: "admin",
    username: "admin",
    role: "admin",
  }

  return jwt.sign(adminUser, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
    return decoded
  } catch (error) {
    return null
  }
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  const token = request.cookies.get("admin-token")?.value
  if (!token) return null

  return verifyAdminToken(token)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
