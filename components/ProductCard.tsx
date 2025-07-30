"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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

interface ProductCardProps {
  product: Product
  language: "ar" | "fr"
}

export function ProductCard({ product, language }: ProductCardProps) {
  return (
    <Link href={`/product/${product._id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={product.mainImage || "/placeholder.svg?height=200&width=200"}
              alt={product.name[language]}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2">{product.name[language]}</h3>
            <p className="text-muted-foreground text-xs line-clamp-2">{product.description[language]}</p>
            <p className="font-bold text-primary">{product.price} دج</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
