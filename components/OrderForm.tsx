"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import type { Product } from "@/lib/models"

interface OrderFormProps {
  productId: string
}

export function OrderForm({ productId }: OrderFormProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
  })
  const { language, t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId: product._id,
          productName: product.name[language],
          productPrice: product.price,
          productImage: product.mainImage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/order-success/${data._id}`)
      }
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-gray-200 h-8 rounded w-48"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-10 rounded"></div>
            <div className="bg-gray-200 h-10 rounded"></div>
            <div className="bg-gray-200 h-10 rounded"></div>
            <div className="bg-gray-200 h-20 rounded"></div>
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t("orderNow")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={product.mainImage || "/placeholder.svg?height=80&width=80"}
                  alt={product.name[language]}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-semibold">{product.name[language]}</h3>
                <p className="text-2xl font-bold text-primary">{product.price} DH</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("orderInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("name")}</label>
                <Input
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t("phone")}</label>
                <Input
                  required
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t("email")}</label>
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t("address")}</label>
                <Textarea
                  required
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t("loading") : t("continue")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
