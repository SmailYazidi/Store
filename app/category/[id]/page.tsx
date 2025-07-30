import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { CategoryProducts } from "@/components/CategoryProducts"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <CategoryProducts categoryId={params.id} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
