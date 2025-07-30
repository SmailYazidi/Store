import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ProductGrid } from "@/components/ProductGrid"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <ProductGrid />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
