import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { OrderForm } from "@/components/OrderForm"
import { SidebarInset } from "@/components/ui/sidebar"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6">
          <OrderForm productId={params.id} />
        </main>
      </SidebarInset>
    </div>
  )
}
