"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Search, Eye, Trash2, RefreshCw } from "lucide-react"

interface Order {
  _id: string
  orderCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  productName: string
  productPrice: number
  productCurrency: string
  quantity: number
  status: string
  createdAt: string
  updatedAt: string
  paymentIntentId?: string
}

const statusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "Processing", label: "قيد المعالجة" },
  { value: "Payment Pending", label: "في انتظار الدفع" },
  { value: "Paid", label: "مدفوع" },
  { value: "Confirmed", label: "مؤكد" },
  { value: "Rejected", label: "مرفوض" },
  { value: "Delivered", label: "تم التسليم" },
]

const statusColors: Record<string, string> = {
  Processing: "bg-blue-500",
  "Payment Pending": "bg-yellow-500",
  Paid: "bg-green-500",
  Confirmed: "bg-emerald-500",
  Rejected: "bg-red-500",
  Delivered: "bg-purple-500",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/orders?${params}`)
      if (!response.ok) throw new Error("فشل في جلب الطلبات")

      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (!response.ok) throw new Error("فشل في تحديث الطلب")

      await fetchOrders()
    } catch (error) {
      console.error("Error updating order:", error)
    } finally {
      setUpdating(null)
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("فشل في حذف الطلب")

      await fetchOrders()
      setDeleteOrderId(null)
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
        <p className="text-gray-600">إدارة وتتبع جميع الطلبات</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث بكود الطلب، اسم العميل، البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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
            <Button onClick={fetchOrders} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
          <CardDescription>{orders.length} طلب</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد طلبات</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{order.orderCode}</span>
                        <Badge variant="secondary" className={`${statusColors[order.status]} text-white`}>
                          {statusOptions.find((s) => s.value === order.status)?.label || order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>العميل: {order.customerName}</div>
                        <div>المنتج: {order.productName}</div>
                        <div>
                          السعر: {order.productPrice} {order.productCurrency}
                        </div>
                        <div>التاريخ: {formatDate(order.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order._id, value)}
                        disabled={updating === order._id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.slice(1).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteOrderId(order._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <DialogDescription>كود الطلب: {selectedOrder?.orderCode}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">معلومات العميل</h4>
                  <div className="space-y-1 text-sm">
                    <div>الاسم: {selectedOrder.customerName}</div>
                    <div>البريد: {selectedOrder.customerEmail}</div>
                    <div>الهاتف: {selectedOrder.customerPhone}</div>
                    <div>العنوان: {selectedOrder.customerAddress}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">معلومات المنتج</h4>
                  <div className="space-y-1 text-sm">
                    <div>المنتج: {selectedOrder.productName}</div>
                    <div>
                      السعر: {selectedOrder.productPrice} {selectedOrder.productCurrency}
                    </div>
                    <div>الكمية: {selectedOrder.quantity}</div>
                    <div>
                      الإجمالي: {selectedOrder.productPrice * selectedOrder.quantity} {selectedOrder.productCurrency}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">معلومات الطلب</h4>
                <div className="space-y-1 text-sm">
                  <div>الحالة: {statusOptions.find((s) => s.value === selectedOrder.status)?.label}</div>
                  <div>تاريخ الإنشاء: {formatDate(selectedOrder.createdAt)}</div>
                  <div>آخر تحديث: {formatDate(selectedOrder.updatedAt)}</div>
                  {selectedOrder.paymentIntentId && <div>معرف الدفع: {selectedOrder.paymentIntentId}</div>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrderId && deleteOrder(deleteOrderId)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
