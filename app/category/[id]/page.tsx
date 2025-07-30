import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { CategoryProducts } from "@/components/CategoryProducts"
import { SidebarInset } from "@/components/ui/sidebar"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-6">
          <CategoryProducts categoryId={params.id} />
        </main>
      </SidebarInset>
    </div>
  )
}
