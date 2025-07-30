export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  _id?: string
  name: string
  description: string
  image: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Order {
  _id?: string
  orderCode: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "cash" | "card"
  createdAt?: Date
  updatedAt?: Date
}

export interface Language {
  code: string
  name: string
  direction: "ltr" | "rtl"
}

export interface Translations {
  [key: string]: {
    [key: string]: string
  }
}
