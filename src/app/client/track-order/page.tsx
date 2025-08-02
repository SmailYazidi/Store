"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TrackOrderPage() {
  const router = useRouter()
  const [orderCode, setOrderCode] = useState("")
  const [orderInfo, setOrderInfo] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setOrderInfo(null)

    if (!orderCode.trim()) {
      setError("Please enter your order code.")
      return
    }

    try {
      const res = await fetch(`/api/client/track-order?orderCode=${encodeURIComponent(orderCode)}`)
      if (!res.ok) {
        throw new Error("Order not found.")
      }
      const data = await res.json()
      setOrderInfo(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch order.")
    }
  }

  return (
    <div style={{  margin: "auto", padding: 16, color: "#000", backgroundColor: "#fff", minHeight: "100vh" }}>
      <button 
        onClick={() => router.back()} 
        style={{ marginBottom: 16, cursor: "pointer", fontSize: 18, border: "none", background: "none", color: "#000" }}
        aria-label="Go back"
      >
        ← رجوع
      </button>

      <h1 style={{ marginBottom: 16, textAlign: "center" }}>تتبع طلبك</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <label htmlFor="orderCode" style={{ display: "block", marginBottom: 8 }}>
          أدخل كود الطلب:
        </label>
        <input
          id="orderCode"
          type="text"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          style={{ width: "100%", padding: 8, boxSizing: "border-box", marginBottom: 8, border: "1px solid #000", color: "#000" }}
          placeholder="مثلاً: FA6W5YTWEGWE767W6EW"
        />
        <button
          type="submit"
          style={{ width: "100%", padding: 8, cursor: "pointer", border: "1px solid #000", backgroundColor: "#fff", color: "#000" }}
        >
          تحقق
        </button>
      </form>

      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      {orderInfo && (
        <div>
          <h2 style={{ marginBottom: 8 }}>تفاصيل الطلب</h2>
          <p><strong>كود الطلب:</strong> {orderInfo.orderCode}</p>
          <p><strong>اسم العميل:</strong> {orderInfo.customerName}</p>
          <p><strong>البريد الإلكتروني:</strong> {orderInfo.customerEmail}</p>
          <p><strong>الهاتف:</strong> {orderInfo.customerPhone}</p>
          <p><strong>المنتج:</strong> {orderInfo.productName}</p>
          <p><strong>السعر:</strong> {orderInfo.productPrice} {orderInfo.productCurrency}</p>
          <p><strong>الكمية:</strong> {orderInfo.quantity}</p>
          <p><strong>حالة الطلب:</strong> {orderInfo.status}</p>
        </div>
      )}
    </div>
  )
}
