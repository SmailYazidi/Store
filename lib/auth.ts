import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AdminUser {
  id: string
  username: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AdminUser): string {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): AdminUser | null {
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

  return verifyToken(token)
}
