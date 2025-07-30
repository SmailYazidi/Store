"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { useToast } from "@/hooks/use-toast"

interface OrderSuccessProps {
  orderId: string
}

interface Order {
  _id: string
  orderCode: string
  customerName: string
  productName: string
  productPrice: number
  status: string
  createdAt: string
}

export function OrderSuccess({ orderId }: OrderSuccessProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const { toast } = useToast()

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

  const copyOrderCode = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderCode)
      toast({
        title: t("codeCopied"),
        description: order.orderCode,
      })
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
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">{t("orderSuccess")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("orderDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">{t("orderCode")}</p>
              <p className="text-xl font-bold">{order.orderCode}</p>
            </div>
            <Button variant="outline" size="sm" onClick={copyOrderCode}>
              <Copy className="h-4 w-4 mr-2" />
              {t("copyCode")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("customer")}</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("status")}</p>
              <p className="font-medium">{t(order.status)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("productName")}</p>
            <p className="font-medium">{order.productName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("total")}</p>
            <p className="text-2xl font-bold text-primary">{order.productPrice} DH</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("date")}</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href={`/payment/${order._id}`} className="flex-1">
          <Button className="w-full">{t("payNow")}</Button>
        </Link>
        <Link href="/track-order" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            {t("trackOrder")}
          </Button>
        </Link>
      </div>

      <div className="text-center">
        <Link href="/">
          <Button variant="link">{t("continue")}</Button>
        </Link>
      </div>
    </div>
  )
}
