import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface AdminTokenPayload {
  adminId: string
  username: string
  iat: number
  exp: number
}

export async function verifyAdminToken(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    let token = request.cookies.get("admin-token")?.value

    if (!token) {
      const authHeader = request.headers.get("Authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return { isValid: false, error: "No token provided" }
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload

    return {
      isValid: true,
      adminId: decoded.adminId,
      username: decoded.username,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return { isValid: false, error: "Invalid token" }
  }
}

export function generateAdminToken(adminId: string, username: string) {
  return jwt.sign({ adminId, username }, JWT_SECRET, { expiresIn: "24h" })
}
