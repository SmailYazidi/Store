import { TrackOrder } from "@/components/TrackOrder"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"


export default function TrackOrderPage() {
  return (
  
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <TrackOrder />
          </main>
        </div>
      </div>
   
  )
}
