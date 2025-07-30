"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/app/providers"
import { MessageCircle, Copy, Check } from "lucide-react"
import Image from "next/image"

interface Order {
  _id: string
  orderCode: string
  customerName: string
  productName: string
  productImage: string
  status: "processing" | "confirmed" | "rejected" | "delivered"
  createdAt: string
}

export function TrackOrder() {
  const [orderCode, setOrderCode] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const response = await fetch(`/api/orders/track?code=${orderCode}`)
      const data = await response.json()

      if (response.ok) {
        setOrder(data)
      } else {
        setError(data.message || "رمز الطلب غير صحيح")
      }
    } catch (error) {
      setError("حدث خطأ في البحث عن الطلب")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return t("processing")
      case "confirmed":
        return t("confirmed")
      case "delivered":
        return t("delivered")
      case "rejected":
        return t("rejected")
      default:
        return status
    }
  }

  const handleWhatsAppContact = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "213123456789"
    const message = `مرحبا، نسيت رمز الطلب الخاص بي. يرجى المساعدة.`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const copyOrderCode = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("trackOrder")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderCode">{t("orderCode")}</Label>
              <Input
                id="orderCode"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="أدخل رمز الطلب"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جاري البحث..." : "تتبع الطلب"}
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" onClick={handleWhatsAppContact} className="text-green-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                نسيت رمز الطلب؟ تواصل معنا
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {order && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              تفاصيل الطلب
              <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
            </CardTitle>
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
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-mono flex-1">{order.orderCode}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOrderCode}
                className="flex items-center gap-2 bg-transparent"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "تم النسخ" : "نسخ"}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-DZ")}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
