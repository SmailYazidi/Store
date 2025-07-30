"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/providers"

interface Product {
  _id: string
  name: { ar: string; fr: string }
  price: number
  description: { ar: string; fr: string }
  mainImage: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage()

  const handleWhatsAppOrder = () => {
    const message = `${t("orderNow")}: ${product.name[language]} - ${product.price} DH`
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product._id}`}>
        <div className="aspect-square relative">
          <Image
            src={product.mainImage || "/placeholder.svg?height=300&width=300"}
            alt={product.name[language]}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary">{product.name[language]}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description[language]}</p>
        <p className="text-2xl font-bold text-primary">{product.price} DH</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 space-y-2">
        <Link href={`/order/${product._id}`} className="w-full">
          <Button className="w-full">{t("orderOnline")}</Button>
        </Link>
        <Button variant="outline" className="w-full bg-transparent" onClick={handleWhatsAppOrder}>
          {t("orderWhatsApp")}
        </Button>
      </CardFooter>
    </Card>
  )
}
