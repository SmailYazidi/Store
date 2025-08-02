"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingCart, Package, Tags, Settings, X } from "lucide-react"

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { name: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { name: "إدارة الطلبات", href: "/admin/orders", icon: ShoppingCart },
  { name: "إدارة المنتجات", href: "/admin/products", icon: Package },
  { name: "إدارة التصنيفات", href: "/admin/categories", icon: Tags },
  { name: "إعدادات الحساب", href: "/admin/account", icon: Settings },
]

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100",
                  )}
                  onClick={onClose}
                >
                  <item.icon className="ml-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
