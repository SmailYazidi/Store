import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ProductDetails } from "@/components/ProductDetails"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <ProductDetails productId={params.id} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
