// Shared types
export type LocalizedString = {
  ar: string
  fr: string
}

// تاريخ الإنشاء والتحديث (اختياري)
export interface Timestamped {
  createdAt?: Date
  updatedAt?: Date
}

// تصنيف المنتج
export interface Category extends Timestamped {
  _id?: string
  name: LocalizedString
}

// المنتج
export interface Product extends Timestamped {
  _id?: string
  name: LocalizedString
  description: LocalizedString
  price: number
  currency?: string // عملة السعر (مثلاً: "USD", "EUR")
  images: string[]
  mainImage: string
  categoryId: string
  isVisible: boolean
  quantity: number
}

// حالة الطلب مع مراحل الدفع
export enum OrderStatus {
  Processing = "processing",       // الطلب قيد المعالجة (مثلاً بعد تعبئة النموذج)
  PaymentPending = "payment_pending", // في انتظار الدفع
  Paid = "paid",                   // تم الدفع
  Confirmed = "confirmed",         // تم تأكيد الطلب (ربما بعد الدفع والفحص)
  Rejected = "rejected",           // تم رفض الطلب
  Delivered = "delivered",         // تم التوصيل للعميل
}

// الطلب
export interface Order extends Timestamped {
  _id?: string
  orderCode: string                // كود الطلب الفريد
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  productId: string
  productName: string
  productPrice: number
  productCurrency?: string         // عملة السعر للمنتج داخل الطلب
  productImage: string
  quantity: number                 // كمية المنتج المطلوبة
  status: OrderStatus
  emailVerified?: boolean          // هل تم التحقق من الإيميل
  paymentIntentId?: string         // لتخزين id الدفع في Stripe
}

// كلمة مرور المسؤول (يمكن تخزين hash وليس كلمة المرور مباشرة)
export interface admin_passwords extends Timestamped {
  _id?: string
  passwordHash: string
}
