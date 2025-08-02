import type React from "react"
import type { Metadata } from "next"
import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "Admin Panel - Store Management",
  description: "Admin panel for managing store orders, products, and categories",
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
