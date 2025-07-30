import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { TrackOrder } from "@/components/TrackOrder"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function TrackOrderPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <TrackOrder />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
