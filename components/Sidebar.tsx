"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useLanguage } from "@/app/providers"
import type { Category } from "@/lib/models"

export function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 10000])
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden fixed top-20 left-4 z-40 bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="h-4 w-4 mr-2" />
        {t("filterBy")}
      </Button>

      {/* Sidebar */}
      <aside
        className={`
        fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-80 bg-background border-r
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        overflow-y-auto
      `}
      >
        <div className="p-6 space-y-6">
          {/* Mobile Close Button */}
          <div className="md:hidden flex justify-between items-center">
            <h2 className="text-lg font-semibold">{t("filterBy")}</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">{t("categories")}</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category._id}
                    checked={selectedCategories.includes(category._id!)}
                    onCheckedChange={(checked) => handleCategoryChange(category._id!, checked as boolean)}
                  />
                  <label
                    htmlFor={category._id}
                    className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">{t("price")}</h3>
            <div className="space-y-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]} دج</span>
                <span>{priceRange[1]} دج</span>
              </div>
            </div>
          </div>

          {/* Stock Status Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">حالة المخزون</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <label
                  htmlFor="in-stock"
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                >
                  {t("inStock")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" />
                <label
                  htmlFor="out-of-stock"
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                >
                  {t("outOfStock")}
                </label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
            {t("clearFilters")}
          </Button>

          {/* Quick Links */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-sm font-medium text-foreground">روابط سريعة</h3>
            <div className="space-y-2">
              <Link
                href="/products?featured=true"
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{t("featured")}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?new=true"
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{t("newArrivals")}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?bestseller=true"
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{t("bestSellers")}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?sale=true"
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{t("onSale")}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setIsOpen(false)} />}
    </>
  )
}
