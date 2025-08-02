'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function VerifyPage({ params }: { params: { orderCode: string } }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/client/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: params.orderCode, code }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'فشل التحقق')

      toast.success('تم التحقق بنجاح')
      router.push(`/client/payment/${params.orderCode}`)
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">التحقق من الطلب</h2>
      <p className="mb-4 text-sm text-gray-600 text-center">أدخل الكود الذي تم إرساله إلى بريدك الإلكتروني</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
        placeholder="أدخل الكود هنا"
      />
      <button
        onClick={handleVerify}
        disabled={loading || !code}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'جارٍ التحقق...' : 'تحقق'}
      </button>
    </div>
  )
}
