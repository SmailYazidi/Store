import { CategoryProducts } from "@/components/CategoryProducts"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

interface CategoryPageProps {
  params: { id: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <CategoryProducts categoryId={params.id} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
