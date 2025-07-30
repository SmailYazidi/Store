"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { CategoryForm } from "./CategoryForm"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

interface Category {
  _id: string
  name: { ar: string; fr: string }
  createdAt: string
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const { language, t } = useLanguage()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchTerm])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCategories = () => {
    let filtered = categories

    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.name.fr.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCategories(filtered)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      })

      setCategories(categories.filter((c) => c._id !== categoryId))
      setDeleteCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
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
        <h1 className="text-2xl font-bold">الفئات</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addCategory")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="البحث في الفئات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category._id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">العربية: {category.name.ar}</p>
                  <p className="text-sm text-muted-foreground">Français: {category.name.fr}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString("ar-DZ")}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteCategory(category)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد فئات</p>
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowForm(false)
            setEditingCategory(null)
          }}
          onSave={() => {
            fetchCategories()
            setShowForm(false)
            setEditingCategory(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteCategory && (
        <DeleteConfirmDialog
          title="حذف الفئة"
          message={`هل أنت متأكد من حذف "${deleteCategory.name[language]}"؟`}
          onConfirm={() => handleDeleteCategory(deleteCategory._id)}
          onCancel={() => setDeleteCategory(null)}
        />
      )}
    </div>
  )
}
