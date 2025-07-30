"use client"

import { useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { OrderForm } from "@/components/OrderForm"

export default function OrderPage() {
  const params = useParams()
  const productId = params.id as string

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <OrderForm productId={productId} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
