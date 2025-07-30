"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"

interface PaymentPageProps {
  orderId: string
}

interface Order {
  _id: string
  orderCode: string
  customerName: string
  productName: string
  productPrice: number
  status: string
}

export function PaymentPage({ orderId }: PaymentPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handlePayment = async () => {
    if (!order) return

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Confirm payment
      const response = await fetch(`/api/orders/${orderId}/confirm-payment`, {
        method: "POST",
      })

      if (response.ok) {
        router.push(`/order-success/${orderId}`)
      }
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse max-w-2xl mx-auto">
        <div className="bg-gray-200 h-8 rounded w-48 mb-6"></div>
        <div className="bg-gray-200 h-64 rounded"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("error")}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t("paymentInfo")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("orderSummary")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>{t("orderCode")}:</span>
            <span className="font-medium">{order.orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("customer")}:</span>
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("productName")}:</span>
            <span className="font-medium">{order.productName}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>{t("total")}:</span>
            <span className="text-primary">{order.productPrice} DH</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("paymentInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePayment} disabled={processing} className="w-full" size="lg">
            <CreditCard className="h-5 w-5 mr-2" />
            {processing ? t("loading") : `${t("payNow")} - ${order.productPrice} DH`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
