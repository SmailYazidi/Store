import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

interface VerifyCodeRequestBody {
  orderCode: string
  verificationCode: string
}

export async function POST(req: Request) {
  try {
    const { orderCode, verificationCode }: VerifyCodeRequestBody = await req.json()

    if (!orderCode || !verificationCode) {
      return NextResponse.json({ message: "Missing orderCode or verificationCode" }, { status: 400 })
    }

    const db = await connectDB()

    const order = await db.collection("orders").findOne({ orderCode })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // تحقق من رمز التحقق (مثلاً إذا هو نفسه orderCode)
    if (verificationCode !== orderCode) {
      return NextResponse.json({ message: "Verification code is incorrect" }, { status: 400 })
    }

    await db.collection("orders").updateOne(
      { orderCode },
      { $set: { emailVerified: true, status: "payment_pending", updatedAt: new Date() } }
    )

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Verify code error:", error.message)
    } else {
      console.error("Verify code error:", error)
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}