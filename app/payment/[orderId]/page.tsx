import { PaymentPage } from "@/components/PaymentPage"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"


interface PaymentPageProps {
  params: { orderId: string }
}

export default function Payment({ params }: PaymentPageProps) {
  return (

      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <PaymentPage orderId={params.orderId} />
          </main>
        </div>
      </div>

  )
}
