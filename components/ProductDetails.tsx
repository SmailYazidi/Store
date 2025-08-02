"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/providers"
import { MessageCircle, ShoppingCart } from "lucide-react"
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

interface ProductDetailsProps {
  productId: string
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState("")
  const [loading, setLoading] = useState(true)
  const { language, t } = useLanguage()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()
      setProduct(data)
      setSelectedImage(data.mainImage)
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppOrder = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "213123456789"
    const message = `مرحبا، أريد طلب هذا المنتج: ${product?.name[language]} - السعر: ${product?.price} دج`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse w-24" />
            <div className="flex gap-4">
              <div className="h-12 bg-muted rounded animate-pulse flex-1" />
              <div className="h-12 bg-muted rounded animate-pulse flex-1" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">المنتج غير موجود</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={selectedImage || "/placeholder.svg?height=500&width=500"}
              alt={product.name[language]}
              fill
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square relative overflow-hidden rounded border-2 transition-colors ${
                    selectedImage === image ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${product.name[language]} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name[language]}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">{product.description[language]}</p>
          </div>

          <div className="text-3xl font-bold text-primary">{product.price} دج</div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleWhatsAppOrder} className="flex-1 bg-green-600 hover:bg-green-700" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t("orderWhatsApp")}
            </Button>

            <Link href={`/order/${product._id}`} className="flex-1">
              <Button className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t("orderOnline")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
