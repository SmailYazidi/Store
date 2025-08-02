"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage({ params }: { params: { orderCode: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/client/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode: params.orderCode })
      })

      const data = await res.json()

      if (!res.ok || !data.sessionId) throw new Error(data.message || "Something went wrong")

      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId: data.sessionId })
    } catch (err: any) {
      toast.error(err.message || "Failed to start payment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">الدفع</h1>
      <p className="mb-6 text-center">اضغط على الزر أدناه لإتمام عملية الدفع الخاصة بك.</p>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "جارٍ التوجيه إلى Stripe..." : "الدفع الآن"}
      </button>
    </div>
  )
}
