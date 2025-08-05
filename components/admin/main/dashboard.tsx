"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Package, FolderOpen, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import Loading from '@/components/Loading';
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
     <Loading />
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
        {[
          { label: "إجمالي الطلبات", icon: <ShoppingCart className="h-4 w-4 text-gray-500" />, value: stats?.totalOrders || 0, note: "جميع الطلبات" },
          { label: "إجمالي المنتجات", icon: <Package className="h-4 w-4 text-gray-500" />, value: stats?.totalProducts || 0, note: "منتج متاح" },
          { label: "التصنيفات", icon: <FolderOpen className="h-4 w-4 text-gray-500" />, value: stats?.totalCategories || 0, note: "تصنيف نشط" },
          { label: "إجمالي الإيرادات", icon: <DollarSign className="h-4 w-4 text-gray-500" />, value: `${stats?.totalRevenue?.toFixed(2) || "0.00"} €`, note: "من الطلبات المكتملة" },
        ].map((item, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">{item.label}</span>
              {item.icon}
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-gray-500">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">توزيع حالات الطلبات</h2>
          <p className="text-sm text-gray-500 mb-4">عدد الطلبات حسب الحالة</p>
          <div className="space-y-3">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status] || "bg-gray-500"}`} />
                  <span className="text-sm">{statusLabels[status] || status}</span>
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">الطلبات الأخيرة</h2>
          <p className="text-sm text-gray-500 mb-4">آخر 5 طلبات</p>
          <div className="space-y-3">
            {stats?.recentOrders?.length ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{order.orderCode}</div>
                    <div className="text-xs text-gray-500">{order.customerName}</div>
                    <div className="text-xs text-gray-400">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-white text-xs px-2 py-1 rounded ${statusColors[order.status] || "bg-gray-500"}`}>
                      {statusLabels[order.status] || order.status}
                    </div>
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">الإجراءات السريعة</h2>
        <p className="text-sm text-gray-500 mb-4">الوصول السريع للوظائف الأساسية</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/admin/orders", icon: <ShoppingCart className="h-6 w-6 mb-2" />, label: "إدارة الطلبات" },
            { href: "/admin/products", icon: <Package className="h-6 w-6 mb-2" />, label: "إدارة المنتجات" },
            { href: "/admin/categories", icon: <FolderOpen className="h-6 w-6 mb-2" />, label: "إدارة التصنيفات" },
            { href: "/admin/account", icon: <TrendingUp className="h-6 w-6 mb-2" />, label: "إعدادات الحساب" },
          ].map((item, index) => (
            <Link key={index} href={item.href} className="flex flex-col items-center justify-center border rounded-lg py-4 hover:bg-gray-100 text-sm font-medium">
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
