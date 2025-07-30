"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/app/providers"
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { ProductForm } from "./ProductForm"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  _id: string
  name: { ar: string; fr: string }
  description: { ar: string; fr: string }
  price: number
  images: string[]
  mainImage: string
  category: string
  categoryName: { ar: string; fr: string }
  isVisible: boolean
  createdAt: string
}

interface Category {
  _id: string
  name: { ar: string; fr: string }
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { language, t } = useLanguage()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([fetch("/api/admin/products"), fetch("/api/categories")])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.name.fr.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleToggleVisibility = async (productId: string, isVisible: boolean) => {
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVisible: !isVisible }),
      })

      setProducts(products.map((p) => (p._id === productId ? { ...p, isVisible: !isVisible } : p)))
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      setProducts(products.filter((p) => p._id !== productId))
      setDeleteProduct(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded animate-pulse w-32" />
          <div className="h-10 bg-muted rounded animate-pulse w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("products")}</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addProduct")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchProducts")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("filter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4 rounded overflow-hidden">
                  <Image
                    src={product.mainImage || "/placeholder.svg?height=200&width=200"}
                    alt={product.name[language]}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.isVisible ? "default" : "secondary"}>
                      {product.isVisible ? t("visible") : t("hidden")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2">{product.name[language]}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description[language]}</p>
                  <p className="font-bold text-primary">{product.price} دج</p>
                  <p className="text-xs text-muted-foreground">{product.categoryName?.[language]}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVisibility(product._id, product.isVisible)}
                  >
                    {product.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteProduct(product)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noProducts")}</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
          onSave={() => {
            fetchData()
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteProduct && (
        <DeleteConfirmDialog
          title="حذف المنتج"
          message={`هل أنت متأكد من حذف "${deleteProduct.name[language]}"؟`}
          onConfirm={() => handleDeleteProduct(deleteProduct._id)}
          onCancel={() => setDeleteProduct(null)}
        />
      )}
    </div>
  )
}
