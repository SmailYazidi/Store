"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/client/orders/${orderCode}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "فشل تحميل الطلب")
        } else {
          setOrder(data)
        }
      } catch (err) {OrderStatus
        setError("فشل الاتصال بالخادم")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderCode])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!order) return

    setSubmitting(true)
    try {
      if (verificationCode === order.orderCode) {
        // بدلًا من التعديل هنا، يُفضل استخدام API
        setVerified(true)
        router.push(`/client/thank-you?orderCode=${orderCode}`)
      } else {
        alert("كود التحقق غير صحيح")
      }
    } catch (err) {
      alert("حدث خطأ أثناء التحقق")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>جاري تحميل الطلب...</p>
  if (error) return <p>{error}</p>
  if (!order) return null

  return (
    <div>
      <h1>تحقق من طلبك</h1>
      <p>الكود: <strong>{order.orderCode}</strong></p>
      <p>المنتج: {order.productName}</p>
      <p>السعر: {order.productPrice} {order.productCurrency ?? ""}</p>

      {!verified ? (
        <form onSubmit={handleVerify}>
          <label>
            أدخل كود التحقق:
            <input
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "جارٍ التحقق..." : "تحقق"}
          </button>
        </form>
      ) : (
        <p>تم التحقق من طلبك بنجاح! شكراً لك.</p>
      )}
    </div>
  )
}
