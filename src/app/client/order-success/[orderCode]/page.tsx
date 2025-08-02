"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OrderSuccessPageProps {
  params: { orderCode: string }
}

interface Order {
  customerName: string
  productName: string
  productPrice: number
  productCurrency: string
  status: string
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/client/orders/${params.orderCode}`)
        if (!res.ok) throw new Error("لم يتم العثور على الطلب")
        const data = await res.json()
        setOrder(data)
      } catch (err: any) {
        toast.error(err.message || "حدث خطأ أثناء جلب الطلب")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderCode, router])

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p>جاري تحميل تفاصيل الطلب...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p>لم يتم العثور على تفاصيل الطلب.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">تم الدفع بنجاح 🎉</h1>
      <p className="mb-2">شكرًا لك يا {order.customerName}!</p>
      <p className="mb-2">تم تأكيد طلبك بنجاح.</p>
      <div className="border rounded p-4 mt-4 text-left bg-gray-50">
        <p><strong>المنتج:</strong> {order.productName}</p>
        <p><strong>السعر:</strong> {order.productPrice} {order.productCurrency}</p>
        <p><strong>الحالة:</strong> {order.status}</p>
      </div>
    </div>
  )
}
