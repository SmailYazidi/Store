"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/providers"
import type { Category } from "@/lib/models"

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const { language, t } = useLanguage()

  useEffect(() => {
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

    fetchCategories()
  }, [])

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{t("categories")}</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link key={category._id} href={`/category/${category._id}`}>
            <Button variant="outline" size="sm">
              {category.name[language]}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
