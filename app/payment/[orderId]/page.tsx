"use client"

import { useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { PaymentPage } from "@/components/PaymentPage"

export default function PaymentPageRoute() {
  const params = useParams()
  const orderId = params.orderId as string

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <PaymentPage orderId={orderId} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
