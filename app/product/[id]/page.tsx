import { ProductDetails } from "@/components/ProductDetails"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"


interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (

      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <ProductDetails productId={params.id} />
          </main>
        </div>
      </div>

  )
}
