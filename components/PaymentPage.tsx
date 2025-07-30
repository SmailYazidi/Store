"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Order {
  _id: string
  orderCode: string
  customerName: string
  customerEmail: string
  productName: string
  productPrice: number
  productImage: string
}

interface PaymentPageProps {
  orderId: string
}

export function PaymentPage({ orderId }: PaymentPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!order) return

    setProcessing(true)
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.productPrice * 100, // Convert to cents
          currency: "dzd",
        }),
      })

      const { clientSecret } = await response.json()

      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to load")

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // This would be replaced with actual Stripe Elements
            number: "4242424242424242",
            exp_month: 12,
            exp_year: 2025,
            cvc: "123",
          },
          billing_details: {
            name: order.customerName,
            email: order.customerEmail,
          },
        },
      })

      if (error) {
        console.error("Payment failed:", error)
        alert("فشل في الدفع: " + error.message)
      } else {
        // Payment succeeded
        await fetch(`/api/orders/${orderId}/confirm-payment`, {
          method: "POST",
        })
        router.push(`/order-success/${orderId}`)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("حدث خطأ في عملية الدفع")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">الطلب غير موجود</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative rounded overflow-hidden">
              <Image
                src={order.productImage || "/placeholder.svg?height=64&width=64"}
                alt={order.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{order.productName}</h3>
              <p className="text-muted-foreground">العميل: {order.customerName}</p>
              <p className="text-primary font-bold text-lg">{order.productPrice} دج</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">في هذا المثال، سيتم استخدام بطاقة اختبار Stripe</p>
            <div className="space-y-2 text-sm">
              <p>رقم البطاقة: 4242 4242 4242 4242</p>
              <p>تاريخ الانتهاء: 12/25</p>
              <p>CVC: 123</p>
            </div>
          </div>

          <Button onClick={handlePayment} disabled={processing} className="w-full" size="lg">
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                {t("payNow")} - {order.productPrice} دج
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
