"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { Order, OrderStatus } from "@/lib/models"

export default function VerifyOrderPage() {
  const router = useRouter()
  const { orderCode } = useParams()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [verified, setVerified] = useState(false)

  // جلب بيانات الطلب حسب orderCode
  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      try {
        const client = await clientPromise
        const db = client.db()
        const orderData = await db.collection<Order>("orders_pending").findOne({ orderCode })

        if (!orderData) {
          setError("كود الطلب غير صحيح أو الطلب غير موجود")
        } else {
          setOrder(orderData)
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات الطلب")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderCode])

  // دالة تحقق الكود (هنا مجرد مثال مبسط)
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!order) return

    setSubmitting(true)
    try {
      // في تطبيق حقيقي، كان يتم إرسال كود تحقق عبر إيميل ويقارن هنا
      // هنا نعتبر أن الكود الذي يدخل هو نفسه orderCode (كمثال)
      if (verificationCode === order.orderCode) {
        const client = await clientPromise
        const db = client.db()

        // تحديث حالة الطلب: تم التحقق
        await db.collection("orders_pending").updateOne(
          { orderCode },
          { $set: { status: OrderStatus.Confirmed, emailVerified: true, updatedAt: new Date() } }
        )

        setVerified(true)

        // يمكن حذف الطلب من "orders_pending" ونسخه إلى "orders" أو حفظه كما هو
        // أو تحويل المستخدم لصفحة شكراً
        router.push(`/client/thank-you?orderCode=${orderCode}`)
      } else {
        alert("كود التحقق غير صحيح، حاول مرة أخرى")
      }
    } catch (err) {
      alert("حدث خطأ أثناء التحقق، حاول مرة أخرى")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>جاري تحميل بيانات الطلب...</p>
  if (error) return <p>{error}</p>
  if (!order) return null

  return (
    <div>
      <h1>تحقق من طلبك</h1>
      <p>الطلب لكود: <strong>{order.orderCode}</strong></p>
      <p>المنتج: {order.productName}</p>
      <p>السعر: {order.productPrice} {order.productCurrency ?? ""}</p>

      {!verified ? (
        <form onSubmit={handleVerify}>
          <label>
            أدخل كود التحقق الذي وصلك في الإيميل:
            <input
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "جاري التحقق..." : "تحقق"}
          </button>
        </form>
      ) : (
        <p>تم التحقق من طلبك بنجاح! شكراً لك.</p>
      )}
    </div>
  )
}
