import { type NextRequest, NextResponse } from "next/server"

// Simple email sending without nodemailer for now
export async function POST(request: NextRequest) {
  try {
    const { to, subject, orderDetails } = await request.json()

    // For now, just log the email details
    // In production, you would integrate with an email service
    console.log("Email would be sent to:", to)
    console.log("Subject:", subject)
    console.log("Order details:", orderDetails)

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
