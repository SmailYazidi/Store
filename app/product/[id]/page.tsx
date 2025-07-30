"use client"

import { useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { ProductDetails } from "@/components/ProductDetails"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <ProductDetails productId={productId} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
