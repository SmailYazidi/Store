import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { OrderSuccess } from "@/components/OrderSuccess"
import { SidebarInset } from "@/components/ui/sidebar"

interface OrderSuccessPageProps {
  params: {
    orderId: string
  }
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6">
          <OrderSuccess orderId={params.orderId} />
        </main>
      </SidebarInset>
    </div>
  )
}
