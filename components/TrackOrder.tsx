"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/app/providers"
import Image from "next/image"

interface OrderInfo {
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
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()

  const handleTrackOrder = async () => {
    if (!orderCode.trim()) return

    setLoading(true)
    setError("")
    setOrderInfo(null)

    try {
      const response = await fetch(`/api/orders/track?code=${encodeURIComponent(orderCode)}`)

      if (response.ok) {
        const data = await response.json()
        setOrderInfo(data)
      } else {
        setError(t("error"))
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setError(t("error"))
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("trackOrder")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("orderCode")}
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
            />
            <Button onClick={handleTrackOrder} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {orderInfo && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={orderInfo.productImage || "/placeholder.svg?height=80&width=80"}
                      alt={orderInfo.productName}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{orderInfo.orderCode}</h3>
                      <Badge className={getStatusColor(orderInfo.status)}>{t(orderInfo.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("customer")}: {orderInfo.customerName}
                    </p>
                    <p className="text-sm">{orderInfo.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(orderInfo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>{t("forgotCode")}</p>
            <Button variant="link" size="sm">
              {t("contactUs")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
