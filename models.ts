export interface Product {
  _id?: string
  name: {
    ar: string
    fr: string
  }
  description: {
    ar: string
    fr: string
  }
  price: number
  images: string[]
  mainImage: string
  category: string
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id?: string
  name: {
    ar: string
    fr: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: string
  orderCode: string
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  status: "processing" | "confirmed" | "rejected" | "delivered"
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
}

export interface AdminPassword {
  _id?: string
  password: string
  createdAt: Date
  updatedAt: Date
}
