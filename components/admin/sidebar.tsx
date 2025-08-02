"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { LayoutDashboard, ShoppingCart, Package, FolderOpen, Settings } from "lucide-react"

interface AdminSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  {
    name: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "إدارة الطلبات",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "إدارة المنتجات",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "إدارة التصنيفات",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    name: "إعدادات الحساب",
    href: "/admin/account",
    icon: Settings,
  },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">لوحة التحكم</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="ml-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
