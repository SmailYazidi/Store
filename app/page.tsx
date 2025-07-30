"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/Sidebar"
import { ProductGrid } from "@/components/ProductGrid"
import { CategorySection } from "@/components/CategorySection"

interface Product {
  _id: string
  name: { ar: string; fr: string }
  price: number
  description: { ar: string; fr: string }
  image: string
  category: string
  inStock: boolean
}

interface Category {
  _id: string
  name: { ar: string; fr: string }
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6">
            <div className="space-y-8">
              <CategorySection categories={categories} />
              <ProductGrid products={products} loading={loading} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
