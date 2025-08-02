import { OrderForm } from "@/components/OrderForm"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

interface OrderPageProps {
  params: { id: string }
}

export default function OrderPage({ params }: OrderPageProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <OrderForm productId={params.id} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
