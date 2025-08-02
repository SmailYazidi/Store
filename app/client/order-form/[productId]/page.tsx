"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

interface Product {
  _id: string
  name: {
    ar: string
    en: string
  }
  price: number
  currency: string
  mainImage: string
  quantity: number
  isVisible: boolean
}

export default function OrderFormPage() {
  const router = useRouter()
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/client/products/${productId}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || "فشل تحميل المنتج")

        if (!data.isVisible || data.quantity < 1) {
          throw new Error("المنتج غير متوفر")
        }

        setProduct(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("حدث خطأ غير معروف")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/client/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productId,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "فشل إنشاء الطلب")

      router.push(`/client/verify/${data.orderCode}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert("حدث خطأ غير معروف")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-center">جاري التحميل...</p>
  if (error) return <p className="text-center text-red-600">{error}</p>
  if (!product) return null

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">طلب منتج: {product.name.ar}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="الاسم الكامل"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="رقم الهاتف"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          placeholder="العنوان الكامل"
          required
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? "جارٍ إرسال الطلب..." : "متابعة"}
        </button>
      </form>
    </div>
  )
}
