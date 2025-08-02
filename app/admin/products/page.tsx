"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Search, Plus, Edit, Trash2, RefreshCw } from "lucide-react"

interface Product {
  _id: string
  name: {
    ar: string
    fr: string
  }
  description?: {
    ar: string
    fr: string
  }
  price: number
  currency: string
  mainImage: string
  images?: string[]
  categoryId: string
  category?: {
    _id: string
    name: {
      ar: string
      fr: string
    }
  }
  quantity: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  name: {
    ar: string
    fr: string
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: { ar: "", fr: "" },
    description: { ar: "", fr: "" },
    price: 0,
    currency: "EUR",
    mainImage: "",
    categoryId: "",
    quantity: 0,
    isVisible: true,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchTerm, categoryFilter])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter !== "all") params.append("categoryId", categoryFilter)

      const response = await fetch(`/api/admin/products?${params}`)
      if (!response.ok) throw new Error("فشل في جلب المنتجات")

      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (!response.ok) throw new Error("فشل في جلب التصنيفات")

      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingProduct ? "/api/admin/products" : "/api/admin/products"
      const method = editingProduct ? "PUT" : "POST"
      const body = editingProduct ? { productId: editingProduct._id, ...formData } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error("فشل في حفظ المنتج")

      await fetchProducts()
      setShowDialog(false)
      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("فشل في حذف المنتج")

      await fetchProducts()
      setDeleteProductId(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || { ar: "", fr: "" },
      price: product.price,
      currency: product.currency,
      mainImage: product.mainImage,
      categoryId: product.categoryId,
      quantity: product.quantity,
      isVisible: product.isVisible,
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: { ar: "", fr: "" },
      description: { ar: "", fr: "" },
      price: 0,
      currency: "EUR",
      mainImage: "",
      categoryId: "",
      quantity: 0,
      isVisible: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-gray-600">إدارة وتحرير المنتجات</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث باسم المنتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name.ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchProducts} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
          <CardDescription>{products.length} منتج</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد منتجات</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    {product.mainImage ? (
                      <img
                        src={product.mainImage || "/placeholder.svg"}
                        alt={product.name.ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">لا توجد صورة</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{product.name.ar}</h3>
                      <Badge variant={product.isVisible ? "default" : "secondary"}>
                        {product.isVisible ? "مرئي" : "مخفي"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{product.name.fr}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {product.price} {product.currency}
                      </span>
                      <span>الكمية: {product.quantity}</span>
                    </div>
                    {product.category && <p className="text-sm text-gray-500">التصنيف: {product.category.name.ar}</p>}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteProductId(product._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "تعديل بيانات المنتج" : "إضافة منتج جديد إلى المتجر"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name-ar">الاسم بالعربية</Label>
                <Input
                  id="name-ar"
                  value={formData.name.ar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: { ...prev.name, ar: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="name-fr">الاسم بالفرنسية</Label>
                <Input
                  id="name-fr"
                  value={formData.name.fr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: { ...prev.name, fr: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description-ar">الوصف بالعربية</Label>
                <Textarea
                  id="description-ar"
                  value={formData.description.ar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: { ...prev.description, ar: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="description-fr">الوصف بالفرنسية</Label>
                <Textarea
                  id="description-fr"
                  value={formData.description.fr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: { ...prev.description, fr: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">العملة</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      currency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="MAD">MAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">التصنيف</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mainImage">رابط الصورة الرئيسية</Label>
              <Input
                id="mainImage"
                value={formData.mainImage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mainImage: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={formData.isVisible}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVisible: checked,
                  }))
                }
              />
              <Label htmlFor="isVisible">المنتج مرئي</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : editingProduct ? (
                  "تحديث"
                ) : (
                  "إضافة"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && deleteProduct(deleteProductId)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
