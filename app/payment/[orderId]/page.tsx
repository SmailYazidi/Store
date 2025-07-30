import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { PaymentPage } from "@/components/PaymentPage"
import { SidebarInset } from "@/components/ui/sidebar"

interface PaymentPageProps {
  params: {
    orderId: string
  }
}

export default function Payment({ params }: PaymentPageProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6">
          <PaymentPage orderId={params.orderId} />
        </main>
      </SidebarInset>
    </div>
  )
}
