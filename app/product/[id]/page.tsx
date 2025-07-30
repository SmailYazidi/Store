import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { ProductDetails } from "@/components/ProductDetails"
import { SidebarInset } from "@/components/ui/sidebar"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6">
          <ProductDetails productId={params.id} />
        </main>
      </SidebarInset>
    </div>
  )
}
