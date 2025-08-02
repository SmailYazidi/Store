"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { useLanguage } from "@/app/providers"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

interface CategoryProductsProps {
  categoryId: string
}

export function CategoryProducts({ categoryId }: CategoryProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { language, t } = useLanguage()

  const PRODUCTS_PER_PAGE = 12

  useEffect(() => {
    fetchInitialData()
  }, [categoryId])

  const fetchInitialData = async () => {
    try {
      const [productsRes, categoryRes] = await Promise.all([
        fetch(`/api/categories/${categoryId}/products?page=1&limit=${PRODUCTS_PER_PAGE}`),
        fetch(`/api/categories/${categoryId}`),
      ])

      const productsData = await productsRes.json()
      const categoryData = await categoryRes.json()

      setProducts(productsData.products)
      setCategory(categoryData)
      setHasMore(productsData.hasMore)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}/products?page=${page + 1}&limit=${PRODUCTS_PER_PAGE}`)
      const data = await response.json()

      setProducts((prev) => [...prev, ...data.products])
      setPage((prev) => prev + 1)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Error loading more products:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{category?.name[language] || t("products")}</h1>
        <span className="text-muted-foreground">
          ({products.length} {t("products")})
        </span>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} language={language} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={loadingMore} variant="outline" size="lg">
                {loadingMore ? t("loading") : t("loadMore")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noProducts")}</p>
        </div>
      )}
    </div>
  )
}
