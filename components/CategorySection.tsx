"use client"

import { useState, useRef } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./ProductCard"
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

interface CategorySectionProps {
  category: Category
  products: Product[]
  language: "ar" | "fr"
}

export function CategorySection({ category, products, language }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 300
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount)

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const displayProducts = products.slice(0, 6)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{category.name[language]}</h2>
        {products.length > 6 && (
          <Link href={`/category/${category._id}`}>
            <Button variant="outline" size="sm">
              عرض الكل
              <ChevronRight className="h-4 w-4 mr-2" />
            </Button>
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-6 gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} language={language} />
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {displayProducts.map((product, index) => (
              <div
                key={product._id}
                className={`flex-shrink-0 ${index === displayProducts.length - 1 ? "w-32" : "w-44"}`}
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductCard product={product} language={language} />
              </div>
            ))}
          </div>

          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
