"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/providers"
import type { Product } from "@/lib/models"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?page=${pageNum}&limit=12`)
      if (response.ok) {
        const data = await response.json()
        if (pageNum === 1) {
          setProducts(data.products)
        } else {
          setProducts((prev) => [...prev, ...data.products])
        }
        setHasMore(data.hasMore)
        setPage(pageNum)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(page + 1)
    }
  }

  if (loading && products.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">{t("products")}</h2>
        <div className="grid-responsive">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-square rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("products")}</h2>
      </div>

      <div className="grid-responsive">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={loading} variant="outline" className="min-w-32 bg-transparent">
            {loading ? t("loading") : "عرض المزيد"}
          </Button>
        </div>
      )}

      {!hasMore && products.length > 0 && <p className="text-center text-muted-foreground">تم عرض جميع المنتجات</p>}
    </section>
  )
}
