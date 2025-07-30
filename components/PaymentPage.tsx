"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"

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

      const data = await response.json()

      // For development/demo purposes, simulate successful payment
      if (data.clientSecret || data.message) {
        // Confirm payment in database
        await fetch(`/api/orders/${orderId}/confirm-payment`, {
          method: "POST",
        })

        // Redirect to success page
        router.push(`/order-success/${orderId}`)
      } else {
        alert("فشل في إنشاء عملية الدفع")
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
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>ملاحظة:</strong> هذا مثال تجريبي للدفع
            </p>
            <p className="text-xs text-blue-600">في التطبيق الحقيقي، ستحتاج إلى إعداد Stripe أو نظام دفع آخر</p>
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

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => router.push(`/order-success/${orderId}`)}
              className="bg-transparent"
            >
              تخطي الدفع (للتجربة)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
