"use client"

import { Package, ShoppingCart, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useLanguage } from "@/app/providers"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const { t } = useLanguage()

  const menuItems = [
    {
      id: "products",
      title: t("products"),
      icon: Package,
    },
    {
      id: "categories",
      title: t("categories"),
      icon: Folder,
    },
    {
      id: "orders",
      title: t("orders"),
      icon: ShoppingCart,
    },
  ]

  return (
null
  )
}
