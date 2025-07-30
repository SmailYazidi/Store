"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import type { Product } from "@/lib/models"

interface ProductDetailsProps {
  productId: string
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState("")
  const { language, t } = useLanguage()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          setSelectedImage(data.mainImage)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-8 rounded"></div>
            <div className="bg-gray-200 h-4 rounded"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            <div className="bg-gray-200 h-10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("error")}</p>
      </div>
    )
  }

  const handleWhatsAppOrder = () => {
    const message = `${t("orderNow")}: ${product.name[language]} - ${product.price} DH`
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="aspect-square relative">
          <Image
            src={selectedImage || "/placeholder.svg?height=500&width=500"}
            alt={product.name[language]}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                  selectedImage === image ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name[language]} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name[language]}</h1>
          <p className="text-3xl font-bold text-primary">{product.price} DH</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{t("description")}</h3>
            <p className="text-muted-foreground">{product.description[language]}</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Link href={`/order/${product._id}`}>
            <Button size="lg" className="w-full">
              {t("orderOnline")}
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={handleWhatsAppOrder}>
            {t("orderWhatsApp")}
          </Button>
        </div>
      </div>
    </div>
  )
}
