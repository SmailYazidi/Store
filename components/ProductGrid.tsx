"use client"

import { ProductCard } from "./ProductCard"
import { useLanguage } from "@/app/providers"

interface Product {
  _id: string
  name: { ar: string; fr: string }
  price: number
  description: { ar: string; fr: string }
  mainImage: string
  images: string[]
  category: string
  inStock: boolean
  isVisible: boolean
}

interface ProductGridProps {
  products: Product[]
  loading: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noProducts")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products
        .filter((product) => product.isVisible)
        .map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
    </div>
  )
}
