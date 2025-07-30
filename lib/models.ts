import mongoose, { Schema, type Document } from "mongoose"

export interface Category extends Document {
  _id?: string
  name: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product extends Document {
  _id?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  tags: string[]
  specifications?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Order extends Document {
  _id?: string
  orderNumber: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "cash" | "card"
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  },
)

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    specifications: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
)

const OrderSchema = new Schema<Order>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    trackingNumber: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
)

export const CategoryModel = mongoose.models.Category || mongoose.model<Category>("Category", CategorySchema)
export const ProductModel = mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema)
export const OrderModel = mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema)
