"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/app/providers"
import { X, Upload, Trash2, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

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

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

export function ProductForm({ product, categories, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: { ar: "", fr: "" },
    description: { ar: "", fr: "" },
    price: 0,
    category: "",
    isVisible: true,
  })
  const [images, setImages] = useState<string[]>([])
  const [mainImage, setMainImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { language, t } = useLanguage()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        isVisible: product.isVisible,
      })
      setImages(product.images)
      setMainImage(product.mainImage)
    }
  }, [product])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)

      if (!mainImage && newImages.length > 0) {
        setMainImage(newImages[0])
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("فشل في رفع الصور")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      })

      const newImages = images.filter((img) => img !== imageUrl)
      setImages(newImages)

      if (mainImage === imageUrl) {
        setMainImage(newImages[0] || "")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const productData = {
        ...formData,
        images,
        mainImage,
      }

      const url = product ? `/api/admin/products/${product._id}` : "/api/admin/products"

      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        onSave()
      } else {
        alert("فشل في حفظ المنتج")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("فشل في حفظ المنتج")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {product ? t("edit") : t("add")} {t("products")}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Names */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name-ar">{t("productName")} (العربية)</Label>
                <Input
                  id="name-ar"
                  value={formData.name.ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: { ...formData.name, ar: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name-fr">{t("productName")} (Français)</Label>
                <Input
                  id="name-fr"
                  value={formData.name.fr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: { ...formData.name, fr: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desc-ar">{t("description")} (العربية)</Label>
                <Textarea
                  id="desc-ar"
                  value={formData.description.ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, ar: e.target.value },
                    })
                  }
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc-fr">{t("description")} (Français)</Label>
                <Textarea
                  id="desc-fr"
                  value={formData.description.fr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, fr: e.target.value },
                    })
                  }
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Price and Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t("price")} (دج)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t("category")}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label>{t("images")}</Label>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload">
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? t("loading") : t("uploadImages")}
                    </span>
                  </Button>
                </Label>
              </div>

              {/* Images Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded overflow-hidden border">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {mainImage === image && (
                          <div className="absolute top-2 left-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveImage(image)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      {mainImage !== image && (
                        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => setMainImage(image)}
                          >
                            {t("selectMainImage")}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
              />
              <Label htmlFor="visible">{formData.isVisible ? t("visible") : t("hidden")}</Label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving || images.length === 0}>
                {saving ? t("loading") : t("save")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
