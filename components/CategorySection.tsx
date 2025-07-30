"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/providers"

interface Category {
  _id: string
  name: { ar: string; fr: string }
}

interface CategorySectionProps {
  categories: Category[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  const { language, t } = useLanguage()

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
