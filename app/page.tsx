import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { ProductGrid } from "@/components/ProductGrid"
import { CategorySection } from "@/components/CategorySection"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-8">
              <CategorySection />
              <ProductGrid />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
