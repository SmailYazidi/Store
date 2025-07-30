import { OrderForm } from "@/components/OrderForm"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <OrderForm productId={params.id} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
