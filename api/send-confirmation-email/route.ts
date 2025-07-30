import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import * as nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
})

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    const client = await clientPromise
    const db = client.db("store")

    const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">تأكيد الطلب - Store</h2>
        
        <p>مرحباً ${order.customerName},</p>
        
        <p>شكراً لك على طلبك. تم إنشاء طلبك بنجاح وسيتم معالجته قريباً.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>تفاصيل الطلب:</h3>
          <p><strong>رمز الطلب:</strong> ${order.orderCode}</p>
          <p><strong>المنتج:</strong> ${order.productName}</p>
          <p><strong>السعر:</strong> ${order.productPrice} دج</p>
          <p><strong>الحالة:</strong> جاري المعالجة</p>
        </div>
        
        <p>يمكنك تتبع طلبك باستخدام الرمز أعلاه على موقعنا.</p>
        
        <p>شكراً لاختيارك متجرنا!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.
        </p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@store.com",
      to: order.customerEmail,
      subject: `تأكيد الطلب - ${order.orderCode}`,
      html: emailHtml,
    })

    return NextResponse.json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
