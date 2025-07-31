import { OrderSuccess } from "@/components/OrderSuccess"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"


interface OrderSuccessPageProps {
  params: { orderId: string }
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  return (

      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <OrderSuccess orderId={params.orderId} />
          </main>
        </div>
      </div>

  )
}
