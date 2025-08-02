import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ProductGrid } from "@/components/ProductGrid"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <ProductGrid />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
