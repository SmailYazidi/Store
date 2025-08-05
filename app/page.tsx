"use client"

import React, { useState,useEffect } from "react"
import ClientSidebar from "@/components/client/sidebar"
import ClientHeader from "@/components/client/header"
import CategorySection from "@/components/client/main/CategorySection"
import { Category, Product } from "@/lib/models"
import { toast } from "sonner"
import Loading from '@/components/Loading';


export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)


 useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/client/categories"),
          fetch("/api/client/products"),
        ])

        if (!catRes.ok || !prodRes.ok) throw new Error("فشل في جلب البيانات")

        const [catData, prodData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
        ])

        setCategories(catData)
        setProducts(prodData)
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("حدث خطأ أثناء جلب البيانات")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
  <Loading />
    )}




  return (
    <div className="relative min-h-screen flex flex-col">

      {isSidebarOpen && (
        <div className="fixed inset-0 z-90">
          {isSidebarOpen && <ClientSidebar onClose={() => setIsSidebarOpen(false)} />}

   <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}


      <div className="flex-1 flex flex-col">
        <ClientHeader onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
          <main className="p-4 pt-25 bg-white text-black min-h-screen">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.categoryId === category._id && product.isVisible
        )

        if (!category || !category.name || categoryProducts.length === 0) return null

        return (
          <CategorySection
            key={category._id}
            category={category}
            products={categoryProducts.slice(0, 6)}
          />
        )
      })}
    </main>
      </div>
    </div>
  )
}
