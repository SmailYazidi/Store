"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Loader2, Plus, Edit, Trash2, RefreshCw } from "lucide-react"

interface Category {
  _id: string
  name: {
    ar: string
    fr: string
  }
  productCount: number
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: { ar: "", fr: "" },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/categories")
      if (!response.ok) throw new Error("فشل في جلب التصنيفات")

      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = "/api/admin/categories"
      const method = editingCategory ? "PUT" : "POST"
      const body = editingCategory ? { categoryId: editingCategory._id, ...formData } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في حفظ التصنيف")
      }

      await fetchCategories()
      setShowDialog(false)
      resetForm()
    } catch (error: any) {
      console.error("Error saving category:", error)
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في حذف التصنيف")
      }

      await fetchCategories()
      setDeleteCategoryId(null)
    } catch (error: any) {
      console.error("Error deleting category:", error)
      alert(error.message)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({
      name: { ar: "", fr: "" },
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة التصنيفات</h1>
          <p className="text-gray-600">إدارة وتحرير تصنيفات المنتجات</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة تصنيف
        </Button>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>قائمة التصنيفات</CardTitle>
              <CardDescription>{categories.length} تصنيف</CardDescription>
            </div>
            <Button onClick={fetchCategories} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد تصنيفات</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category._id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-lg">{category.name.ar}</h3>
                      <p className="text-sm text-gray-600">{category.name.fr}</p>
                    </div>

                    <div className="text-sm text-gray-500">
                      <div>عدد المنتجات: {category.productCount}</div>
                      <div>تاريخ الإنشاء: {formatDate(category.createdAt)}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteCategoryId(category._id)}
                        disabled={category.productCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {category.productCount > 0 && (
                      <p className="text-xs text-amber-600">لا يمكن حذف التصنيف لأنه يحتوي على منتجات</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "تعديل بيانات التصنيف" : "إضافة تصنيف جديد للمنتجات"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="أدخل اسم التصنيف بالعربية"
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
                placeholder="أدخل اسم التصنيف بالفرنسية"
              />
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
                ) : editingCategory ? (
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
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategoryId && deleteCategory(deleteCategoryId)}
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
