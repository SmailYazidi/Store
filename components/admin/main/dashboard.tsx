"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, FolderOpen, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalCategories: number
  totalRevenue: number
  ordersByStatus: Record<string, number>
  recentOrders: any[]
}

const statusColors: Record<string, string> = {
  Processing: "bg-blue-500",
  "Payment Pending": "bg-yellow-500",
  Paid: "bg-green-500",
  Confirmed: "bg-emerald-500",
  Rejected: "bg-red-500",
  Delivered: "bg-purple-500",
}

const statusLabels: Record<string, string> = {
  Processing: "قيد المعالجة",
  "Payment Pending": "في انتظار الدفع",
  Paid: "مدفوع",
  Confirmed: "مؤكد",
  Rejected: "مرفوض",
  Delivered: "تم التسليم",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (!response.ok) throw new Error("فشل في جلب الإحصائيات")

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في لوحة تحكم المسؤول</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">منتج متاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التصنيفات</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
            <p className="text-xs text-muted-foreground">تصنيف نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRevenue?.toFixed(2) || "0.00"} €</div>
            <p className="text-xs text-muted-foreground">من الطلبات المكتملة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالات الطلبات</CardTitle>
            <CardDescription>عدد الطلبات حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status] || "bg-gray-500"}`} />
                    <span className="text-sm">{statusLabels[status] || status}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات الأخيرة</CardTitle>
            <CardDescription>آخر 5 طلبات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentOrders?.length ? (
                stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{order.orderCode}</div>
                      <div className="text-xs text-gray-500">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{formatDate(order.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className={`${statusColors[order.status] || "bg-gray-500"} text-white`}
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                      <div className="text-sm font-medium mt-1">
                        {order.productPrice} {order.productCurrency}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">لا توجد طلبات</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
          <CardDescription>الوصول السريع للوظائف الأساسية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/orders">
                <ShoppingCart className="h-6 w-6 mb-2" />
                إدارة الطلبات
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/products">
                <Package className="h-6 w-6 mb-2" />
                إدارة المنتجات
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/categories">
                <FolderOpen className="h-6 w-6 mb-2" />
                إدارة التصنيفات
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/account">
                <TrendingUp className="h-6 w-6 mb-2" />
                إعدادات الحساب
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}