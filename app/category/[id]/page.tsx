"use client"
import { useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { CategoryProducts } from "@/components/CategoryProducts"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <CategoryProducts categoryId={categoryId} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
