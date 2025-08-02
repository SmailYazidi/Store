import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { orderCode, verificationCode } = await req.json()

    if (!orderCode || !verificationCode) {
      return NextResponse.json({ message: "Missing orderCode or verificationCode" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find the order by orderCode
    const order = await db.collection("orders").findOne({ orderCode })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Here, assuming the verification code is the same as the orderCode sent by email
    // Or you can store a separate verification code in the order document if needed
    if (verificationCode !== orderCode) {
      return NextResponse.json({ message: "Verification code is incorrect" }, { status: 400 })
    }

    // Update order to mark email as verified and update status to payment_pending or keep existing
    await db.collection("orders").updateOne(
      { orderCode },
      { $set: { emailVerified: true, status: "payment_pending", updatedAt: new Date() } }
    )

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Verify code error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
