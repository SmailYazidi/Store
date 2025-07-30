"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { CheckCircle, Copy, Check, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Order {
  _id: string
  orderCode: string
  customerName: string
  customerEmail: string
  productName: string
  productPrice: number
  productImage: string
  status: string
}

interface OrderSuccessProps {
  orderId: string
}

export function OrderSuccess({ orderId }: OrderSuccessProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrder()
    sendConfirmationEmail()
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

  const sendConfirmationEmail = async () => {
    try {
      await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })
    } catch (error) {
      console.error("Error sending confirmation email:", error)
    }
  }

  const copyOrderCode = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4">{t("loading")}</p>
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
      {/* Success Message */}
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-600 mb-2">{t("orderSuccess")}</h1>
          <p className="text-muted-foreground">تم إنشاء طلبك بنجاح وسيتم معالجته قريباً</p>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <p className="text-primary font-bold">{order.productPrice} دج</p>
            </div>
          </div>

          {/* Order Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("orderCode")}</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-mono flex-1">{order.orderCode}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOrderCode}
                className="flex items-center gap-2 bg-transparent"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t("codeCopied") : t("copyCode")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">احتفظ بهذا الرمز لتتبع طلبك</p>
          </div>

          {/* Email Confirmation */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Mail className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">تم إرسال تأكيد الطلب إلى {order.customerEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/track-order" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            {t("trackOrder")}
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button className="w-full">العودة للمتجر</Button>
        </Link>
      </div>
    </div>
  )
}
