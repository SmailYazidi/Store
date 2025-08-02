"use client"

import { useEffect, useState } from "react"
import CategorySection from "./main/CategorySection"
import { Category, Product } from "@/lib/models"
import { toast } from "sonner"

const ClientMain = () => {
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
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء جلب البيانات")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="p-4 bg-white text-black min-h-screen text-center">
        <p>جارٍ تحميل المنتجات...</p>
      </main>
    )
  }

  return (
    <main className="p-4 bg-white text-black min-h-screen">
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
  )
}

export default ClientMain
