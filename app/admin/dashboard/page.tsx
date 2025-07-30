"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { SidebarInset } from "@/components/ui/sidebar"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("products")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <AdminHeader />
          <main className="flex-1 p-6">
            <AdminDashboard activeTab={activeTab} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
