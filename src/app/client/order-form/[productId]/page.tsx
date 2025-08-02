// /home/smail/store/src/app/client/order-form/[productId]/page.tsx

import { OrderStatus, Product } from '@/lib/models'
import clientPromise from '@/lib/mongodb'
import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    productId: string
  }
}

export default async function OrderFormPage({ params }: Props) {
  const { productId } = params

  const client = await clientPromise
  const db = client.db()

  const product = await db.collection<Product>('products').findOne({ _id: productId })

  if (!product || !product.isVisible || product.quantity < 1) {
    return notFound()
  }

  async function handleSubmit(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string

    if (!name || !email || !phone || !address) {
      throw new Error('جميع الحقول مطلوبة')
    }

    // Check product quantity again before placing the order
    const latestProduct = await db.collection<Product>('products').findOne({ _id: productId })
    if (!latestProduct || latestProduct.quantity < 1) {
      throw new Error('المنتج غير متوفر حالياً')
    }

    const orderCode = generateOrderCode()

    // Decrease product quantity by 1
    await db.collection<Product>('products').updateOne(
      { _id: productId },
      { $inc: { quantity: -1 } }
    )

    await db.collection('orders').insertOne({
      orderCode,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      productId,
      productName: product.name.ar,
      productPrice: product.price,
      productCurrency: product.currency || 'USD',
      productImage: product.mainImage,
      quantity: 1,
      status: OrderStatus.Processing,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Send email with code (you should replace this with real email logic)
    console.log(`Send email to ${email} with code: ${orderCode}`)

    revalidatePath(`/client/product/${productId}`)
    redirect(`/client/verify/${orderCode}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">طلب منتج: {product.name.ar}</h1>
      <form action={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="الاسم الكامل"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="رقم الهاتف"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          placeholder="العنوان الكامل"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          متابعة
        </button>
      </form>
    </div>
  )
}

function generateOrderCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
