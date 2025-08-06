"use client"

import React, { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { useRouter, usePathname } from "next/navigation"
import Loading from '@/components/Loading'
import { ShoppingCart, Package, FolderOpen, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/constant/lang"

export default function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const lang = useLanguage()
  const t = translations[lang as "en" | "fr" | "ar"]

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/account")
        if (!response.ok) {
          router.push("/admin/login")
          return
        }
        setLoading(false)
      } catch (error) {
        router.push("/admin/login")
      }
    }
    fetchStats()
    checkAuth()
  }, [pathname, router])

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
    Processing: t.processing,
    "Payment Pending": t.paymentPending,
    Paid: t.paid,
    Confirmed: t.confirmed,
    Rejected: t.rejected,
    Delivered: t.delivered,
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (!response.ok) throw new Error(t.statsFetchError)
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) return <Loading />

  return (
    <div className="relative min-h-screen flex flex-col">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-90">
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
        <main className="p-4 pt-25 bg-white text-black min-h-screen">
          <div className="space-y-6 mb-10 max-w-7xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold">{t.dashboardTitle}</h1>
              <p className="text-gray-600">{t.welcomeMessage}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
                label: t.totalOrders,
                icon: <ShoppingCart className="h-4 w-4 text-gray-500" />,
                value: stats?.totalOrders || 0,
                note: t.allOrders,
              }, {
                label: t.totalProducts,
                icon: <Package className="h-4 w-4 text-gray-500" />,
                value: stats?.totalProducts || 0,
                note: t.availableProducts,
              }, {
                label: t.categories,
                icon: <FolderOpen className="h-4 w-4 text-gray-500" />,
                value: stats?.totalCategories || 0,
                note: t.activeCategories,
              }, {
                label: t.totalRevenue,
                icon: <DollarSign className="h-4 w-4 text-gray-500" />,
                value: `${stats?.totalRevenue?.toFixed(2) || "0.00"} €`,
                note: t.completedOrders,
              }].map((item, index) => (
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
              <div className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-1">{t.orderStatusDistribution}</h2>
                <p className="text-sm text-gray-500 mb-4">{t.ordersByStatus}</p>
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

              <div className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-1">{t.recentOrders}</h2>
                <p className="text-sm text-gray-500 mb-4">{t.last5Orders}</p>
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
                    <div className="text-center py-4 text-gray-500">{t.noOrders}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-1">{t.quickActions}</h2>
              <p className="text-sm text-gray-500 mb-4">{t.quickAccess}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{
                  href: "/admin/orders",
                  icon: <ShoppingCart className="h-6 w-6 mb-2" />,
                  label: t.manageOrders,
                }, {
                  href: "/admin/products",
                  icon: <Package className="h-6 w-6 mb-2" />,
                  label: t.manageProducts,
                }, {
                  href: "/admin/categories",
                  icon: <FolderOpen className="h-6 w-6 mb-2" />,
                  label: t.manageCategories,
                }, {
                  href: "/admin/account",
                  icon: <TrendingUp className="h-6 w-6 mb-2" />,
                  label: t.accountSettings,
                }].map((item, index) => (
                  <Link key={index} href={item.href} className="flex flex-col items-center justify-center border rounded-lg py-4 hover:bg-gray-100 text-sm font-medium">
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
