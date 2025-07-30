"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "./AdminHeader"
import { AdminSidebar } from "./AdminSidebar"
import { ProductsManager } from "./ProductsManager"
import { OrdersManager } from "./OrdersManager"
import { CategoriesManager } from "./CategoriesManager"
import { SidebarProvider } from "@/components/ui/sidebar"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products")
  const router = useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    }
  }, [router])

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-4 md:p-6">
            {activeTab === "products" && <ProductsManager />}
            {activeTab === "categories" && <CategoriesManager />}
            {activeTab === "orders" && <OrdersManager />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
