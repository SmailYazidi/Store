"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import { useLanguage } from "@/app/providers"
import type { Product, Category } from "@/lib/models"

interface CategoryProductsProps {
  categoryId: string
}

export function CategoryProducts({ categoryId }: CategoryProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const { language, t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoryResponse] = await Promise.all([
          fetch(`/api/categories/${categoryId}/products`),
          fetch(`/api/categories/${categoryId}`),
        ])

        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData.filter((product: Product) => product.isVisible))
        }

        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          setCategory(categoryData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 h-8 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {category && <h1 className="text-3xl font-bold">{category.name[language]}</h1>}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noProducts")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
