import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminDashboardPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">
            <AdminDashboard />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
