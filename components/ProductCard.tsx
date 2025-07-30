"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useLanguage } from "@/app/providers"
import type { Product } from "@/lib/models"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // Add to cart logic here
    console.log("Added to cart:", product._id)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    // Toggle favorite logic here
    console.log("Toggle favorite:", product._id)
  }

  const handleWhatsAppOrder = () => {
    const message = `${t("orderNow")}: ${product.name} - ${formatPrice(product.price)} DH`
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Link href={`/product/${product._id}`}>
      <Card className="card-hover group">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />

            {product.featured && <Badge className="absolute top-2 left-2 bg-primary">{t("featured")}</Badge>}

            {product.originalPrice && product.originalPrice > product.price && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% خصم
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
              onClick={handleToggleFavorite}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-medium line-clamp-2 text-sm">{product.name}</h3>

            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? t("inStock") : t("outOfStock")}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs text-orange-600">متبقي {product.stock} قطع</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock > 0 ? t("addToCart") : t("outOfStock")}
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={handleWhatsAppOrder}>
            {t("orderWhatsApp")}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
