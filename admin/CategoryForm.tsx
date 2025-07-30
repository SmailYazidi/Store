"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { X } from "lucide-react"

interface Category {
  _id: string
  name: { ar: string; fr: string }
}

interface CategoryFormProps {
  category?: Category | null
  onClose: () => void
  onSave: () => void
}

export function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: { ar: "", fr: "" },
  })
  const [saving, setSaving] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = category ? `/api/admin/categories/${category._id}` : "/api/categories"
      const method = category ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
      } else {
        alert("فشل في حفظ الفئة")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      alert("فشل في حفظ الفئة")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{category ? t("edit") : t("add")} الفئة</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-ar">{t("categoryName")} (العربية)</Label>
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
                placeholder="أدخل اسم الفئة بالعربية"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name-fr">{t("categoryName")} (Français)</Label>
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
                placeholder="Entrez le nom de la catégorie en français"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? t("loading") : t("save")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                {t("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
