import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { TrackOrder } from "@/components/TrackOrder"
import { SidebarInset } from "@/components/ui/sidebar"

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6">
          <TrackOrder />
        </main>
      </SidebarInset>
    </div>
  )
}
