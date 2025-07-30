"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { TrackOrder } from "@/components/TrackOrder"

export default function TrackOrderPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <TrackOrder />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
