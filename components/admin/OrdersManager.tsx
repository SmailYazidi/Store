"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/app/providers"
import { Search, Edit, Trash2, Eye, X } from "lucide-react"
import { OrderStatusDialog } from "./OrderStatusDialog"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  _id: string
  orderCode: string
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  productName: string
  productPrice: number
  productImage: string
  status: "processing" | "confirmed" | "rejected" | "delivered"
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.productName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: status as any } : o)))
      setEditingOrder(null)
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      setOrders(orders.filter((o) => o._id !== orderId))
      setDeleteOrder(null)
    } catch (error) {
      console.error("Error deleting order:", error)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded animate-pulse w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("orders")}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchOrders")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("filter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="processing">{t("processing")}</SelectItem>
            <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
            <SelectItem value="delivered">{t("delivered")}</SelectItem>
            <SelectItem value="rejected">{t("rejected")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded overflow-hidden">
                    <Image
                      src={order.productImage || "/placeholder.svg?height=64&width=64"}
                      alt={order.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{order.productName}</h3>
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <p>الرمز: {order.orderCode}</p>
                      <p>العميل: {order.customerName}</p>
                      <p>السعر: {order.productPrice} دج</p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("ar-DZ")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteOrder(order)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noOrders")}</p>
        </div>
      )}

      {/* Order Status Dialog */}
      {editingOrder && (
        <OrderStatusDialog order={editingOrder} onClose={() => setEditingOrder(null)} onSave={handleUpdateStatus} />
      )}

      {/* Order Details Dialog */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>تفاصيل الطلب</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setViewingOrder(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative rounded overflow-hidden">
                  <Image
                    src={viewingOrder.productImage || "/placeholder.svg?height=80&width=80"}
                    alt={viewingOrder.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{viewingOrder.productName}</h3>
                  <p className="text-primary font-bold">{viewingOrder.productPrice} دج</p>
                  <Badge className={getStatusColor(viewingOrder.status)}>{getStatusText(viewingOrder.status)}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">معلومات العميل</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>الاسم:</strong> {viewingOrder.customerName}
                    </p>
                    <p>
                      <strong>الهاتف:</strong> {viewingOrder.customerPhone}
                    </p>
                    <p>
                      <strong>البريد:</strong> {viewingOrder.customerEmail}
                    </p>
                    <p>
                      <strong>العنوان:</strong> {viewingOrder.customerAddress}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">معلومات الطلب</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>رمز الطلب:</strong> {viewingOrder.orderCode}
                    </p>
                    <p>
                      <strong>حالة الدفع:</strong> {viewingOrder.paymentStatus}
                    </p>
                    <p>
                      <strong>تاريخ الطلب:</strong> {new Date(viewingOrder.createdAt).toLocaleDateString("ar-DZ")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteOrder && (
        <DeleteConfirmDialog
          title="حذف الطلب"
          message={`هل أنت متأكد من حذف الطلب "${deleteOrder.orderCode}"؟`}
          onConfirm={() => handleDeleteOrder(deleteOrder._id)}
          onCancel={() => setDeleteOrder(null)}
        />
      )}
    </div>
  )
}
