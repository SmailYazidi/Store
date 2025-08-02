"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ShoppingCart, Tags, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalCategories: number
  ordersByStatus: Record<string, number>
  recentOrders: Array<{
    _id: string
    orderCode: string
    customerName: string
    productName: string
    status: string
    createdAt: string
    productPrice: number
    productCurrency: string
  }>
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
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/orders?limit=5"),
        fetch("/api/admin/products?limit=1"),
        fetch("/api/admin/categories"),
      ])

      if (!ordersRes.ok || !productsRes.ok || !categoriesRes.ok) {
        throw new Error("فشل في جلب البيانات")
      }

      const [ordersData, productsData, categoriesData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        categoriesRes.json(),
      ])

      // Calculate order statistics
      const ordersByStatus: Record<string, number> = {}
      const allOrdersRes = await fetch("/api/admin/orders?limit=1000")
      const allOrdersData = await allOrdersRes.json()

      allOrdersData.orders?.forEach((order: any) => {
        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
      })

      setStats({
        totalOrders: allOrdersData.pagination?.total || 0,
        totalProducts: productsData.pagination?.total || 0,
        totalCategories: categoriesData.categories?.length || 0,
        ordersByStatus,
        recentOrders: ordersData.orders || [],
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">خطأ: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في لوحة تحكم المسؤول</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التصنيفات</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات النشطة</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.ordersByStatus["Processing"] || 0) + (stats?.ordersByStatus["Payment Pending"] || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>توزيع حالات الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <Badge variant="secondary" className={`${statusColors[status]} text-white`}>
                  {statusLabels[status] || status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات الأخيرة</CardTitle>
          <CardDescription>آخر 5 طلبات تم إنشاؤها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{order.orderCode}</div>
                  <div className="text-sm text-gray-600">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.productName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {order.productPrice} {order.productCurrency}
                  </div>
                  <Badge variant="secondary" className={`${statusColors[order.status]} text-white`}>
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
