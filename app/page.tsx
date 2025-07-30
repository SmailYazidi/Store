"use client"

import { Suspense } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { ProductGrid } from "@/components/ProductGrid"
import { CategorySection } from "@/components/CategorySection"
import { Skeleton } from "@/components/ui/skeleton"

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6 space-y-8">
            {/* Hero Section */}
            <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h1 className="text-4xl font-bold text-foreground mb-4">مرحباً بك في متجرنا الإلكتروني</h1>
              <p className="text-lg text-muted-foreground mb-6">اكتشف أفضل المنتجات بأسعار مميزة</p>
              <div className="flex justify-center gap-4">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  تسوق الآن
                </button>
                <button className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors">
                  تصفح الفئات
                </button>
              </div>
            </section>

            {/* Categories Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">الفئات</h2>
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection />
              </Suspense>
            </section>

            {/* Featured Products Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">المنتجات المميزة</h2>
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid />
              </Suspense>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
