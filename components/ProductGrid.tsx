"use client"

import { useState, useEffect } from "react"
import { CategorySection } from "./CategorySection"
import { useLanguage } from "@/app/providers"

interface Product {
  _id: string
  name: { ar: string; fr: string }
  description: { ar: string; fr: string }
  price: number
  images: string[]
  mainImage: string
  category: string
  isVisible: boolean
}

interface Category {
  _id: string
  name: { ar: string; fr: string }
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData.filter((p: Product) => p.isVisible))
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="aspect-square bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryProducts = products.filter((p) => p.category === category._id)
        if (categoryProducts.length === 0) return null

        return (
          <CategorySection key={category._id} category={category} products={categoryProducts} language={language} />
        )
      })}
    </div>
  )
}
