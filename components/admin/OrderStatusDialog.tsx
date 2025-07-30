"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  _id: string
  orderCode: string
  customerName: string
  productName: string
  status: string
}

interface OrderStatusDialogProps {
  order: Order
  onClose: () => void
  onSave: (orderId: string, status: string) => void
}

export function OrderStatusDialog({ order, onClose, onSave }: OrderStatusDialogProps) {
  const [status, setStatus] = useState(order.status)
  const { t } = useLanguage()

  const handleSave = () => {
    onSave(order._id, status)
  }

  const statusOptions = [
    { value: "processing", label: t("processing") },
    { value: "confirmed", label: t("confirmed") },
    { value: "delivered", label: t("delivered") },
    { value: "rejected", label: t("rejected") },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>تحديث حالة الطلب</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">الطلب: {order.orderCode}</p>
            <p className="font-semibold">{order.productName}</p>
            <p className="text-sm text-muted-foreground">العميل: {order.customerName}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("status")}</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {t("save")}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {t("cancel")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
