import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("store")

    await db.collection("orders").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          paymentStatus: "paid",
          status: "confirmed",
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Payment confirmed successfully" })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
